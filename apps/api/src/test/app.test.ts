import request from "supertest";

import {
  describe,
  expect,
  it,
} from "vitest";

import { app } from "../app";

describe(
  "TraceGraph API",
  () => {
    describe(
      "GET /health",
      () => {
        it(
          "returns API health information",
          async () => {
            const response =
              await request(app)
                .get("/health")
                .expect(200);

            expect(
              response.body,
            ).toEqual({
              data: {
                status: "ok",
                service:
                  "tracegraph-api",
              },
            });
          },
        );
      },
    );

    describe(
      "unknown routes",
      () => {
        it(
          "returns a structured 404 response",
          async () => {
            const response =
              await request(app)
                .get(
                  "/api/does-not-exist",
                )
                .expect(404);

            expect(
              response.body,
            ).toEqual({
              error: {
                code:
                  "ROUTE_NOT_FOUND",

                message:
                  "Route GET /api/does-not-exist was not found",
              },
            });
          },
        );
      },
    );
  },
);