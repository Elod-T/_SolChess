import { getUser } from "./auth/[...thirdweb]";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client/edge";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
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

  if (!userData) {
    return res.status(401).json({
      message: "Error retrieving user data.",
    });
  }

  if (userData.gameId != null) {
    return res.status(400).json({
      message: "User already in a game.",
    });
  }

  const white = Math.random() < 0.5;

  const game = await prisma.game.create({
    data: {
      state: "queue",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      white: white ? userData.id : "",
      black: white ? "" : userData.id,
    },
  });

  await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      gameId: game.id,
    },
  });

  res.json(game);
};

export default handler;
