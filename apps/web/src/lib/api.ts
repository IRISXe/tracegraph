const API_URL =
  import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error(
    "VITE_API_URL is not configured",
  );
}

interface ApiErrorResponse {
  error?: {
    code?: string;
    message?: string;
  };
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;

  constructor(
    status: number,
    message: string,
    code?: string,
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export async function apiGet<T>(
  path: string,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(
      `${API_URL}${path}`,
    );
  } catch {
    throw new ApiError(
      0,
      "Unable to connect to the TraceGraph API.",
      "API_UNAVAILABLE",
    );
  }

  if (!response.ok) {
    let body:
      ApiErrorResponse | undefined;

    try {
      body =
        (await response.json()) as ApiErrorResponse;
    } catch {
      body = undefined;
    }

    throw new ApiError(
      response.status,
      body?.error?.message ??
        "Something went wrong while loading TraceGraph data.",
      body?.error?.code,
    );
  }

  return response.json() as Promise<T>;
}