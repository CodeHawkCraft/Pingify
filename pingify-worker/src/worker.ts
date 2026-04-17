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
const BUFFER_FLUSH_SIZE = 100;
const BUFFER_FLUSH_INTERVAL_MS = 1_000;

interface PingLog {
  website_id: string;
  status: "up" | "down";
  status_code?: number;
  response_time_ms: number;
  error?: string;
}

const pingLogBuffer: PingLog[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

async function flushPingLogs() {
  if (pingLogBuffer.length === 0) return;
  const batch = pingLogBuffer.splice(0, pingLogBuffer.length);
  await db(TABLES.PING_LOGS).insert(batch);
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(async () => {
    flushTimer = null;
    await flushPingLogs();
  }, BUFFER_FLUSH_INTERVAL_MS);
}

function bufferPingLog(entry: PingLog) {
  pingLogBuffer.push(entry);
  if (pingLogBuffer.length >= BUFFER_FLUSH_SIZE) {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    flushPingLogs();
  } else {
    scheduleFlush();
  }
}

async function pingWebsite(websiteId: string, url: string) {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);

    let response;
    try {
      response = await fetch(url, {
        method: "HEAD",
        signal: controller.signal,
      });

      if (response.status === 405) {
        response = await fetch(url, {
          method: "GET",
          signal: controller.signal,
        });
      }
    } finally {
      clearTimeout(timeout);
    }

    bufferPingLog({
      website_id: websiteId,
      status_code: response.status,
      response_time_ms: Date.now() - start,
      status: response.ok ? "up" : "down",
    });
  } catch (err) {
    bufferPingLog({
      website_id: websiteId,
      status: "down",
      response_time_ms: Date.now() - start,
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

const PENDING_IDLE_TIME_MS = 60_000; // claim messages idle for 60+ seconds
const PENDING_RECOVERY_INTERVAL_MS = 30_000; // check every 30 seconds

async function recoverPendingMessages(consumerName: string) {
  let cursor = "0-0";

  do {
    const result = await redisClient.xAutoClaim(
      env.REDIS_STREAM_NAME,
      env.REDIS_GROUP_NAME,
      consumerName,
      PENDING_IDLE_TIME_MS,
      cursor,
      { COUNT: 50 },
    );

    cursor = result.nextId;

    const promises = (result.messages as (StreamMessage | null)[])
      .filter((m): m is StreamMessage => m !== null)
      .map(async (message) => {
        const { website_id, url } = message.message;
        await pingWebsite(website_id, url);
        console.log(`[${consumerName}] Recovered pending: ${url} (website_id: ${website_id})`);
        await redisClient.xAck(env.REDIS_STREAM_NAME, env.REDIS_GROUP_NAME, message.id);
      });

    await Promise.allSettled(promises);
  } while (cursor !== "0-0");
}

function startPendingRecovery(consumerName: string) {
  setInterval(async () => {
    try {
      await recoverPendingMessages(consumerName);
    } catch (err) {
      console.error(`[${consumerName}] Pending recovery error:`, err);
    }
  }, PENDING_RECOVERY_INTERVAL_MS);
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

  // Start pending message recovery on the first consumer
  startPendingRecovery(env.REDIS_CONSUMER_4);
}
