import { driver } from "../../db/cognodb";

import type {
  DashboardSummary,
  ServiceHealthItem,
} from "./dashboard.types";

function toNumber(value: unknown): number {
  if (
    typeof value === "object" &&
    value !== null &&
    "toString" in value
  ) {
    return Number(value.toString());
  }

  return Number(value);
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const session = driver.session();

  try {
    const applicationResult = await session.run(`
      MATCH (application:Application)
      RETURN count(application) AS count
    `);

    const serviceResult = await session.run(`
      MATCH (service:Service)

      RETURN
        count(service) AS total,
        count(
          CASE
            WHEN service.status <> "healthy"
            THEN 1
          END
        ) AS degraded,
        count(
          CASE
            WHEN service.criticality = "critical"
            THEN 1
          END
        ) AS critical
    `);

    const databaseResult = await session.run(`
      MATCH (database:Database)
      RETURN count(database) AS count
    `);

    const externalApiResult = await session.run(`
      MATCH (externalApi:ExternalAPI)
      RETURN count(externalApi) AS count
    `);

    const incidentResult = await session.run(`
      MATCH (incident:Incident)

      WHERE incident.status <> "resolved"

      RETURN count(incident) AS count
    `);

    return {
      applications: toNumber(
        applicationResult.records[0]?.get("count"),
      ),

      services: toNumber(
        serviceResult.records[0]?.get("total"),
      ),

      databases: toNumber(
        databaseResult.records[0]?.get("count"),
      ),

      externalApis: toNumber(
        externalApiResult.records[0]?.get("count"),
      ),

      activeIncidents: toNumber(
        incidentResult.records[0]?.get("count"),
      ),

      degradedServices: toNumber(
        serviceResult.records[0]?.get("degraded"),
      ),

      criticalServices: toNumber(
        serviceResult.records[0]?.get("critical"),
      ),
    };
  } finally {
    await session.close();
  }
}

export async function getServiceHealth(): Promise<
  ServiceHealthItem[]
> {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (service:Service)

      RETURN
        service.id AS id,
        service.name AS name,
        service.status AS status,
        service.criticality AS criticality

      ORDER BY
        CASE service.status
          WHEN "critical" THEN 1
          WHEN "degraded" THEN 2
          WHEN "unknown" THEN 3
          ELSE 4
        END,
        service.name
    `);

    return result.records.map((record) => ({
      id: String(record.get("id")),
      name: String(record.get("name")),
      status: String(record.get("status")),
      criticality: String(record.get("criticality")),
    }));
  } finally {
    await session.close();
  }
}