import { Router } from "express";
import { asyncHandler } from "../../middlewares/async-handler.middleware.ts";
import { validate, validateQuery, validateParams } from "../../middlewares/validate.middleware.ts";
import { createWebsiteSchema, pingLogsQuerySchema, websiteIdParamsSchema, updatePausedSchema } from "./website.validator.ts";
import { getWebsitesController, createWebsiteController, getPingLogsController, deleteWebsiteController, getAlertsController, setPausedController } from "./website.controller.ts";

const websiteRouter = Router();

websiteRouter.get("/", asyncHandler(getWebsitesController));
websiteRouter.post("/", validate(createWebsiteSchema), asyncHandler(createWebsiteController));
websiteRouter.get("/:websiteId/logs", validateParams(websiteIdParamsSchema), asyncHandler(getPingLogsController));
websiteRouter.get("/:websiteId/alerts", validateParams(websiteIdParamsSchema), asyncHandler(getAlertsController));
websiteRouter.patch("/:websiteId/pause", validateParams(websiteIdParamsSchema), validate(updatePausedSchema), asyncHandler(setPausedController));
websiteRouter.delete("/:websiteId", validateParams(websiteIdParamsSchema), asyncHandler(deleteWebsiteController));

export default websiteRouter;
