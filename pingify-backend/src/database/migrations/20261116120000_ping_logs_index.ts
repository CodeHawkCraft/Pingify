import type { Knex } from "knex";
import { TABLES } from "../db.ts";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TABLES.PING_LOGS, (table) => {
    table.index(["website_id", "pinged_at"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TABLES.PING_LOGS, (table) => {
    table.dropIndex(["website_id", "pinged_at"]);
  });
}
