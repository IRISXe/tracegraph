import { driver } from "../../db/cognodb";

import type {
  Incident,
  IncidentAffectedService,
  IncidentCause,
} from "./incident.types";

function mapIncident(
  properties: Record<string, unknown>,
): Incident {
  return {
    id: String(properties.id),
    title: String(properties.title),
    description: String(properties.description),

    severity:
      properties.severity as Incident["severity"],

    status:
      properties.status as Incident["status"],

    startedAt: String(properties.startedAt),

    resolvedAt:
      properties.resolvedAt === null ||
      properties.resolvedAt === undefined
        ? null
        : String(properties.resolvedAt),
  };
}

export async function findAllIncidents(): Promise<
  Incident[]
> {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (incident:Incident)

      RETURN incident

      ORDER BY incident.startedAt DESC
    `);

    return result.records.map((record) => {
      const incident = record.get("incident");

      return mapIncident(incident.properties);
    });
  } finally {
    await session.close();
  }
}

export async function findIncidentById(
  incidentId: string,
): Promise<Incident | null> {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (incident:Incident {
        id: $incidentId
      })

      RETURN incident

      LIMIT 1
      `,
      {
        incidentId,
      },
    );

    const record = result.records[0];

    if (!record) {
      return null;
    }

    const incident = record.get("incident");

    return mapIncident(incident.properties);
  } finally {
    await session.close();
  }
}
export async function findIncidentAffectedServices(
  incidentId: string,
): Promise<IncidentAffectedService[]> {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH
        (incident:Incident {id: $incidentId})
        -[:AFFECTED]->
        (service:Service)

      RETURN service

      ORDER BY service.name
      `,
      {
        incidentId,
      },
    );

    return result.records.map((record) => {
      const service = record.get("service");

      return {
        id: String(service.properties.id),
        name: String(service.properties.name),
        status: String(service.properties.status),
        criticality: String(
          service.properties.criticality,
        ),
      };
    });
  } finally {
    await session.close();
  }
}
export async function findIncidentCause(
  incidentId: string,
): Promise<IncidentCause | null> {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH
        (incident:Incident {id: $incidentId})
        -[:CAUSED_BY]->
        (cause)

      RETURN
        cause,
        labels(cause) AS labels

      LIMIT 1
      `,
      {
        incidentId,
      },
    );

    const record = result.records[0];

    if (!record) {
      return null;
    }

    const cause = record.get("cause");
    const labels = record.get("labels") as string[];

    return {
      id: String(cause.properties.id),
      name: String(cause.properties.name),

      type: labels[0] as IncidentCause["type"],

      status: String(cause.properties.status),

      criticality: String(
        cause.properties.criticality,
      ),
    };
  } finally {
    await session.close();
  }
}