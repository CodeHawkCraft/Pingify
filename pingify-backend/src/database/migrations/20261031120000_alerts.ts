import type { Knex } from "knex";
import { TABLES } from "../db.ts";

// One row per up/down transition. Worker inserts it, alert consumer emails it and sets sent_at.
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLES.ALERTS, (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table
      .uuid("website_id")
      .notNullable()
      .references("id")
      .inTable(TABLES.WEBSITES)
      .onDelete("CASCADE");
    table.enum("type", ["down", "up"]).notNullable();
    table.text("reason").nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("sent_at").nullable();
    table.index(["website_id", "created_at"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLES.ALERTS);
}
