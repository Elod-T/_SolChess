import { getUser } from "./auth/[...thirdweb]";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client/edge";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "DELETE") {
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
    return res.status(404).json({
      message: "User not found.",
    });
  }

  await prisma.user.updateMany({
    where: {
      gameId: userData.gameId,
    },
    data: {
      gameId: null,
    },
  });

  try {
    const deleted = await prisma.game.deleteMany({
      where: {
        id: userData.gameId as string,
      },
    });
    res.json(deleted);
  } catch (e) {
    console.error(e);
    return res.status(300).json({
      message: "Game not found.",
    });
  }
};

export default handler;
