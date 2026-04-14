import type { Knex } from "knex";
import { TABLES } from "../db.ts";

const INTERVAL_SECONDS = 3;

export function up(knex: Knex) {
  return knex.schema.createTable(TABLES.WEBSITES, (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.string("url", 2048).notNullable();
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable(TABLES.USERS)
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    // Jitter: spread initial pings across the interval to avoid thundering herd
    table
      .timestamp("next_ping_at")
      .notNullable()
      .defaultTo(
        knex.raw(`NOW() + (RANDOM() * INTERVAL '${INTERVAL_SECONDS} seconds')`),
      )
      .index();

    table.unique(["url", "user_id"]);
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable(TABLES.WEBSITES);
}
