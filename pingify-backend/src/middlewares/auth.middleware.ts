import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { ApiError } from "../utils/api-error.ts";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  if (!getAuth(req).userId) {
    return next(new ApiError(401, "Authentication required"));
  }
  next();
}

export function getUserId(req: Request): string {
  const { userId } = getAuth(req);
  if (!userId) throw new ApiError(401, "Authentication required");
  return userId;
}
