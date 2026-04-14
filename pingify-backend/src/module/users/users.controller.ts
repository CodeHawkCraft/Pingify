import type { Request, Response } from "express";
import { successResponse } from "../../utils/api-response.ts";
import { getUser } from "./users.service.ts";

export async function getMeController(req: Request, res: Response) {
  const user = await getUser(req.user.id);
  res.json(successResponse(user, "User fetched successfully"));
}
