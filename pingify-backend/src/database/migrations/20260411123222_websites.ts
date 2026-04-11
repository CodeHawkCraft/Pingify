import type { Knex } from "knex";
import { TABLES } from "../db.ts";

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

    table.unique(["url", "user_id"]);
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable(TABLES.WEBSITES);
}
