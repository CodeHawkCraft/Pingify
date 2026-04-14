import { db, TABLES } from "../../database/db.ts";
import type { Users } from "../../database/types.ts";

export async function getUserById(id: string): Promise<Users | undefined> {
  return db(TABLES.USERS).where({ id }).first();
}
