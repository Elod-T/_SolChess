import { getUser } from "./auth/[...thirdweb]";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client/edge";

const prisma = new PrismaClient();

interface Req extends NextApiRequest {
  query: {
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
  console.log(req.query.name);

  const user = await getUser(req);

  if (!user) {
    return res.status(401).json({
      message: "Not authorized.",
    });
  }

  const userData = await prisma.user.create({
    data: {
      wallet: req.query.address,
      name: req.query.name,
    },
  });

  res.json(userData);
};

export default handler;
