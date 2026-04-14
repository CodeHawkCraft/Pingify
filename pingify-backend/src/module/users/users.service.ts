import { ApiError } from "../../utils/api-error.ts";
import { getUserById } from "./users.repository.ts";
import type { UserResponse } from "../auth/auth.types.ts";

export async function getUser(userId: string): Promise<UserResponse> {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return { id: user.id, username: user.username, created_at: user.created_at };
}
