import { ApiError } from "../../utils/api-error.ts";
import { findUserByUsername, createUser } from "./auth.repository.ts";
import type { UserResponse } from "./auth.types.ts";
import { hashPassword } from "./auth.utils.ts";
import type { SignupInput } from "./auth.validator.ts";

export async function signup(input: SignupInput): Promise<UserResponse> {
  const existingUser = await findUserByUsername(input.username);
  if (existingUser) {
    throw new ApiError(409, "Username already taken");
  }

  const hashedPassword = await hashPassword(input.password);
  const user = await createUser(input.username, hashedPassword);

  return user;
}
