import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({ required_error: "Name is required" }),
    email: string({ required_error: "Email is required" }).email(
      "Invalid email",
    ),
    password: string({ required_error: "Password is required" })
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirm: string({ required_error: "Please confirm your password" }),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email or password",
    ),
    password: string({ required_error: "Password is required" }).min(
      8,
      "Invalid email or password",
    ),
  }),
});

export const updateUserSchema = object({
  body: object({
    name: string({ required_error: "Name is required" }),
    emailAddress: string({ required_error: "Email is required" }).email(
      "Invalid email",
    ),
    username: string({ required_error: "Username is required" }),
    accountNumber: string({ required_error: "Account number is required" }),
  }),

  params: object({
    id: string({ required_error: "Id is required" }),
  }),
});

export const updateMeSchema = object({
  body: object({
    name: string({ required_error: "Name is required" }),
    emailAddress: string({ required_error: "Email is required" }).email(
      "Invalid email",
    ),
    username: string({ required_error: "Username is required" }),
    accountNumber: string({ required_error: "Account number is required" }),
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
export type LoginUserInput = TypeOf<typeof loginUserSchema>["body"];
export type UpdateUserInput = TypeOf<typeof updateUserSchema>["body"];
export type UpdateMeInput = TypeOf<typeof updateMeSchema>["body"];
