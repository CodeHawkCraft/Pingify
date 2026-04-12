import { db, TABLES } from "../database/db.ts";
import type { Websites } from "../database/types.ts";
import redisClient from "../database/redis.ts";
import env from "../env.ts";

async function pushWebsitesToRedisStream() {
  try {
    const websites = await db<Websites>(TABLES.WEBSITES).select("*");

    const results = await Promise.allSettled(
      websites.map((website) =>
        redisClient.xAdd(env.REDIS_STREAM_NAME, "*", {
          website_id: website.id,
          url: website.url,
        }, {
          TRIM: {
            strategy: "MAXLEN",
            strategyModifier: "~",
            threshold: 10000,
          },
        })
      )
    );

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      console.error(`Failed to push ${failed.length}/${websites.length} websites to stream`);
    }
  } catch (err) {
    console.error("Failed to push websites to Redis stream:", err);
  }
}

setInterval(pushWebsitesToRedisStream, 3000);
