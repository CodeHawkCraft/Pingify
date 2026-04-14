import { Users } from "../../database/types.ts";

export type UserResponse = Pick<Users, "id" | "username" | "created_at">;