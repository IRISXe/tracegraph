import neo4j from "neo4j-driver";

import { env } from "../config/env";

export const driver = neo4j.driver(
  env.COGNODB_URI,
  neo4j.auth.basic(
    env.COGNODB_USERNAME,
    env.COGNODB_PASSWORD,
  ),
);

export async function verifyDatabaseConnection() {
  await driver.verifyConnectivity();
}

export async function testDatabaseQuery() {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      RETURN $message AS message
      `,
      {
        message: "TraceGraph connected to CognoDB",
      },
    );

    return result.records[0]?.get("message");
  } finally {
    await session.close();
  }
}

export async function closeDatabaseConnection() {
  await driver.close();
}