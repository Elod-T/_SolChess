import { getUser } from "./auth/[...thirdweb]";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client/edge";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(400).json({
      message: "Invalid method.",
    });
  }

  const user = await getUser(req);
  if (!user) {
    return res.status(401).json({
      message: "Not authorized.",
    });
  }

  const gameData = await prisma.game.findMany({
    where: {
      state: "playing",
    },
  });

  const games = await Promise.all(
    gameData.map(async (game) => {
      const players = await prisma.user.findMany({
        where: {
          gameId: game.id,
        },
      });

      return {
        ...game,
        players,
      };
    })
  );

  res.json(games);
};

export default handler;
