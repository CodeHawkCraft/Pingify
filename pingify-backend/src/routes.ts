import { Router } from "express";
import authRouter from "./module/auth/auth.routes.ts";
import websiteRouter from "./module/website/website.routes.ts";
import usersRouter from "./module/users/users.routes.ts";
import { authenticate } from "./middlewares/auth.middleware.ts";

const appRouter = Router();

appRouter.use("/auth", authRouter);
appRouter.use("/monitors", authenticate, websiteRouter);
appRouter.use("/users",authenticate, usersRouter);

export default appRouter;
