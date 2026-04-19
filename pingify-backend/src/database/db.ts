import knex from "knex";
import config from "../knexfile.ts";
import env from "../env.ts";

export const TABLES = {
  USERS: "users",
  WEBSITES: "websites",
  PING_LOGS: "ping_logs"
} as const;

const environment = env.NODE_ENV || "development";
// console.log("enviroment", environment);
export const db = knex(config[environment]);
