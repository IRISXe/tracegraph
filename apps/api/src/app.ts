import cors from "cors";
import express from "express";

import { env } from "./config/env";

import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";

import dashboardRouter from "./modules/dashboard/dashboard.routes";
import graphRouter from "./modules/graph/graph.routes";
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

app.use(express.json());

/*
 * Health check
 */
app.get(
  "/health",
  (_req, res) => {
    res.status(200).json({
      data: {
        status: "ok",
        service: "tracegraph-api",
      },
    });
  },
);

/*
 * Application routes
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
 * Catch requests that didn't
 * match any route above.
 */
app.use(notFoundHandler);

/*
 * Error handler must always
 * remain last.
 */
app.use(errorHandler);

export default app;