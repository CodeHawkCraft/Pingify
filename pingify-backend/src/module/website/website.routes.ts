import { Router } from "express";
import { asyncHandler } from "../../middlewares/async-handler.middleware.ts";
import { validate, validateQuery } from "../../middlewares/validate.middleware.ts";
import { createWebsiteSchema, pingLogsQuerySchema } from "./website.validator.ts";
import { getWebsitesController, createWebsiteController, getPingLogsController } from "./website.controller.ts";

const websiteRouter = Router();

websiteRouter.get("/", asyncHandler(getWebsitesController));
websiteRouter.post("/", validate(createWebsiteSchema), asyncHandler(createWebsiteController));
websiteRouter.get("/:websiteId/logs", validateQuery(pingLogsQuerySchema), asyncHandler(getPingLogsController));

export default websiteRouter;
