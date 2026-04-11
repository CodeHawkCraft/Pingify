import type { Knex } from "knex";
import { TABLES } from "../db.ts";

export function up(knex: Knex) {
  return knex.schema.createTable(TABLES.USERS, (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.string("username").notNullable().unique();
    table.string("password").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable(TABLES.USERS);
}
