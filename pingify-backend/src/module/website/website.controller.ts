import type { Request, Response } from "express";
import { successResponse } from "../../utils/api-response.ts";
import { create, getWebsites, getPingLogs } from "./website.service.ts";
import { pingLogsQuerySchema, getWebsitesQuerySchema } from "./website.validator.ts";

export async function getWebsitesController(req: Request, res: Response) {
  const query = getWebsitesQuerySchema.parse(req.query);
  const result = await getWebsites(req.user.id, query);
  res.json(successResponse(result, "Websites fetched successfully"));
}

export async function createWebsiteController(req: Request, res: Response) {
  const website = await create(req.body, req.user.id);
  res.status(201).json(successResponse(website, "Website added successfully"));
}

export async function getPingLogsController(req: Request, res: Response) {
  const { websiteId } = req.params;
  const query = pingLogsQuerySchema.parse(req.query);
  const result = await getPingLogs(websiteId as string, req.user.id, query);
  res.json(successResponse(result, "Ping logs fetched successfully"));
}
