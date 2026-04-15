import { db, TABLES } from "../../database/db.ts";
import { ApiError } from "../../utils/api-error.ts";
import {
  findWebsiteByUrlAndUser,
  findWebsiteByNameAndUser,
  createWebsite,
  findWebsitesByUser,
  findPingLogs,
  // findStatusSummary,
} from "./website.repository.ts";
import type { WebsiteResponse } from "./website.types.ts";
import type { CreateWebsiteInput, PingLogsQueryInput, GetWebsitesQueryInput } from "./website.validator.ts";

export async function create(
  input: CreateWebsiteInput,
  userId: string,
): Promise<WebsiteResponse> {
  const [existingUrl, existingName] = await Promise.all([
    findWebsiteByUrlAndUser(input.url, userId),
    findWebsiteByNameAndUser(input.name, userId),
  ]);

  if (existingUrl) throw new ApiError(409, "URL already monitored");
  if (existingName) throw new ApiError(409, "Monitor name already taken");

  return createWebsite(input.name, input.url, userId);
}

export async function getWebsites(userId: string, query: GetWebsitesQueryInput) {
  const { websites, total } = await findWebsitesByUser(userId, query);

  return {
    data: websites,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function getPingLogs(websiteId: string, userId: string, query: PingLogsQueryInput) {
  const website = await db(TABLES.WEBSITES).where({ id: websiteId, user_id: userId }).first();
  if (!website) throw new ApiError(404, "Website not found");

  const [{ logs, total }] = await Promise.all([
    findPingLogs(websiteId, query),
    // findStatusSummary(websiteId, query.startDate, query.endDate),
  ]);

  return {
    data: logs,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
    // summary,
  };
}
