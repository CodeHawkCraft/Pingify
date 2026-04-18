import * as yup from "yup";
import type { AuthPayload } from "../types/auth.types";

export const signupSchema: yup.ObjectSchema<AuthPayload> = yup.object({
  username: yup
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    )
    .required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters")
    .required("Password is required"),
});

export const loginSchema: yup.ObjectSchema<AuthPayload> = yup.object({
  username: yup
    .string()
    .trim()
    .min(1, "Username is required")
    .required("Username is required"),
  password: yup
    .string()
    .min(1, "Password is required")
    .required("Password is required"),
});
