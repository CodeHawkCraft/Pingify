import { db, TABLES } from "../database/db.ts";
import type { Websites } from "../database/types.ts";
import redisClient from "../database/redis.ts";
import env from "../env.ts";

const BATCH_SIZE = 1000;
const INTERVAL_SECONDS = 3;

async function schedulerTick() {
  try {
    await db.transaction(async (trx) => {
      const websites = await trx<Websites>(TABLES.WEBSITES)
        .where("next_ping_at", "<=", db.fn.now())
        .orderBy("next_ping_at", "asc")
        .limit(BATCH_SIZE)
        .select("id", "url")
        .forUpdate()
        .skipLocked();

      if (websites.length === 0) return;

      const results = await Promise.allSettled(
        websites.map((website) =>
          redisClient.xAdd(env.REDIS_STREAM_NAME, "*", {
            website_id: website.id,
            url: website.url,
          })
        ),
      );

      const successfulIds: string[] = [];
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          successfulIds.push(websites[index].id);
        } else {
          console.error(`Failed to push website ${websites[index].id}:`, result.reason);
        }
      });

      if (successfulIds.length > 0) {
        await trx<Websites>(TABLES.WEBSITES)
          .whereIn("id", successfulIds)
          .update({
            next_ping_at: db.raw(`NOW() + INTERVAL '? seconds'`, [INTERVAL_SECONDS]),
            updated_at: db.fn.now(),
          });
      }

      console.log(`Scheduled ${successfulIds.length}/${websites.length} websites`);
    });
  } catch (err) {
    console.error("Scheduler error:", err);
  }
}

async function run() {
  await schedulerTick();
  setTimeout(run, 1000);
}

run();
