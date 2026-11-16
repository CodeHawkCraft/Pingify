import { createClient } from "redis";
import env from "./env.ts";

const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

await redisClient.connect();

// XREADGROUP BLOCK keeps the connection busy while waiting for data.
// This prevents other commands from running on the same connection.
// So, each blocking reader gets a separate connection.
export async function blockingClient() {
  const client = redisClient.duplicate();
  client.on("error", (err) => console.error("Redis Blocking Client Error:", err));
  await client.connect();
  return client;
}

export default redisClient;
