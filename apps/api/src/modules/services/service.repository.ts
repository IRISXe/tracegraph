import { driver } from "../../db/cognodb";

import type { Service } from "./service.types";

function mapService(properties: Record<string, unknown>): Service {
  return {
    id: String(properties.id),
    name: String(properties.name),
    description: String(properties.description),
    environment: String(properties.environment),
    status: properties.status as Service["status"],
    criticality: properties.criticality as Service["criticality"],
    version: String(properties.version),
  };
}

export async function findAllServices(): Promise<Service[]> {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (service:Service)

      RETURN service

      ORDER BY service.name
      `,
    );

    return result.records.map((record) => {
      const node = record.get("service");

      return mapService(node.properties);
    });
  } finally {
    await session.close();
  }
}

export async function findServiceById(
  serviceId: string,
): Promise<Service | null> {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (service:Service {id: $serviceId})

      RETURN service

      LIMIT 1
      `,
      {
        serviceId,
      },
    );

    const record = result.records[0];

    if (!record) {
      return null;
    }

    const node = record.get("service");

    return mapService(node.properties);
  } finally {
    await session.close();
  }
}