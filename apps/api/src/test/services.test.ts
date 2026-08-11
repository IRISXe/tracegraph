import request from "supertest";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { app } from "../app";

import * as serviceRepository from "../modules/services/service.repository";

import type {
  Service,
  ServiceDependent,
} from "../modules/services/service.types";

/*
 * Mock only the repository/database layer.
 *
 * Route
 *   ↓
 * Controller
 *   ↓
 * Service
 *   ↓
 * Repository  ← mocked here
 *   ↓
 * CognoDB
 *
 * This means our HTTP/controller/service
 * behavior remains real during these tests,
 * while we don't depend on the live database.
 */
vi.mock(
  import(
    "../modules/services/service.repository"
  ),
  async (importOriginal) => {
    const actual =
      await importOriginal();

    return {
      ...actual,

      findAllServices:
        vi.fn(),

      findServiceById:
        vi.fn(),

      findServiceDependencies:
        vi.fn(),

      findServiceDependents:
        vi.fn(),

      findServiceOwner:
        vi.fn(),
    };
  },
);

/*
 * Test fixtures
 */
const paymentService: Service = {
  id: "svc-payment",

  name: "Payment Service",

  description:
    "Handles payment processing",

  environment: "production",

  status: "degraded",

  criticality: "critical",

  version: "3.7.0",
};

const orderService: Service = {
  id: "svc-order",

  name: "Order Service",

  description:
    "Handles customer orders",

  environment: "production",

  status: "degraded",

  criticality: "critical",

  version: "4.1.2",
};

describe(
  "Services API",
  () => {
    /*
     * Clear call history and mock state
     * between every test.
     */
    beforeEach(() => {
      vi.clearAllMocks();
    });

    /*
     * GET /api/services
     */
    describe(
      "GET /api/services",
      () => {
        it(
          "returns services",
          async () => {
            vi.mocked(
              serviceRepository
                .findAllServices,
            ).mockResolvedValue([
              paymentService,
              orderService,
            ]);

            const response =
              await request(app)
                .get(
                  "/api/services",
                )
                .expect(200);

            expect(
              response.body.data,
            ).toHaveLength(2);

            expect(
              response.body.data[0],
            ).toMatchObject({
              id:
                "svc-payment",

              name:
                "Payment Service",

              status:
                "degraded",

              criticality:
                "critical",
            });

            expect(
              serviceRepository
                .findAllServices,
            ).toHaveBeenCalledTimes(
              1,
            );
          },
        );
      },
    );

    /*
     * GET /api/services/:id
     */
    describe(
      "GET /api/services/:id",
      () => {
        it(
          "returns a service",
          async () => {
            vi.mocked(
              serviceRepository
                .findServiceById,
            ).mockResolvedValue(
              paymentService,
            );

            const response =
              await request(app)
                .get(
                  "/api/services/svc-payment",
                )
                .expect(200);

            expect(
              response.body.data,
            ).toMatchObject({
              id:
                "svc-payment",

              name:
                "Payment Service",

              environment:
                "production",

              status:
                "degraded",

              criticality:
                "critical",

              version:
                "3.7.0",
            });

            expect(
              serviceRepository
                .findServiceById,
            ).toHaveBeenCalledWith(
              "svc-payment",
            );

            expect(
              serviceRepository
                .findServiceById,
            ).toHaveBeenCalledTimes(
              1,
            );
          },
        );

        it(
          "returns SERVICE_NOT_FOUND when service does not exist",
          async () => {
            vi.mocked(
              serviceRepository
                .findServiceById,
            ).mockResolvedValue(
              null,
            );

            const response =
              await request(app)
                .get(
                  "/api/services/not-real",
                )
                .expect(404);

            expect(
              response.body.error
                .code,
            ).toBe(
              "SERVICE_NOT_FOUND",
            );

            expect(
              response.body.error
                .message,
            ).toBeDefined();

            expect(
              serviceRepository
                .findServiceById,
            ).toHaveBeenCalledWith(
              "not-real",
            );
          },
        );
      },
    );

    /*
     * GET /api/services/:id/blast-radius
     *
     * This is one of TraceGraph's most
     * important graph-specific tests.
     */
    describe(
      "GET /api/services/:id/blast-radius",
      () => {
        it(
          "calculates multi-hop service impact",
          async () => {
            const dependents:
              ServiceDependent[] = [
                /*
                 * Depth 1
                 *
                 * Order depends directly
                 * on Payment.
                 */
                {
                  id:
                    "svc-order",

                  name:
                    "Order Service",

                  type:
                    "Service",

                  status:
                    "degraded",

                  criticality:
                    "critical",

                  depth: 1,
                },

                /*
                 * Depth 2
                 *
                 * API Gateway eventually
                 * depends on Payment through
                 * Order Service.
                 */
                {
                  id:
                    "svc-api-gateway",

                  name:
                    "API Gateway",

                  type:
                    "Service",

                  status:
                    "healthy",

                  criticality:
                    "critical",

                  depth: 2,
                },

                /*
                 * Depth 3 applications
                 */
                {
                  id:
                    "app-customer-portal",

                  name:
                    "Customer Portal",

                  type:
                    "Application",

                  status:
                    "healthy",

                  criticality:
                    "critical",

                  depth: 3,
                },

                {
                  id:
                    "app-admin-console",

                  name:
                    "Admin Console",

                  type:
                    "Application",

                  status:
                    "healthy",

                  criticality:
                    "high",

                  depth: 3,
                },

                {
                  id:
                    "app-mobile",

                  name:
                    "Mobile Application",

                  type:
                    "Application",

                  status:
                    "healthy",

                  criticality:
                    "critical",

                  depth: 3,
                },
              ];

            /*
             * Service exists.
             */
            vi.mocked(
              serviceRepository
                .findServiceById,
            ).mockResolvedValue(
              paymentService,
            );

            /*
             * Pretend CognoDB traversal
             * returned this impact chain.
             */
            vi.mocked(
              serviceRepository
                .findServiceDependents,
            ).mockResolvedValue(
              dependents,
            );

            const response =
              await request(app)
                .get(
                  "/api/services/svc-payment/blast-radius",
                )
                .expect(200);

            /*
             * Payment's downstream impact:
             *
             * 2 services
             * 3 applications
             * ----------------
             * 5 components
             *
             * Critical:
             * Order
             * API Gateway
             * Customer Portal
             * Mobile Application
             *
             * = 4
             *
             * Maximum traversal depth = 3
             */
            expect(
              response.body.data
                .summary,
            ).toEqual({
              affectedComponents:
                5,

              affectedServices:
                2,

              affectedApplications:
                3,

              criticalComponents:
                4,

              maximumDepth:
                3,
            });

            expect(
              response.body.data
                .impactedComponents,
            ).toHaveLength(5);

            expect(
              response.body.data
                .service,
            ).toMatchObject({
              id:
                "svc-payment",

              name:
                "Payment Service",
            });

            expect(
              serviceRepository
                .findServiceById,
            ).toHaveBeenCalledWith(
              "svc-payment",
            );

            expect(
              serviceRepository
                .findServiceDependents,
            ).toHaveBeenCalledWith(
              "svc-payment",
            );
          },
        );

        it(
          "returns SERVICE_NOT_FOUND when blast radius service does not exist",
          async () => {
            vi.mocked(
              serviceRepository
                .findServiceById,
            ).mockResolvedValue(
              null,
            );

            const response =
              await request(app)
                .get(
                  "/api/services/not-real/blast-radius",
                )
                .expect(404);

            expect(
              response.body.error
                .code,
            ).toBe(
              "SERVICE_NOT_FOUND",
            );

            /*
             * Because the service doesn't
             * exist, there is no reason to
             * execute the graph traversal.
             */
            expect(
              serviceRepository
                .findServiceDependents,
            ).not.toHaveBeenCalled();
          },
        );
      },
    );
  },
);