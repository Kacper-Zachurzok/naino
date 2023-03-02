import { prisma } from "../../../server/db/client";
import methodMiddleware from "../../../utils/methodMiddleware";
import zodMiddleware from "../../../utils/zodMiddleware";

import { object, string } from "zod";
import { editSatelliteSchema } from "../../../schema/satellite.schema";

const querySatelliteSchema = object({
  id: string(),
});

const getSatellite = zodMiddleware(
  { query: querySatelliteSchema },
  async (req, res, { query: { id } }) => {
    const satelite = await prisma.satellite.findFirst({
      where: {
        id,
      },
    });
    if (!satelite) return res.status(404).json({});

    return res.status(200).json(satelite);
  }
);
const deleteSatellite = zodMiddleware(
  { query: querySatelliteSchema },
  async (req, res, { query: { id } }) => {
    const satelite = await prisma.satellite.delete({
      where: {
        id,
      },
    });

    if (satelite) return res.status(204).json({});
    return res.status(404).json({});
  }
);

const putSatellite = zodMiddleware(
  { query: querySatelliteSchema, body: editSatelliteSchema },
  async (req, res, { query: { id }, body }) => {
    const satelite = await prisma.satellite.update({
      where: {
        id,
      },
      data: body,
    });

    if (!satelite) return res.status(404).json({});

    return res.status(200).json(satelite);
  }
);

export default methodMiddleware({
  GET: getSatellite,
  DELETE: deleteSatellite,
  PUT: putSatellite,
});
