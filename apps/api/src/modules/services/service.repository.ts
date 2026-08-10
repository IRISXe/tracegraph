import { driver } from "../../db/cognodb";

import type {
  Service,
  ServiceDependency,
  ServiceDependent,
  ServiceOwner,
} from "./service.types";


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

export async function findServiceDependencies(
  serviceId: string,
): Promise<ServiceDependency[]> {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH path =
        (source:Service {id: $serviceId})
        -[:DEPENDS_ON|USES|CALLS*1..4]->
        (dependency)

      WITH
        dependency,
        min(length(path)) AS depth

      RETURN
        dependency,
        labels(dependency) AS labels,
        depth

      ORDER BY depth, dependency.name
      `,
      {
        serviceId,
      },
    );

    return result.records.map((record) => {
      const node = record.get("dependency");
      const labels = record.get("labels") as string[];
      const depth = record.get("depth");

      return {
        id: String(node.properties.id),
        name: String(node.properties.name),
        type: labels[0] as ServiceDependency["type"],
        status: String(node.properties.status),
        criticality: String(node.properties.criticality),
        depth: Number(depth.toString()),
      };
    });
  } finally {
    await session.close();
  }
}
export async function findServiceDependents(
  serviceId: string,
): Promise<ServiceDependent[]> {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH path =
        (dependent)
        -[:DEPENDS_ON*1..4]->
        (target:Service {id: $serviceId})

      WHERE dependent:Service
         OR dependent:Application

      WITH
        dependent,
        min(length(path)) AS depth

      RETURN
        dependent,
        labels(dependent) AS labels,
        depth

      ORDER BY depth, dependent.name
      `,
      {
        serviceId,
      },
    );

    return result.records.map((record) => {
      const node = record.get("dependent");
      const labels = record.get("labels") as string[];
      const depth = record.get("depth");

      return {
        id: String(node.properties.id),
        name: String(node.properties.name),
        type: labels[0] as ServiceDependent["type"],
        status: String(node.properties.status),
        criticality: String(node.properties.criticality),
        depth: Number(depth.toString()),
      };
    });
  } finally {
    await session.close();
  }
}
export async function findServiceOwner(
  serviceId: string,
): Promise<ServiceOwner | null> {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (team:Team)-[:OWNS]->(
        service:Service {id: $serviceId}
      )

      RETURN team

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

    const team = record.get("team");

    return {
      id: String(team.properties.id),
      name: String(team.properties.name),
      email: String(team.properties.email),
    };
  } finally {
    await session.close();
  }
}