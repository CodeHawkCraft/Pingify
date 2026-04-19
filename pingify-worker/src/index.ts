import express from "express";
import env from "./env.ts";
import { startWorkers } from "./worker.ts";

const app = express();
const PORT = env.PORT || 3002;

app.use(express.json());


app.listen(PORT, () => {
  console.log(`Worker running on port ${PORT}`);
  startWorkers();
});
