import cors from "cors";
import express from "express";

import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import serviceRouter from "./modules/services/service.routes";
import dashboardRouter from "./modules/dashboard/dashboard.routes";
import incidentRouter from "./modules/incidents/incident.routes";
import graphRouter from "./modules/graph/graph.routes";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
  }),
);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "tracegraph-api",
  });
});

app.use("/api/dashboard", dashboardRouter);

app.use("/api/services", serviceRouter);

app.use("/api/incidents", incidentRouter);

app.use("/api/graph", graphRouter);

app.use(errorHandler);

export default app;