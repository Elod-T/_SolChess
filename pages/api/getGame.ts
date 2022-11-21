import { getUser } from "./auth/[...thirdweb]";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client/edge";

const prisma = new PrismaClient();

interface Req extends NextApiRequest {
  query: {
    id: string;
  };
}

const handler = async (req: Req, res: NextApiResponse) => {
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

  const gameData = await prisma.game.findFirst({
    where: {
      id: req.query.id,
    },
  });

  res.json(gameData);
};

export default handler;
