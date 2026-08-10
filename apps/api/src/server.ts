import app from "./app";
import { env } from "./config/env";
import {
  closeDatabaseConnection,
  testDatabaseQuery,
  verifyDatabaseConnection,
} from "./db/cognodb";

async function startServer() {
  try {
    await verifyDatabaseConnection();

    console.log("CognoDB connection established");

    const databaseMessage = await testDatabaseQuery();

    console.log(databaseMessage);

    app.listen(env.PORT, () => {
      console.log(
        `TraceGraph API running on http://localhost:${env.PORT}`,
      );
    });
  } catch (error) {
    console.error("Failed to connect to CognoDB");
    console.error(error);

    process.exit(1);
  }
}

async function shutdown() {
  console.log("Shutting down TraceGraph API...");

  await closeDatabaseConnection();

  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

void startServer();