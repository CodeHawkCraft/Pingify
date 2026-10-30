import type { Knex } from "knex";
import { TABLES } from "../db.ts";

// id is the Clerk user id (e.g. "user_2abc..."), synced by the Clerk webhook.
export function up(knex: Knex) {
  return knex.schema.createTable(TABLES.USERS, (table) => {
    table.string("id").primary();
    table.string("first_name");
    table.string("last_name");
    table.string("email").unique();
    table.timestamps(true, true);
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable(TABLES.USERS);
}
