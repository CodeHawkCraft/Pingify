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

export default redisClient;
