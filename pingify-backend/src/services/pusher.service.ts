import { db, TABLES } from "../database/db.ts";
import type { Websites } from "../database/types.ts";
import redisClient from "../database/redis.ts";
import env from "../env.ts";

async function pushWebsitesToRedisStream() {
  const websites = await db<Websites>(TABLES.WEBSITES).select("*");

  for (const website of websites) {
    await redisClient.xAdd(env.REDIS_STREAM_NAME, "*", {
      website_id: website.id,
      url: website.url,
    });
  }
}

setInterval(pushWebsitesToRedisStream, 3000);
