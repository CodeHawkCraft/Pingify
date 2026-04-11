import { db, TABLES } from "../../database/db.ts";
import type { WebsiteResponse } from "./website.types.ts";

export async function findWebsiteByUrlAndUser(
  url: string,
  userId: string,
): Promise<WebsiteResponse | undefined> {
  return db(TABLES.WEBSITES).where({ url, user_id: userId }).first();
}

export async function createWebsite(
  url: string,
  userId: string,
): Promise<WebsiteResponse> {
  const [website] = await db(TABLES.WEBSITES)
    .insert({ url, user_id: userId })
    .returning(["id", "url", "created_at"]);
  return website;
}
