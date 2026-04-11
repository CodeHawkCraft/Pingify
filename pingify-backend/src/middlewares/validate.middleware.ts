import type { Request, Response, NextFunction } from "express";
import type { ZodError, ZodType } from "zod";

import { ApiError } from "../utils/api-error.ts";

const formatZodError = (error: ZodError): string => {
  return error.issues
    .map((e) => `${e.path.join(".")}: ${e.message}`)
    .join(", ");
};

export const validate = (schema: ZodType<unknown>) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(400, formatZodError(result.error as ZodError));
    }

    req.body = result.data;
    next();
  };
};

export const validateQuery = (schema: ZodType<unknown>) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      throw new ApiError(400, formatZodError(result.error as ZodError));
    }
    next();
  };
};