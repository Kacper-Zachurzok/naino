import type { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { prisma } from "../../../server/db/client";
import methodMiddleware from "../../../utils/methodMiddleware";
import zodMiddleware from "../../../utils/zodMiddleware";
import { createSatelliteSchema } from "../../../schema/satellite.schema";

const getSatellites = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });
  if (!session?.president) return res.status(401);

  const satelites = await prisma.satellite.findMany({
    where: {
      ownerships: {
        some: {
          presidentId: session.president.id,
        },
      },
    },
  });

  return res.status(200).json(satelites);
};

const postSatellite = zodMiddleware(
  { body: createSatelliteSchema },
  async (
    req,
    res,
    {
      body: {
        altitudeInOrbit,
        ammunition,
        hasAI,
        launchDate,
        manufactureYear,
        manufacturer,
        model,
        sideNumber,
        softwareVersion,
      },
    }
  ) => {
    const session = await getServerAuthSession({ req, res });
    if (!session?.president) return res.status(401);

    const satellite = await prisma.satellite.create({
      data: {
        altitudeInOrbit,
        ammunition,
        hasAI,
        launchDate: new Date(launchDate),
        manufactureYear,
        manufacturer,
        model,
        sideNumber,
        softwareVersion,
      },
    });

    await prisma.ownership.create({
      data: {
        satelliteId: satellite.id,
        presidentId: session.president.id,
      },
    });

    return res.status(201).json(satellite);
  }
);

methodMiddleware({});

export default methodMiddleware({ GET: getSatellites, POST: postSatellite });
