export interface ReadinessResponse {
  data: {
    status: "ready";
    service: string;
    database: "connected";
  };
}