import type { Request, Response } from "express";
import { successResponse } from "../../utils/api-response.ts";
import { signup, login } from "./auth.service.ts";
import env from "../../env.ts";

export async function signupController(req: Request, res: Response) {
  const user = await signup(req.body);
  res.status(201).json(successResponse(user, "User created successfully"));
}

export async function loginController(req: Request, res: Response) {
  const { user, token } = await login(req.body);

  res.cookie("token", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json(successResponse(user, "Login successful"));
}
