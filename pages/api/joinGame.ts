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

  const games = await prisma.game.findMany({
    where: {
      state: "queue",
    },
    orderBy: {
      id: "asc",
    },
  });

  const game = games[0];

  if (!game) {
    return res.status(300).json({
      message: "No games available.",
    });
  }

  const white = game.white == "";

  const joinedGame = await prisma.game.update({
    where: {
      id: game.id,
    },
    data: {
      state: "playing",
      white: white ? userData.id : game.white,
      black: white ? game.black : userData.id,
    },
  });

  await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      gameId: joinedGame.id,
    },
  });

  res.json(joinedGame);
};

export default handler;
