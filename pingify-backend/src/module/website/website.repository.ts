import { db, TABLES } from "../../database/db.ts";
import type { WebsiteResponse, PingLogResponse } from "./website.types.ts";
import type { PingLogsQueryInput, GetWebsitesQueryInput } from "./website.validator.ts";

export async function findWebsiteByUrlAndUser(
  url: string,
  userId: string,
): Promise<WebsiteResponse | undefined> {
  return db(TABLES.WEBSITES).where({ url, user_id: userId }).first();
}

export async function findWebsiteByNameAndUser(
  name: string,
  userId: string,
): Promise<WebsiteResponse | undefined> {
  return db(TABLES.WEBSITES)
    .whereRaw("lower(name) = lower(?)", [name])
    .where({ user_id: userId })
    .first();
}

export async function createWebsite(
  name: string,
  url: string,
  userId: string,
): Promise<WebsiteResponse> {
  const [website] = await db(TABLES.WEBSITES)
    .insert({ name, url, user_id: userId })
    .returning(["id", "name", "url", "created_at"]);
  return website;
}

export async function findWebsitesByUser(
  userId: string,
  query: GetWebsitesQueryInput,
): Promise<{ websites: WebsiteResponse[]; total: number }> {
  const { page, limit } = query;
  const offset = (page - 1) * limit;

  const base = db(TABLES.WEBSITES).where({ user_id: userId });

  const [countResult, websites] = await Promise.all([
    base.clone().count("id as count").first(),
    base.clone().select("id", "name", "url", "created_at").orderBy("created_at", "desc").limit(limit).offset(offset),
  ]);

  return { websites, total: Number(countResult?.count ?? 0) };
}

export async function findPingLogs(
  websiteId: string,
  query: PingLogsQueryInput,
): Promise<{ logs: PingLogResponse[]; total: number }> {
  const { startDate, endDate, status, page, limit } = query;
  const offset = (page - 1) * limit;

  const base = db(TABLES.PING_LOGS).where({ website_id: websiteId });
  if (startDate) base.where("pinged_at", ">=", startDate);
  if (endDate) base.where("pinged_at", "<=", endDate);
  if (status) base.where({ status });

  const [countResult, logs] = await Promise.all([
    base.clone().count("id as count").first(),
    base
      .clone()
      .select("id", "website_id", "status_code", "response_time_ms", "status", "error", "pinged_at")
      .orderBy("pinged_at", "desc")
      .limit(limit)
      .offset(offset),
  ]);

  return { logs, total: Number(countResult?.count ?? 0) };
}

// export async function findStatusSummary(
//   websiteId: string,
//   startDate?: string,
//   endDate?: string,
// ): Promise<StatusSummary> {
//   const q = db(TABLES.PING_LOGS).where({ website_id: websiteId });
//   if (startDate) q.where("pinged_at", ">=", startDate);
//   if (endDate) q.where("pinged_at", "<=", endDate);

//   const result = await q
//     .select(
//       db.raw("COUNT(*) as total"),
//       db.raw("COUNT(CASE WHEN status = 'up' THEN 1 END) as up_count"),
//       db.raw("AVG(CASE WHEN status = 'up' THEN response_time_ms END) as avg_response_time"),
//     )
//     .first();

//   const total = Number(result?.total ?? 0);
//   const upCount = Number(result?.up_count ?? 0);
//   const avg = result?.avg_response_time ? Number(result.avg_response_time) : null;

//   return {
//     uptimePercentage: total > 0 ? Math.round((upCount / total) * 10000) / 100 : 0,
//     avgResponseTime: avg !== null ? Math.round(avg) : null,
//   };
// }
