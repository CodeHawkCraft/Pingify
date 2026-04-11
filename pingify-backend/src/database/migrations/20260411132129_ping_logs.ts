import type { Knex } from "knex";
import { TABLES } from "../db.ts";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLES.PING_LOGS, (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table
      .uuid("website_id")
      .notNullable()
      .references("id")
      .inTable(TABLES.WEBSITES)
      .onDelete("CASCADE");
    table.integer("status_code").nullable();
    table.integer("response_time_ms").nullable();
    table.enum("status", ["up", "down"]).notNullable();
    table.text("error").nullable();
    table.timestamp("pinged_at").notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLES.PING_LOGS);
}
