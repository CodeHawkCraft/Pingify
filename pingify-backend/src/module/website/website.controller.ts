import type { Request, Response } from "express";
import { successResponse } from "../../utils/api-response.ts";
import { create } from "./website.service.ts";

export async function createWebsiteController(req: Request, res: Response) {
  const website = await create(req.body, req.user.id);
  res.status(201).json(successResponse(website, "Website added successfully"));
}
