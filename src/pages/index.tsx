import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";

import { useQuery } from "react-query";
import Layout from "../components/layout";
import { authOptions } from "./api/auth/[...nextauth]";
import type { Satellite } from "@prisma/client";
import SatelliteBox from "../components/satelliteBox";

const fetchSatellites = async () => {
  const res = await fetch("/api/satellites/");
  const json = await res.json();
  return json as Satellite[];
};

const Home: NextPage = () => {
  const { data: Satellites } = useQuery("satellites", fetchSatellites, {
    initialData: [],
  });

  return (
    <>
      <Head>
        <title>Naino</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex flex-wrap justify-between gap-4 p-[2rem]">
          {Satellites?.map((satellite) => (
            <SatelliteBox key={satellite.id} satellite={satellite} />
          ))}
        </div>
        <div className="absolute bottom-0 right-0 flex flex-col rounded-lg bg-[#00000077] p-[1rem]">
          <Link href="/satellites/create">
            <div className="btn">Create Satellite</div>
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
