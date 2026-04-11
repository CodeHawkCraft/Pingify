import { Router } from "express";
import { asyncHandler } from "../../middlewares/async-handler.middleware.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import { signupSchema } from "./auth.validator.ts";
import { signupController } from "./auth.controller.ts";

const authRouter = Router();

authRouter.post("/signup", validate(signupSchema), asyncHandler(signupController));

export default authRouter;
