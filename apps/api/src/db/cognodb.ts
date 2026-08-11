import neo4j from "neo4j-driver";

import { env } from "../config/env";

export const driver =
  neo4j.driver(
    env.COGNODB_URI,
    neo4j.auth.basic(
      env.COGNODB_USERNAME,
      env.COGNODB_PASSWORD,
    ),
    {
      connectionTimeout: 5000,
    },
  );

export async function verifyDatabaseConnection() {
  await driver.verifyConnectivity();
}

export async function checkDatabaseReadiness(): Promise<boolean> {
  try {
    await driver.verifyConnectivity();

    return true;
  } catch {
    return false;
  }
}

export async function closeDatabaseConnection() {
  await driver.close();
}