import cors from "cors";
import express from "express";

import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import serviceRouter from "./modules/services/service.routes";
import dashboardRouter from "./modules/dashboard/dashboard.routes";
const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
  }),
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "tracegraph-api",
  });
});

app.use("/api/dashboard", dashboardRouter);

app.use("/api/services", serviceRouter);

app.use(errorHandler);
export default app;