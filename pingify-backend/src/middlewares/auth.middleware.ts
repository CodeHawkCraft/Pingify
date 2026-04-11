import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../env.ts";
import { ApiError } from "../utils/api-error.ts";
import { JwtPayload } from "../types/express.ts";


export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
}
