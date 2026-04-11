import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error.ts";
import { errorResponse } from "../utils/api-response.ts";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {

  if (err instanceof ApiError) {
    res.status(err.statusCode).json(errorResponse(err.message));
    return;
  }

  const message =
    process.env.NODE_ENV === "development" ? err.message : "Internal server error";

  res.status(500).json(errorResponse(message));
};