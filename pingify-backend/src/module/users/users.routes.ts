import { Router } from "express";
import { asyncHandler } from "../../middlewares/async-handler.middleware.ts";
import { getMeController } from "./users.controller.ts";

const usersRouter = Router();

usersRouter.get("/me", asyncHandler(getMeController));

export default usersRouter;
