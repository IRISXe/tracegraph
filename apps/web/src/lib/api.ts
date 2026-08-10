const API_URL = import.meta.env.VITE_API_URL;

export type HealthResponse = {
  status: string;
  service: string;
};

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_URL}/api/health`);

  if (!response.ok) {
    throw new Error("Failed to connect to TraceGraph API");
  }

  return response.json();
}