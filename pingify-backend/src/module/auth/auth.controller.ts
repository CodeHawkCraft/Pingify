import type { Request, Response } from "express";
import { successResponse } from "../../utils/api-response.ts";
import { signup } from "./auth.service.ts";

export async function signupController(req: Request, res: Response) {
  const user = await signup(req.body);
  res.status(201).json(successResponse(user, "User created successfully"));
}
