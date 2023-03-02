import { object, string, type TypeOf } from "zod";

const emailSchema = string({ required_error: "Email is required" })
  .email({
    message: "Email is not valid",
  })
  .max(255, { message: "Email is to long - should be max 255 characters" });
const passwordSchema = string({
  required_error: "Password is required",
});

export const loginUserSchema = object({
  email: emailSchema,
  password: passwordSchema,
});
export type LoginUserInput = TypeOf<typeof loginUserSchema>;

const passwordWithValidationSchema = passwordSchema.refine(
  (data) => {
    const regex = /^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
    return !!data.match(regex);
  },
  {
    message:
      "Password is too simple - should be at least 6 letters, 1 digit and 1 special character",
  }
);

export const createUserSchema = object({
  email: emailSchema,
  fullName: string().min(1, { message: "Full Name is required" }),
  originCountry: string().min(1, { message: "Country of Origin is required" }),
  password: passwordWithValidationSchema,
  passwordConfirmation: passwordSchema,
}).refine(
  (data) => {
    return data.password === data.passwordConfirmation;
  },
  { message: "Passwords do not match", path: ["passwordConfirmation"] }
);
export type CreateUserInput = TypeOf<typeof createUserSchema>;
