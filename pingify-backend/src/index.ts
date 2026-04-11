import express from "express";
import env from "./env.ts";
import appRouter from "./routes.ts";

const app = express();
const PORT = env.PORT || 3000;

app.use(express.json());

app.use("/api", appRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
