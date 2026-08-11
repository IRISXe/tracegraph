import request from "supertest";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { app } from "../app";

import * as incidentRepository from "../modules/incidents/incident.repository";

import type {
  Incident,
  IncidentAffectedService,
  IncidentCause,
} from "../modules/incidents/incident.types";

vi.mock(
  import(
    "../modules/incidents/incident.repository"
  ),
  async (importOriginal) => {
    const actual =
      await importOriginal();

    return {
      ...actual,

      findAllIncidents:
        vi.fn(),

      findIncidentById:
        vi.fn(),

      findIncidentAffectedServices:
        vi.fn(),

      findIncidentCause:
        vi.fn(),
    };
  },
);

const paymentIncident: Incident = {
  id: "INC-1001",

  title:
    "Payment Processing Latency",

  description:
    "Elevated latency affecting payment processing",

  severity: "SEV-1",

  status: "identified",

  startedAt:
    "2026-08-09T09:15:00Z",

  resolvedAt: null,
};

const affectedServices:
  IncidentAffectedService[] = [
    {
      id: "svc-payment",
      name: "Payment Service",
      status: "degraded",
      criticality: "critical",
    },

    {
      id: "svc-order",
      name: "Order Service",
      status: "degraded",
      criticality: "critical",
    },
  ];

const rootCause: IncidentCause = {
  id: "db-payment-postgres",
  name: "Payment PostgreSQL",
  type: "Database",
  status: "degraded",
  criticality: "critical",
};

describe(
  "Incidents API",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    describe(
      "GET /api/incidents",
      () => {
        it(
          "returns incidents",
          async () => {
            vi.mocked(
              incidentRepository.findAllIncidents,
            ).mockResolvedValue([
              paymentIncident,
            ]);

            const response =
              await request(app)
                .get(
                  "/api/incidents",
                )
                .expect(200);

            expect(
              response.body.data,
            ).toHaveLength(1);

            expect(
              response.body.data[0],
            ).toMatchObject({
              id: "INC-1001",

              title:
                "Payment Processing Latency",

              severity: "SEV-1",

              status:
                "identified",
            });
          },
        );
      },
    );

    describe(
      "GET /api/incidents/:id",
      () => {
        it(
          "returns incident analysis",
          async () => {
            vi.mocked(
              incidentRepository.findIncidentById,
            ).mockResolvedValue(
              paymentIncident,
            );

            vi.mocked(
              incidentRepository.findIncidentAffectedServices,
            ).mockResolvedValue(
              affectedServices,
            );

            vi.mocked(
              incidentRepository.findIncidentCause,
            ).mockResolvedValue(
              rootCause,
            );

            const response =
              await request(app)
                .get(
                  "/api/incidents/INC-1001",
                )
                .expect(200);

            expect(
              response.body.data.incident,
            ).toMatchObject({
              id: "INC-1001",
              severity: "SEV-1",
            });

            expect(
              response.body.data.affectedServices,
            ).toHaveLength(2);

            expect(
              response.body.data.cause,
            ).toEqual(
              rootCause,
            );

            expect(
              incidentRepository.findIncidentAffectedServices,
            ).toHaveBeenCalledWith(
              "INC-1001",
            );

            expect(
              incidentRepository.findIncidentCause,
            ).toHaveBeenCalledWith(
              "INC-1001",
            );
          },
        );

        it(
          "returns INCIDENT_NOT_FOUND for an unknown incident",
          async () => {
            vi.mocked(
              incidentRepository.findIncidentById,
            ).mockResolvedValue(
              null,
            );

            const response =
              await request(app)
                .get(
                  "/api/incidents/not-real",
                )
                .expect(404);

            expect(
              response.body.error.code,
            ).toBe(
              "INCIDENT_NOT_FOUND",
            );

            expect(
              response.body.error.message,
            ).toBeDefined();
          },
        );
      },
    );
  },
);