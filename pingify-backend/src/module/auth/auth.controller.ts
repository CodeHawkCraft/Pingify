import type { Request, Response } from "express";
import { successResponse } from "../../utils/api-response.ts";
import { signup, login } from "./auth.service.ts";
import { AUTH_COOKIE_OPTIONS } from "./auth.utils.ts";

export async function signupController(req: Request, res: Response) {
  const user = await signup(req.body);
  res.status(201).json(successResponse(user, "User created successfully"));
}

export async function loginController(req: Request, res: Response) {
  const { user, token } = await login(req.body);

  res.cookie("token", token, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json(successResponse(user, "Login successful"));
}

export function logoutController(_req: Request, res: Response) {
  res.clearCookie("token", AUTH_COOKIE_OPTIONS);

  res.json(successResponse(null, "Logout successful"));
}
