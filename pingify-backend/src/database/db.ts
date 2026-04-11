import knex from "knex";
import config from "../knexfile.ts";
export const TABLES = {
  USERS: "users",
} as const;

export const db = knex(config.development!);
