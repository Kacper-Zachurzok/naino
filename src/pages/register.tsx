import { type FormEvent, useRef, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";

import { type CreateUserInput, createUserSchema } from "../schema/user.schema";

import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { NextURL } from "next/dist/server/web/next-url";
import type { ZodIssue } from "zod";
import AuthLayout from "../components/beltLayout";

const Home: NextPage = () => {
  const router = useRouter();
  const credentials = useRef<CreateUserInput>({
    email: "",
    fullName: "",
    originCountry: "",
    password: "",
    passwordConfirmation: "",
  });

  const [issues, setIssues] = useState<ZodIssue[]>([]);

  const register = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = createUserSchema.safeParse(credentials.current);
    if (!validation.success) return setIssues(validation.error.issues);

    const response = await fetch("/api/auth/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validation.data),
    });

    if (!response.ok) {
      if (response.status === 400 || response.status === 409) {
        const json = await response.json();
        const serverValidation = json as ZodIssue[];
        return setIssues(serverValidation);
      }
      return;
    }

    const autologin = await signIn("naino", {
      ...validation.data,
      redirect: false,
    });

    if (autologin?.ok) {
      const baseUrl = new NextURL(autologin?.url || "");
      const callbackUrl =
        baseUrl.searchParams.get("callbackUrl")?.toString() || "/";
      router.push(callbackUrl);
    }
  };

  return (
    <>
      <Head>
        <title>Naino</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthLayout>
        <form onSubmit={register}>
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
                const validation = createUserSchema.safeParse(
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
                <div className="issue" key={e.path[0]}>
                  {e.message}
                </div>
              ))}
          </div>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder=" "
              onChange={(e) => {
                credentials.current.fullName = e.target.value;
                setIssues(issues.filter((e) => e.path[0] !== "fullName"));
              }}
              onBlur={() => {
                const validation = createUserSchema.safeParse(
                  credentials.current
                );
                if (validation.success) return;
                const issue = validation.error.issues.find(
                  (e) => e.path[0] === "fullName"
                );
                if (issue) setIssues([...issues, issue]);
              }}
            />
            {issues
              .filter((e) => e.path[0] === "fullName")
              .map((e) => (
                <div className="issue" key={e.path[0]}>
                  {e.message}
                </div>
              ))}
          </div>
          <div className="form-group">
            <label htmlFor="originCountry">Country of Origin</label>
            <input
              id="originCountry"
              type="text"
              placeholder=" "
              onChange={(e) => {
                credentials.current.originCountry = e.target.value;
                setIssues(issues.filter((e) => e.path[0] !== "originCountry"));
              }}
              onBlur={() => {
                const validation = createUserSchema.safeParse(
                  credentials.current
                );
                if (validation.success) return;
                const issue = validation.error.issues.find(
                  (e) => e.path[0] === "originCountry"
                );
                if (issue) setIssues([...issues, issue]);
              }}
            />
            {issues
              .filter((e) => e.path[0] === "originCountry")
              .map((e) => (
                <div className="issue" key={e.path[0]}>
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
              onBlur={() => {
                const validation = createUserSchema.safeParse(
                  credentials.current
                );
                if (validation.success) return;
                const issue = validation.error.issues.find(
                  (e) => e.path[0] === "password"
                );
                if (issue) setIssues([...issues, issue]);
              }}
            />
            {issues
              .filter((e) => e.path[0] === "password")
              .map((e) => (
                <div className="issue" key={e.path[0]}>
                  {e.message}
                </div>
              ))}
          </div>
          <div className="form-group">
            <label htmlFor="passwordConfirmation">Confirm Password</label>
            <input
              id="passwordConfirmation"
              type="password"
              placeholder=" "
              onChange={(e) => {
                credentials.current.passwordConfirmation = e.target.value;
                setIssues(
                  issues.filter((e) => e.path[0] !== "passwordConfirmation")
                );
              }}
              onBlur={() => {
                const validation = createUserSchema.safeParse(
                  credentials.current
                );
                if (validation.success) return;
                const issue = validation.error.issues.find(
                  (e) => e.path[0] === "passwordConfirmation"
                );
                if (issue) setIssues([...issues, issue]);
              }}
            />
            {issues
              .filter((e) => e.path[0] === "passwordConfirmation")
              .map((e) => (
                <div className="issue" key={e.path[0]}>
                  {e.message}
                </div>
              ))}
          </div>
          <button className="btn">register</button>
        </form>
      </AuthLayout>
    </>
  );
};

export default Home;
