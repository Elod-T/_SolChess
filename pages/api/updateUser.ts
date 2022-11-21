import { getUser } from "./auth/[...thirdweb]";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client/edge";

const prisma = new PrismaClient();

interface Req extends NextApiRequest {
  query: {
    id: string;
    name: string;
    address: string;
  };
}

const handler = async (req: Req, res: NextApiResponse) => {
  if (req.method !== "PUT") {
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

  const userData = await prisma.user.update({
    where: {
      wallet: req.query.address,
    },
    data: {
      name: req.query.name,
    },
  });

  res.json(userData);
};

export default handler;
