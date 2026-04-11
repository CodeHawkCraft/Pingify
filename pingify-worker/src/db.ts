import knex from "knex";
import env from "./env.ts";

export const TABLES = {
  WEBSITES: "websites",
  PING_LOGS: "ping_logs",
} as const;

export const db = knex({
  client: "pg",
  connection: {
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
});
