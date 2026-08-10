import type {
  Server,
} from "node:http";

import { app } from "./app";
import { env } from "./config/env";

import {
  closeDatabaseConnection,
  verifyDatabaseConnection,
} from "./db/cognodb";

let server: Server | undefined;

async function startServer() {
  try {
    await verifyDatabaseConnection();

    console.log(
      "CognoDB connection established",
    );
  } catch (error) {
    console.error(
      "CognoDB is unavailable at startup. TraceGraph API will continue running.",
    );

    if (error instanceof Error) {
      console.error(
        error.message,
      );
    }
  }

  server = app.listen(
    env.PORT,
    () => {
      console.log(
        `TraceGraph API running on http://localhost:${env.PORT}`,
      );
    },
  );
}

async function shutdown(
  signal: string,
) {
  console.log(
    `${signal} received. Shutting down TraceGraph API...`,
  );

  if (server) {
    await new Promise<void>(
      (resolve) => {
        server?.close(() => {
          resolve();
        });
      },
    );
  }

  await closeDatabaseConnection();

  console.log(
    "TraceGraph API shutdown complete",
  );

  process.exit(0);
}

process.on(
  "SIGINT",
  () => {
    void shutdown("SIGINT");
  },
);

process.on(
  "SIGTERM",
  () => {
    void shutdown("SIGTERM");
  },
);

void startServer();