import { ApiError } from "../../utils/api-error.ts";
import { findUserByUsername, createUser } from "./auth.repository.ts";
import type { UserResponse } from "./auth.types.ts";
import { hashPassword, comparePassword, generateToken } from "./auth.utils.ts";
import type { SignupInput, LoginInput } from "./auth.validator.ts";

export async function signup(input: SignupInput): Promise<UserResponse> {
  const existingUser = await findUserByUsername(input.username);
  if (existingUser) {
    throw new ApiError(409, "Username already taken");
  }

  const hashedPassword = await hashPassword(input.password);
  const user = await createUser(input.username, hashedPassword);

  return user;
}

export async function login(input: LoginInput): Promise<{ user: UserResponse; token: string }> {
  const user = await findUserByUsername(input.username);
  if (!user) {
    throw new ApiError(401, "Invalid username or password");
  }

  const isValid = await comparePassword(input.password, user.password);
  if (!isValid) {
    throw new ApiError(401, "Invalid username or password");
  }

  const token = generateToken({ id: user.id, username: user.username });

  return {
    user: { id: user.id, username: user.username, created_at: user.created_at },
    token,
  };
}
