import {
  applicationDependencies,
  applications,
  databaseUsage,
  databases,
  externalApiCalls,
  externalApis,
  incidentAffectedServices,
  incidentDatabaseCauses,
  incidents,
  ownership,
  serviceDependencies,
  services,
  teams,
} from "../data/seed-data";

import {
  closeDatabaseConnection,
  driver,
} from "../db/cognodb";

async function seedDatabase() {
  const session = driver.session();

  try {
    console.log("Starting TraceGraph seed...");

    await session.executeWrite(async (tx) => {
      // Clear only TraceGraph domain labels.
      await tx.run("MATCH (n:Application) DETACH DELETE n");
      await tx.run("MATCH (n:Service) DETACH DELETE n");
      await tx.run("MATCH (n:Database) DETACH DELETE n");
      await tx.run("MATCH (n:ExternalAPI) DETACH DELETE n");
      await tx.run("MATCH (n:Team) DETACH DELETE n");
      await tx.run("MATCH (n:Incident) DETACH DELETE n");

      // Applications
      await tx.run(
        `
        UNWIND $rows AS row

        CREATE (:Application {
          id: row.id,
          name: row.name,
          description: row.description,
          environment: row.environment,
          status: row.status,
          criticality: row.criticality
        })
        `,
        {
          rows: applications,
        },
      );

      // Services
      await tx.run(
        `
        UNWIND $rows AS row

        CREATE (:Service {
          id: row.id,
          name: row.name,
          description: row.description,
          environment: row.environment,
          status: row.status,
          criticality: row.criticality,
          version: row.version
        })
        `,
        {
          rows: services,
        },
      );

      // Databases
      await tx.run(
        `
        UNWIND $rows AS row

        CREATE (:Database {
          id: row.id,
          name: row.name,
          engine: row.engine,
          environment: row.environment,
          status: row.status,
          criticality: row.criticality
        })
        `,
        {
          rows: databases,
        },
      );

      // External APIs
      await tx.run(
        `
        UNWIND $rows AS row

        CREATE (:ExternalAPI {
          id: row.id,
          name: row.name,
          provider: row.provider,
          status: row.status,
          criticality: row.criticality
        })
        `,
        {
          rows: externalApis,
        },
      );

      // Teams
      await tx.run(
        `
        UNWIND $rows AS row

        CREATE (:Team {
          id: row.id,
          name: row.name,
          email: row.email
        })
        `,
        {
          rows: teams,
        },
      );

      // Incidents
      await tx.run(
        `
        UNWIND $rows AS row

        CREATE (:Incident {
          id: row.id,
          title: row.title,
          description: row.description,
          severity: row.severity,
          status: row.status,
          startedAt: row.startedAt,
          resolvedAt: row.resolvedAt
        })
        `,
        {
          rows: incidents,
        },
      );

      // Application -> Service
      await tx.run(
        `
        UNWIND $rows AS row

        MATCH (application:Application {id: row.applicationId})
        MATCH (service:Service {id: row.serviceId})

        CREATE (application)-[:DEPENDS_ON]->(service)
        `,
        {
          rows: applicationDependencies,
        },
      );

      // Service -> Service
      await tx.run(
        `
        UNWIND $rows AS row

        MATCH (source:Service {id: row.fromId})
        MATCH (target:Service {id: row.toId})

        CREATE (source)-[:DEPENDS_ON]->(target)
        `,
        {
          rows: serviceDependencies,
        },
      );

      // Service -> Database
      await tx.run(
        `
        UNWIND $rows AS row

        MATCH (service:Service {id: row.serviceId})
        MATCH (database:Database {id: row.databaseId})

        CREATE (service)-[:USES]->(database)
        `,
        {
          rows: databaseUsage,
        },
      );

      // Service -> External API
      await tx.run(
        `
        UNWIND $rows AS row

        MATCH (service:Service {id: row.serviceId})
        MATCH (externalApi:ExternalAPI {id: row.externalApiId})

        CREATE (service)-[:CALLS]->(externalApi)
        `,
        {
          rows: externalApiCalls,
        },
      );

      // Team -> Service
      await tx.run(
        `
        UNWIND $rows AS row

        MATCH (team:Team {id: row.teamId})
        MATCH (service:Service {id: row.serviceId})

        CREATE (team)-[:OWNS]->(service)
        `,
        {
          rows: ownership,
        },
      );

      // Incident -> Service
      await tx.run(
        `
        UNWIND $rows AS row

        MATCH (incident:Incident {id: row.incidentId})
        MATCH (service:Service {id: row.serviceId})

        CREATE (incident)-[:AFFECTED]->(service)
        `,
        {
          rows: incidentAffectedServices,
        },
      );

      // Incident -> Database
      await tx.run(
        `
        UNWIND $rows AS row

        MATCH (incident:Incident {id: row.incidentId})
        MATCH (database:Database {id: row.databaseId})

        CREATE (incident)-[:CAUSED_BY]->(database)
        `,
        {
          rows: incidentDatabaseCauses,
        },
      );
    });

    const nodeResult = await session.run(
      `
      MATCH (n)
      RETURN count(n) AS nodes
      `,
    );

    const relationshipResult = await session.run(
      `
      MATCH ()-[r]->()
      RETURN count(r) AS relationships
      `,
    );

    const nodeCount =
      nodeResult.records[0]?.get("nodes").toString();

    const relationshipCount =
      relationshipResult.records[0]
        ?.get("relationships")
        .toString();

    console.log("TraceGraph seed completed");
    console.log(`Nodes: ${nodeCount}`);
    console.log(`Relationships: ${relationshipCount}`);
  } finally {
    await session.close();
  }
}

seedDatabase()
  .catch((error) => {
    console.error("TraceGraph seed failed");
    console.error(error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDatabaseConnection();
  });