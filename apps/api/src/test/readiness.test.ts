import request from "supertest";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  checkDatabaseReadiness,
} from "../db/cognodb";

import { app } from "../app";

/*
 * Keep the real CognoDB module exports,
 * but replace only the readiness check.
 *
 * The Neo4j driver can still be created,
 * but these tests never connect to the
 * real database because readiness is mocked.
 */
vi.mock(
  import("../db/cognodb"),
  async (importOriginal) => {
    const actual =
      await importOriginal();

    return {
      ...actual,

      checkDatabaseReadiness:
        vi.fn(),
    };
  },
);

const mockedCheckDatabaseReadiness =
  vi.mocked(
    checkDatabaseReadiness,
  );

describe(
  "TraceGraph readiness",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it(
      "returns 200 when CognoDB is available",
      async () => {
        mockedCheckDatabaseReadiness
          .mockResolvedValue(true);

        const response =
          await request(app)
            .get("/ready")
            .expect(200);

        expect(
          response.body,
        ).toEqual({
          data: {
            status: "ready",
            service:
              "tracegraph-api",
            database:
              "connected",
          },
        });

        expect(
          mockedCheckDatabaseReadiness,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "returns 503 when CognoDB is unavailable",
      async () => {
        mockedCheckDatabaseReadiness
          .mockResolvedValue(false);

        const response =
          await request(app)
            .get("/ready")
            .expect(503);

        expect(
          response.body,
        ).toEqual({
          error: {
            code:
              "DATABASE_UNAVAILABLE",

            message:
              "TraceGraph API is running, but CognoDB is currently unavailable",
          },
        });

        expect(
          mockedCheckDatabaseReadiness,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );
  },
);