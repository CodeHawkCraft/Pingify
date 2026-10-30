import { Router } from "express";
import websiteRouter from "./module/website/website.routes.ts";
import { authenticate } from "./middlewares/auth.middleware.ts";

const appRouter = Router();

appRouter.use("/monitors", authenticate, websiteRouter);

export default appRouter;
