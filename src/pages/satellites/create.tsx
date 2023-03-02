import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

import Layout from "../../components/layout";
import { type FormEvent, useRef, useState } from "react";
import {
  type createSatelliteInput,
  createSatelliteSchema,
} from "../../schema/satellite.schema";

import type { Satellite } from "@prisma/client";
import type { ZodIssue } from "zod";

const Home: NextPage = () => {
  const router = useRouter();

  const [issues, setIssues] = useState<ZodIssue[]>([]);
  const satelliteCreator = useRef<createSatelliteInput>({
    sideNumber: "USA001",
    manufacturer: "General Electrics",
    model: "Storm",
    softwareVersion: "v81",
    manufactureYear: new Date().getFullYear(),
    launchDate: new Date().toString(),
    ammunition: 5,
    altitudeInOrbit: 600,
    hasAI: false,
  });

  const createSatellite = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = createSatelliteSchema.safeParse(
      satelliteCreator.current
    );
    if (!validation.success) return setIssues(validation.error.issues);

    const response = await fetch("/api/satellites", {
      method: "POST",
      body: JSON.stringify(satelliteCreator.current),
    });

    if (!response.ok) {
      const json = await response.json();
      return;
    }
    const satellite = (await response.json()) as Satellite;

    router.push(`/satellites/${satellite.id}`);
  };

  return (
    <>
      <Head>
        <title>Naino</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="grid flex-1 place-items-center">
          <form
            onSubmit={createSatellite}
            className="rounded-lg bg-[#00000077] p-[2rem]"
          >
            <div className="flex gap-12">
              <div>
                <div className="form-group">
                  <legend>Side Number</legend>
                  <input
                    type="text"
                    placeholder=" "
                    defaultValue={satelliteCreator.current.sideNumber}
                    onChange={(e) => {
                      satelliteCreator.current.sideNumber = e.target.value;
                      setIssues(
                        issues.filter((e) => e.path[0] !== "sideNumber")
                      );
                    }}
                    onBlur={() => {
                      const validation = createSatelliteSchema.safeParse(
                        satelliteCreator.current
                      );
                      if (validation.success) return;
                      const issue = validation.error.issues.find(
                        (e) => e.path[0] === "sideNumber"
                      );
                      if (issue) setIssues([...issues, issue]);
                    }}
                  />
                  {issues
                    .filter((e) => e.path[0] === "sideNumber")
                    .map((e) => (
                      <div className="issue" key={e.code}>
                        {e.message}
                      </div>
                    ))}
                </div>
                <div className="form-group">
                  <legend>Model</legend>
                  <input
                    type="text"
                    placeholder=" "
                    defaultValue={satelliteCreator.current.model}
                    onChange={(e) => {
                      satelliteCreator.current.model = e.target.value;
                      setIssues(issues.filter((e) => e.path[0] !== "model"));
                    }}
                    onBlur={() => {
                      const validation = createSatelliteSchema.safeParse(
                        satelliteCreator.current
                      );
                      if (validation.success) return;
                      const issue = validation.error.issues.find(
                        (e) => e.path[0] === "model"
                      );
                      if (issue) setIssues([...issues, issue]);
                    }}
                  />
                  {issues
                    .filter((e) => e.path[0] === "model")
                    .map((e) => (
                      <div className="issue" key={e.code}>
                        {e.message}
                      </div>
                    ))}
                </div>

                <div className="form-group">
                  <legend>Manufacturer</legend>
                  <input
                    type="text"
                    placeholder=" "
                    defaultValue={satelliteCreator.current.manufacturer}
                    onChange={(e) => {
                      satelliteCreator.current.manufacturer = e.target.value;
                      setIssues(
                        issues.filter((e) => e.path[0] !== "manufacturer")
                      );
                    }}
                    onBlur={() => {
                      const validation = createSatelliteSchema.safeParse(
                        satelliteCreator.current
                      );
                      if (validation.success) return;
                      const issue = validation.error.issues.find(
                        (e) => e.path[0] === "manufacturer"
                      );
                      if (issue) setIssues([...issues, issue]);
                    }}
                  />
                  {issues
                    .filter((e) => e.path[0] === "manufacturer")
                    .map((e) => (
                      <div className="issue" key={e.code}>
                        {e.message}
                      </div>
                    ))}
                </div>
                <div className="form-group">
                  <legend>Year of Manufactor</legend>
                  <input
                    type="number"
                    placeholder=" "
                    defaultValue={satelliteCreator.current.manufactureYear}
                    onChange={(e) => {
                      satelliteCreator.current.manufactureYear = parseInt(
                        e.target.value
                      );
                      setIssues(
                        issues.filter((e) => e.path[0] !== "manufactureYear")
                      );
                    }}
                    onBlur={() => {
                      const validation = createSatelliteSchema.safeParse(
                        satelliteCreator.current
                      );
                      if (validation.success) return;
                      const issue = validation.error.issues.find(
                        (e) => e.path[0] === "manufactureYear"
                      );
                      if (issue) setIssues([...issues, issue]);
                    }}
                  />
                  {issues
                    .filter((e) => e.path[0] === "manufactureYear")
                    .map((e) => (
                      <div className="issue" key={e.code}>
                        {e.message}
                      </div>
                    ))}
                </div>
                <div className="form-group">
                  <legend>Date of Launch</legend>
                  <input
                    type="date"
                    placeholder=" "
                    defaultValue={
                      new Date(satelliteCreator.current.launchDate)
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) => {
                      satelliteCreator.current.launchDate = e.target.value;
                      setIssues(
                        issues.filter((e) => e.path[0] !== "launchDate")
                      );
                    }}
                    onBlur={() => {
                      const validation = createSatelliteSchema.safeParse(
                        satelliteCreator.current
                      );
                      if (validation.success) return;
                      const issue = validation.error.issues.find(
                        (e) => e.path[0] === "launchDate"
                      );
                      if (issue) setIssues([...issues, issue]);
                    }}
                  />
                  {issues
                    .filter((e) => e.path[0] === "launchDate")
                    .map((e) => (
                      <div className="issue" key={e.code}>
                        {e.message}
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <div className="form-group">
                  <legend>Software Version</legend>
                  <input
                    type="text"
                    placeholder=" "
                    defaultValue={satelliteCreator.current.softwareVersion}
                    onChange={(e) => {
                      satelliteCreator.current.softwareVersion = e.target.value;
                      setIssues(
                        issues.filter((e) => e.path[0] !== "softwareVersion")
                      );
                    }}
                    onBlur={() => {
                      const validation = createSatelliteSchema.safeParse(
                        satelliteCreator.current
                      );
                      if (validation.success) return;
                      const issue = validation.error.issues.find(
                        (e) => e.path[0] === "softwareVersion"
                      );
                      if (issue) setIssues([...issues, issue]);
                    }}
                  />
                  {issues
                    .filter((e) => e.path[0] === "softwareVersion")
                    .map((e) => (
                      <div className="issue" key={e.code}>
                        {e.message}
                      </div>
                    ))}
                </div>
                <div className="form-group">
                  <legend>Ammunition</legend>
                  <input
                    type="number"
                    placeholder=" "
                    defaultValue={satelliteCreator.current.ammunition}
                    onChange={(e) => {
                      satelliteCreator.current.ammunition = parseInt(
                        e.target.value
                      );
                      setIssues(
                        issues.filter((e) => e.path[0] !== "ammunition")
                      );
                    }}
                    onBlur={() => {
                      const validation = createSatelliteSchema.safeParse(
                        satelliteCreator.current
                      );
                      if (validation.success) return;
                      const issue = validation.error.issues.find(
                        (e) => e.path[0] === "ammunition"
                      );
                      if (issue) setIssues([...issues, issue]);
                    }}
                  />
                  {issues
                    .filter((e) => e.path[0] === "ammunition")
                    .map((e) => (
                      <div className="issue" key={e.code}>
                        {e.message}
                      </div>
                    ))}
                </div>
                <div className="form-group">
                  <legend>Orbital Height</legend>
                  <input
                    type="number"
                    placeholder=" "
                    defaultValue={satelliteCreator.current.altitudeInOrbit}
                    onChange={(e) => {
                      satelliteCreator.current.altitudeInOrbit = parseInt(
                        e.target.value
                      );
                      setIssues(
                        issues.filter((e) => e.path[0] !== "altitudeInOrbit")
                      );
                    }}
                    onBlur={() => {
                      const validation = createSatelliteSchema.safeParse(
                        satelliteCreator.current
                      );
                      if (validation.success) return;
                      const issue = validation.error.issues.find(
                        (e) => e.path[0] === "altitudeInOrbit"
                      );
                      if (issue) setIssues([...issues, issue]);
                    }}
                  />
                  {issues
                    .filter((e) => e.path[0] === "altitudeInOrbit")
                    .map((e) => (
                      <div className="issue" key={e.code}>
                        {e.message}
                      </div>
                    ))}
                </div>
                <div className="form-group">
                  <legend>
                    <input
                      type="checkbox"
                      placeholder="hasAI"
                      defaultChecked={satelliteCreator.current.hasAI}
                      onChange={(e) => {
                        satelliteCreator.current.hasAI = e.target.checked;
                        setIssues(issues.filter((e) => e.path[0] !== "hasAI"));
                      }}
                      onBlur={() => {
                        const validation = createSatelliteSchema.safeParse(
                          satelliteCreator.current
                        );
                        if (validation.success) return;
                        const issue = validation.error.issues.find(
                          (e) => e.path[0] === "hasAI"
                        );
                        if (issue) setIssues([...issues, issue]);
                      }}
                    />
                    AI
                  </legend>
                  {issues
                    .filter((e) => e.path[0] === "hasAI")
                    .map((e) => (
                      <div className="issue" key={e.code}>
                        {e.message}
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <button className="btn">create</button>
            </div>
          </form>
        </div>
        <div className="absolute bottom-0 right-0 flex flex-col rounded-lg bg-[#00000077] p-[1rem]">
          <Link href="/">
            <div className="btn">Go Back</div>
          </Link>
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default Home;
