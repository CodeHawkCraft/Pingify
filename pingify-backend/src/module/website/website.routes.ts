import { Router } from "express";
import { asyncHandler } from "../../middlewares/async-handler.middleware.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import { createWebsiteSchema } from "./website.validator.ts";
import { createWebsiteController } from "./website.controller.ts";

const websiteRouter = Router();

websiteRouter.post("/", validate(createWebsiteSchema), asyncHandler(createWebsiteController));

export default websiteRouter;
