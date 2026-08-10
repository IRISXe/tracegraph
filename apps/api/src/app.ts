import cors from "cors";
import express from "express";

import { env } from "./config/env";

import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";

import dashboardRouter from "./modules/dashboard/dashboard.routes";
import graphRouter from "./modules/graph/graph.routes";
import healthRouter from "./modules/health/health.routes";
import incidentRouter from "./modules/incidents/incident.routes";
import serviceRouter from "./modules/services/service.routes";

export const app = express();

/*
 * Global middleware
 */
app.use(
  cors({
    origin: env.CORS_ORIGIN,
  }),
);

app.use(
  express.json(),
);

/*
 * Health and readiness
 */
app.use(
  healthRouter,
);

/*
 * Feature routes
 */
app.use(
  "/api/dashboard",
  dashboardRouter,
);

app.use(
  "/api/services",
  serviceRouter,
);

app.use(
  "/api/incidents",
  incidentRouter,
);

app.use(
  "/api/graph",
  graphRouter,
);

/*
 * Unknown routes
 */
app.use(
  notFoundHandler,
);

/*
 * Centralized error handling
 */
app.use(
  errorHandler,
);