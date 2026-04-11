import { db, TABLES } from "../../database/db.ts";
import { Users } from "../../database/types.ts";
import type { UserResponse } from "./auth.types.ts";

export async function findUserByUsername(
  username: string,
): Promise<Users | undefined> {
  return db(TABLES.USERS).where({ username }).first();
}

export async function createUser(
  username: string,
  hashedPassword: string,
): Promise<UserResponse> {
  const [user] = await db(TABLES.USERS)
    .insert({ username, password: hashedPassword })
    .returning(["id", "username", "created_at"]);
  return user;
}
