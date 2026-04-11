import knex from "knex";
import config from "../knexfile.ts";
export const TABLES = {
  USERS: "users",
  WEBSITES: "websites",
  PING_LOGS: "ping_logs"
} as const;

export const db = knex(config.development!);
