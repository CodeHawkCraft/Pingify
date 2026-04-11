import express from "express";
import cookieParser from "cookie-parser";
import env from "./env.ts";
import appRouter from "./routes.ts";

const app = express();
const PORT = env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/api", appRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
