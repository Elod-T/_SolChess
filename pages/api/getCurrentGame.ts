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

  const userData = await prisma.user.findUnique({
    where: {
      wallet: user.address,
    },
  });

  if (!userData?.gameId) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  const gameData = await prisma.game.findUnique({
    where: {
      id: userData.gameId,
    },
  });

  res.json(gameData);
};

export default handler;
