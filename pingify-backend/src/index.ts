import express from "express";
import cookieParser from "cookie-parser";
import env from "./env.ts";
import appRouter from "./routes.ts";
import { errorHandler } from "./middlewares/error.middleware.ts";
import "./services/pusher.service.ts";

const app = express();
const PORT = env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use("/api", appRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
