import { Router } from "express";
import authRouter from "./module/auth/auth.routes.ts";
import websiteRouter from "./module/website/website.routes.ts";

const appRouter = Router();

appRouter.use("/auth", authRouter);
appRouter.use("/websites", websiteRouter);

export default appRouter;
