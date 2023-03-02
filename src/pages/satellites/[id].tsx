import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { getServerSession } from "next-auth";

import { useQuery } from "react-query";
import { authOptions } from "../api/auth/[...nextauth]";

import type { Satellite } from "@prisma/client";
import Layout from "../../components/layout";
import type { ZodIssue } from "zod";
import { type FormEvent, type MouseEvent, useRef, useState } from "react";
import {
  type editSatelliteInput,
  editSatelliteSchema,
} from "../../schema/satellite.schema";

const fetchSatellite = async (id: string) => {
  const response = await fetch(`/api/satellites/${id}`);
  if (!response.ok) return undefined;
  return (await response.json()) as Satellite;
};

const Home: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const sid = `${id}`;

  const [issues, setIssues] = useState<ZodIssue[]>([]);
  const editingSatellite = useRef<editSatelliteInput>({});
  const { data: Satellite } = useQuery(
    `satellite-${sid}`,
    () => fetchSatellite(sid),
    { initialData: undefined }
  );

  const deleteSatellite = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await fetch(`/api/satellites/${Satellite?.id}`, {
      method: "DELETE",
    });
    if (response.ok) router.push("/");
  };

  const editSatellite = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.keys(editingSatellite).length === 0) return;

    const validation = editSatelliteSchema.safeParse(editingSatellite.current);
    if (!validation.success) return setIssues(validation.error.issues);

    const response = await fetch(`/api/satellites/${Satellite?.id}`, {
      method: "PUT",
      body: JSON.stringify(editingSatellite.current),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const json = await response.json();
        const serverValidation = json as ZodIssue[];
        return setIssues(serverValidation);
      }
      return;
    }

    return router.reload();
  };

  return (
    <>
      <Head>
        <title>Naino</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex flex-1 flex-col items-center justify-center">
          {Satellite ? (
            <form
              onSubmit={editSatellite}
              className="rounded-lg bg-[#00000077] p-[2rem]"
            >
              <div className="flex gap-12">
                <div>
                  <div className="form-group">
                    <legend>Side Number</legend>
                    <input
                      type="text"
                      placeholder=" "
                      defaultValue={Satellite.sideNumber}
                      onChange={(e) => {
                        editingSatellite.current.sideNumber = e.target.value;
                        setIssues(
                          issues.filter((e) => e.path[0] !== "sideNumber")
                        );
                        if (e.target.value === Satellite.sideNumber)
                          delete editingSatellite.current.sideNumber;
                      }}
                      onBlur={() => {
                        const validation = editSatelliteSchema.safeParse(
                          editingSatellite.current
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
                      defaultValue={Satellite.model}
                      onChange={(e) => {
                        editingSatellite.current.model = e.target.value;
                        setIssues(issues.filter((e) => e.path[0] !== "model"));
                        if (e.target.value === Satellite.model)
                          delete editingSatellite.current.model;
                      }}
                      onBlur={() => {
                        const validation = editSatelliteSchema.safeParse(
                          editingSatellite.current
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
                      defaultValue={Satellite.manufacturer}
                      onChange={(e) => {
                        editingSatellite.current.manufacturer = e.target.value;
                        setIssues(
                          issues.filter((e) => e.path[0] !== "manufacturer")
                        );
                        if (e.target.value === Satellite.manufacturer)
                          delete editingSatellite.current.manufacturer;
                      }}
                      onBlur={() => {
                        const validation = editSatelliteSchema.safeParse(
                          editingSatellite.current
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
                      defaultValue={Satellite.manufactureYear}
                      onChange={(e) => {
                        editingSatellite.current.manufactureYear = parseInt(
                          e.target.value
                        );
                        setIssues(
                          issues.filter((e) => e.path[0] !== "manufactureYear")
                        );
                        if (
                          parseInt(e.target.value) === Satellite.manufactureYear
                        )
                          delete editingSatellite.current.manufactureYear;
                      }}
                      onBlur={() => {
                        const validation = editSatelliteSchema.safeParse(
                          editingSatellite.current
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
                        new Date(Satellite.launchDate)
                          .toISOString()
                          .split("T")[0]
                      }
                      onChange={(e) => {
                        editingSatellite.current.launchDate = e.target.value;
                        setIssues(
                          issues.filter((e) => e.path[0] !== "launchDate")
                        );
                        if (
                          e.target.value ===
                          new Date(Satellite.launchDate)
                            .toISOString()
                            .split("T")[0]
                        )
                          delete editingSatellite.current.launchDate;
                      }}
                      onBlur={() => {
                        const validation = editSatelliteSchema.safeParse(
                          editingSatellite.current
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
                      defaultValue={Satellite.softwareVersion}
                      onChange={(e) => {
                        editingSatellite.current.softwareVersion =
                          e.target.value;
                        setIssues(
                          issues.filter((e) => e.path[0] !== "softwareVersion")
                        );
                        if (e.target.value === Satellite.softwareVersion)
                          delete editingSatellite.current.softwareVersion;
                      }}
                      onBlur={() => {
                        const validation = editSatelliteSchema.safeParse(
                          editingSatellite.current
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
                      defaultValue={Satellite.ammunition}
                      onChange={(e) => {
                        editingSatellite.current.ammunition = parseInt(
                          e.target.value
                        );
                        setIssues(
                          issues.filter((e) => e.path[0] !== "ammunition")
                        );
                        if (parseInt(e.target.value) === Satellite.ammunition)
                          delete editingSatellite.current.ammunition;
                      }}
                      onBlur={() => {
                        const validation = editSatelliteSchema.safeParse(
                          editingSatellite.current
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
                      defaultValue={Satellite.altitudeInOrbit}
                      onChange={(e) => {
                        editingSatellite.current.altitudeInOrbit = parseInt(
                          e.target.value
                        );
                        setIssues(
                          issues.filter((e) => e.path[0] !== "altitudeInOrbit")
                        );
                        if (
                          parseInt(e.target.value) === Satellite.altitudeInOrbit
                        )
                          delete editingSatellite.current.altitudeInOrbit;
                      }}
                      onBlur={() => {
                        const validation = editSatelliteSchema.safeParse(
                          editingSatellite.current
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
                        defaultChecked={Satellite.hasAI}
                        onChange={(e) => {
                          editingSatellite.current.hasAI = e.target.checked;
                          setIssues(
                            issues.filter((e) => e.path[0] !== "hasAI")
                          );
                          if (e.target.checked === Satellite.hasAI)
                            delete editingSatellite.current.hasAI;
                        }}
                        onBlur={() => {
                          const validation = editSatelliteSchema.safeParse(
                            editingSatellite.current
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
              <div className="flex justify-between gap-2">
                <button className="btn" onClick={deleteSatellite}>
                  delete
                </button>
                <button
                  className="btn"
                  disabled={Object.keys(editingSatellite.current).length === 0}
                >
                  save
                </button>
              </div>
            </form>
          ) : (
            <div className="rounded-lg bg-[#00000077] p-[2rem]">
              <p>Nothing is here</p>
              <Link href="/">
                <button className="btn">Go Back</button>
              </Link>
            </div>
          )}
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
