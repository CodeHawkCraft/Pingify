import { db, TABLES } from "../../database/db.ts";
import type { WebsiteResponse } from "./website.types.ts";

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
