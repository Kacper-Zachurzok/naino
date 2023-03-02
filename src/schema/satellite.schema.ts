import { boolean, number, object, string, type TypeOf } from "zod";

const sideNumberSchema = string({
  required_error: "Side number is required",
}).min(3, {
  message: "Side number must contains more than 3 characters",
});

const manufacturerSchema = string({
  required_error: "Manufacturer is required",
}).min(1, {
  message: "Manufacturer must contains more than 1 character",
});

const modelSchema = string({ required_error: "Model is required" }).min(1, {
  message: "Model must contains more than 1 character",
});

const softwareVersionSchema = string({
  required_error: "Software version is required",
}).min(1, {
  message: "Software version must contains more than 1 character",
});

const manufactureYearSchema = number({
  required_error: "Manufacture year is required",
}).refine(
  (year) => {
    return year > 1900 && year <= new Date().getFullYear();
  },
  {
    message:
      "Manufacture year shouldn't be greater than the current date and less than 1900",
  }
);

const launchDateSchema = string({
  required_error: "Launch date is required",
}).refine(
  (date) => {
    return new Date(date) > new Date("1-1-1970") && new Date(date) < new Date();
  },
  {
    message:
      "Launch date shouldn't be greater than the current date and less than 1970",
  }
);

const ammunitionSchema = number({
  required_error: "Ammunition is required!",
}).min(0, { message: "Ammunition must be at least 0" });

const altitudeInOrbitSchema = number({
  required_error: "Altitude in orbit is required",
}).min(1, { message: "Altitued must be at least 1" });

const hasAISchema = boolean({ required_error: "AI check is required" });

export const createSatelliteSchema = object({
  sideNumber: sideNumberSchema,
  manufacturer: manufacturerSchema,
  model: modelSchema,
  softwareVersion: softwareVersionSchema,
  manufactureYear: manufactureYearSchema,
  launchDate: launchDateSchema,
  ammunition: ammunitionSchema,
  altitudeInOrbit: altitudeInOrbitSchema,
  hasAI: hasAISchema,
});

export const editSatelliteSchema = object({
  sideNumber: sideNumberSchema.optional(),
  manufacturer: manufacturerSchema.optional(),
  model: modelSchema.optional(),
  softwareVersion: softwareVersionSchema.optional(),
  manufactureYear: manufactureYearSchema.optional(),
  launchDate: launchDateSchema.optional(),
  ammunition: ammunitionSchema.optional(),
  altitudeInOrbit: altitudeInOrbitSchema.optional(),
  hasAI: hasAISchema.optional(),
});

export type createSatelliteInput = TypeOf<typeof createSatelliteSchema>;
export type editSatelliteInput = TypeOf<typeof editSatelliteSchema>;
