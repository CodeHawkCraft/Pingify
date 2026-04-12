import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { CookieOptions } from "express";
import env from "../../env.ts";

const SALT_ROUNDS = 10;

export const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict",
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: { id: string; username: string }): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}
