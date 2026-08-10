import type {
  Request,
  Response,
} from "express";

import {
  checkDatabaseReadiness,
} from "../../db/cognodb";

export function getHealth(
  _req: Request,
  res: Response,
) {
  res.status(200).json({
    data: {
      status: "ok",
      service: "tracegraph-api",
    },
  });
}

export async function getReadiness(
  _req: Request,
  res: Response,
) {
  const databaseReady =
    await checkDatabaseReadiness();

  if (!databaseReady) {
    res.status(503).json({
      error: {
        code:
          "DATABASE_UNAVAILABLE",

        message:
          "TraceGraph API is running, but CognoDB is currently unavailable",
      },
    });

    return;
  }

  res.status(200).json({
    data: {
      status: "ready",
      service: "tracegraph-api",
      database: "connected",
    },
  });
}