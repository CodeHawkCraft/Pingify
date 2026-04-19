import knex from "knex";
import env from "./env.ts";
import config from "./knexfile.ts";

export const TABLES = {
  WEBSITES: "websites",
  PING_LOGS: "ping_logs",
} as const;

const environment = env.NODE_ENV || "development";
// console.log("enviroment", environment);
export const db = knex(config[environment]);