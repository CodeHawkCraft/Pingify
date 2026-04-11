import redisClient from "./redis.ts";
import { db, TABLES } from "./db.ts";
import env from "./env.ts";

interface StreamMessage {
  id: string;
  message: Record<string, string>;
}

interface StreamEntry {
  name: string;
  messages: StreamMessage[];
}

const PING_TIMEOUT_MS = 10_000;

async function pingWebsite(websiteId: string, url: string) {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const responseTimeMs = Date.now() - start;

    await db(TABLES.PING_LOGS).insert({
      website_id: websiteId,
      status_code: response.status,
      response_time_ms: responseTimeMs,
      status: response.ok ? "up" : "down",
    });
  } catch (err) {
    const responseTimeMs = Date.now() - start;
    await db(TABLES.PING_LOGS).insert({
      website_id: websiteId,
      status: "down",
      response_time_ms: responseTimeMs,
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}

async function readConsumer(consumerName: string) {
  while (true) {
    try {
      const response = await redisClient.xReadGroup(
        env.REDIS_GROUP_NAME,
        consumerName,
        { key: env.REDIS_STREAM_NAME, id: ">" },
        { COUNT: 5, BLOCK: 5000 },
      );

      if (!response) continue;

      const streams = response as StreamEntry[];

      for (const stream of streams) {
        if (!stream) continue;
        const promises = stream.messages.map(async (message: StreamMessage) => {
          const { website_id, url } = message.message;

          await pingWebsite(website_id, url);
          console.log(`Pinged: ${url} (website_id: ${website_id})`);

          await redisClient.xAck(
            env.REDIS_STREAM_NAME,
            env.REDIS_GROUP_NAME,
            message.id,
          );
        });

        await Promise.allSettled(promises);
      }
    } catch (err) {
      console.error(`[${consumerName}] Error:`, err);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}



export async function startWorkers() {

  const consumers = [
    env.REDIS_CONSUMER_1,
    env.REDIS_CONSUMER_2,
    env.REDIS_CONSUMER_3,
  ];

  console.log(
    `Starting ${consumers.length} consumers for group: ${env.REDIS_GROUP_NAME}`,
  );

  consumers.forEach((name) => readConsumer(name));
}
