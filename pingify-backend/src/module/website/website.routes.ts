import { Router } from "express";
import { asyncHandler } from "../../middlewares/async-handler.middleware.ts";
import { validate, validateQuery, validateParams } from "../../middlewares/validate.middleware.ts";
import { createWebsiteSchema, pingLogsQuerySchema, websiteIdParamsSchema } from "./website.validator.ts";
import { getWebsitesController, createWebsiteController, getPingLogsController, deleteWebsiteController, getAlertsController } from "./website.controller.ts";

const websiteRouter = Router();

websiteRouter.get("/", asyncHandler(getWebsitesController));
websiteRouter.post("/", validate(createWebsiteSchema), asyncHandler(createWebsiteController));
websiteRouter.get("/:websiteId/logs", validateParams(websiteIdParamsSchema), asyncHandler(getPingLogsController));
websiteRouter.get("/:websiteId/alerts", validateParams(websiteIdParamsSchema), asyncHandler(getAlertsController));
websiteRouter.delete("/:websiteId", validateParams(websiteIdParamsSchema), asyncHandler(deleteWebsiteController));

export default websiteRouter;
