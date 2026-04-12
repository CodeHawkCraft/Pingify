import { Router } from "express";
import { asyncHandler } from "../../middlewares/async-handler.middleware.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import { signupSchema, loginSchema } from "./auth.validator.ts";
import { signupController, loginController, logoutController } from "./auth.controller.ts";

const authRouter = Router();

authRouter.post("/signup", validate(signupSchema), asyncHandler(signupController));
authRouter.post("/login", validate(loginSchema), asyncHandler(loginController));
authRouter.post("/logout", logoutController);

export default authRouter;
