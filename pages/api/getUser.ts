import { getUser } from "./auth/[...thirdweb]";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client/edge";

const prisma = new PrismaClient();

interface Req extends NextApiRequest {
  query: {
    address?: string;
    id?: string;
  };
}

const handler = async (req: Req, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(400).json({
      message: "Invalid method.",
    });
  }

  if (req.query.address) {
    const user = await getUser(req);

    if (!user) {
      return res.status(401).json({
        message: "Not authorized.",
      });
    }

    const userData = await prisma.user.findUnique({
      where: {
        wallet: req.query.address,
      },
    });

    res.json(userData);
  } else {
    const userData = await prisma.user.findUnique({
      where: {
        id: req.query.id,
      },
    });

    res.json(userData);
  }
};

export default handler;
