import type { Knex } from "knex";
import path from "path";
import { fileURLToPath } from "url";
import env from "./env.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
    },
    migrations: {
      directory: path.resolve(__dirname, "database/migrations"),
      tableName: "knex_migrations",
    },
    seeds: {
      directory: path.resolve(__dirname, "database/seeds"),
    },
  },

  production: {
    client: "postgresql",
    connection: {
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.resolve(__dirname, "database/migrations"),
      tableName: "knex_migrations",
    },
    seeds: {
      directory: path.resolve(__dirname, "database/seeds"),
    },
  },
};

export default config;
