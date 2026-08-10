const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is not configured");
}

export class ApiError extends Error {
  public readonly status: number;

  constructor(
    status: number,
    message: string,
  ) {
    super(message);

    this.status = status;
    this.name = "ApiError";
  }
}

export async function apiGet<T>(
  path: string,
): Promise<T> {
  const response = await fetch(
    `${API_URL}${path}`,
  );

  if (!response.ok) {
    let message = "Something went wrong";

    try {
      const body = await response.json();

      message =
        body?.error?.message ??
        message;
    } catch {
      // Response did not contain JSON.
    }

    throw new ApiError(
      response.status,
      message,
    );
  }

  return response.json() as Promise<T>;
}