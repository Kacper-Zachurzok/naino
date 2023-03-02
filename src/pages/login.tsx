import { type FormEvent, useRef, useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { signIn } from "next-auth/react";
import { type LoginUserInput, loginUserSchema } from "../schema/user.schema";
import { useRouter } from "next/router";
import { NextURL } from "next/dist/server/web/next-url";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import type { ZodIssue } from "zod";
import AuthLayout from "../components/beltLayout";

const Home: NextPage = () => {
  const router = useRouter();

  const [issues, setIssues] = useState<ZodIssue[]>([]);
  const credentials = useRef<LoginUserInput>({
    email: "",
    password: "",
  });

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = loginUserSchema.safeParse(credentials.current);
    if (!validation.success) return setIssues(validation.error.issues);

    const response = await signIn("naino", {
      ...validation.data,
      redirect: false,
    });
    if (!response?.ok) {
      if (response?.status === 401)
        return setIssues([
          {
            path: ["email"],
            message: "Invalid email or password",
          } as ZodIssue,
        ]);
      return setIssues([
        {
          path: ["email"],
          message: "Unknown error",
        } as ZodIssue,
      ]);
    }

    const baseUrl = new NextURL(response?.url || "");
    const callbackUrl =
      baseUrl.searchParams.get("callbackUrl")?.toString() || "/";

    router.push(callbackUrl);
  };

  return (
    <>
      <Head>
        <title>Naino</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthLayout>
        <form onSubmit={login}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="text"
              placeholder=" "
              onChange={(e) => {
                credentials.current.email = e.target.value;
                setIssues(issues.filter((e) => e.path[0] !== "email"));
              }}
              onBlur={() => {
                const validation = loginUserSchema.safeParse(
                  credentials.current
                );
                if (validation.success) return;
                const issue = validation.error.issues.find(
                  (e) => e.path[0] === "email"
                );
                if (issue) setIssues([...issues, issue]);
              }}
            />
            {issues
              .filter((e) => e.path[0] === "email")
              .map((e) => (
                <div className="issue" key={e.code}>
                  {e.message}
                </div>
              ))}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder=" "
              onChange={(e) => {
                credentials.current.password = e.target.value;
                setIssues(issues.filter((e) => e.path[0] !== "password"));
              }}
            />
            {issues
              .filter((e) => e.path[0] === "password")
              .map((e) => (
                <div className="issue" key={e.code}>
                  {e.message}
                </div>
              ))}
          </div>

          <button className="btn">login</button>
          <Link href="/register">
            <p className="my-2 text-right text-lg text-blue-400 underline">
              {"Don't have an account?"}
            </p>
          </Link>
        </form>
      </AuthLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default Home;
