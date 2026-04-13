import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "../.env") });

function getEnv(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const env = {
  DB_HOST: getEnv("DB_HOST"),
  DB_PORT: getEnv("DB_PORT"),
  DB_USER: getEnv("DB_USER"),
  DB_PASSWORD: getEnv("DB_PASSWORD"),
  DB_NAME: getEnv("DB_NAME"),
  PORT: getEnv("PORT"),
  NODE_ENV: getEnv("NODE_ENV"),
  REDIS_URL: getEnv("REDIS_URL"),
  REDIS_STREAM_NAME: getEnv("REDIS_STREAM_NAME"),
  REDIS_GROUP_NAME: getEnv("REDIS_GROUP_NAME"),
  REDIS_CONSUMER_1: getEnv("REDIS_CONSUMER_1"),
  REDIS_CONSUMER_2: getEnv("REDIS_CONSUMER_2"),
  REDIS_CONSUMER_3: getEnv("REDIS_CONSUMER_3"),
  REDIS_CONSUMER_4: getEnv("REDIS_CONSUMER_4"),
};

export default env;
