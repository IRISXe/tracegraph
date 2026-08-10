import type {
  ErrorRequestHandler,
} from "express";

import {
  AppError,
} from "../utils/app-error";

function getErrorCode(
  error: unknown,
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    return String(
      error.code ?? "",
    );
  }

  return "";
}

function isDatabaseUnavailableError(
  error: unknown,
): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const code =
    getErrorCode(error);

  return (
    error.name ===
      "ServiceUnavailable" ||
    error.name ===
      "SessionExpired" ||
    code ===
      "ServiceUnavailable" ||
    code.startsWith(
      "Neo.TransientError.Network",
    )
  );
}

export const errorHandler:
  ErrorRequestHandler = (
    error,
    _req,
    res,
    _next,
  ) => {
    if (
      error instanceof AppError
    ) {
      res.status(
        error.statusCode,
      ).json({
        error: {
          code: error.code,
          message:
            error.message,
        },
      });

      return;
    }

    if (
      isDatabaseUnavailableError(
        error,
      )
    ) {
      console.error(
        "CognoDB unavailable:",
        error,
      );

      res.status(503).json({
        error: {
          code:
            "DATABASE_UNAVAILABLE",

          message:
            "Infrastructure data is temporarily unavailable. Please try again shortly.",
        },
      });

      return;
    }

    console.error(
      "Unhandled error:",
      error,
    );

    res.status(500).json({
      error: {
        code:
          "INTERNAL_SERVER_ERROR",

        message:
          "An unexpected error occurred",
      },
    });
  };