import NextAuth, { type NextAuthOptions } from "next-auth";
import { env } from "../../../env/server.mjs";
// Prisma adapter for NextAuth, optional and can be removed
import { prisma } from "../../../server/db/client";

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { loginUserSchema } from "../../../schema/user.schema";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, token }) {
      const user = await prisma.user.findFirst({
        where: {
          id: token.sub,
        },
        select: {
          president: true,
        },
      });
      if (user) session.president = user.president;

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      id: "naino",
      name: "naino",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "name@company.com",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "password",
        },
      },
      authorize: async (credentials) => {
        const validation = loginUserSchema.safeParse(credentials);
        if (!validation.success)
          throw new Error(JSON.stringify(validation.error.errors));

        const { email, password } = validation.data;

        const user = await prisma.user.findFirst({
          where: {
            email,
          },
        });

        if (!user) return null;
        if (!bcrypt.compareSync(password, user.password)) return null;

        return user;
      },
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
