import type { NextApiHandler } from "next";

import { prisma } from "../../../server/db/client";
import { Prisma } from "@prisma/client";

import { createUserSchema } from "../../../schema/user.schema";
import bcrypt from "bcrypt";

import type { ZodIssue } from "zod";

const register: NextApiHandler = async (req, res) => {
  const validation = createUserSchema.safeParse(req.body);
  if (!validation.success) return res.status(400).json(validation.error.issues);

  const { email, password, fullName, originCountry } = validation.data;
  const hash = await bcrypt.hash(password, 10);

  try {
    const president = await prisma.president.create({
      data: {
        fullName,
        originCountry,
      },
    });

    await prisma.user.create({
      data: {
        presidentId: president.id,
        email,
        password: hash,
      },
    });
    return res.status(200).json(president);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return res
        .status(409)
        .json([{ path: ["email"], message: "Email is taken" }] as ZodIssue[]);
    }
    console.warn(e);
    return res.status(500).json({});
  }
};

export default register;
