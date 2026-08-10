export const applications = [
  {
    id: "app-customer-portal",
    name: "Customer Portal",
    description: "Customer-facing web application",
    environment: "production",
    status: "healthy",
    criticality: "critical",
  },
  {
    id: "app-admin-console",
    name: "Admin Console",
    description: "Internal administration application",
    environment: "production",
    status: "healthy",
    criticality: "high",
  },
  {
    id: "app-mobile",
    name: "Mobile Application",
    description: "Customer mobile application",
    environment: "production",
    status: "healthy",
    criticality: "critical",
  },
];

export const services = [
  {
    id: "svc-api-gateway",
    name: "API Gateway",
    description: "Primary entry point for application traffic",
    environment: "production",
    status: "healthy",
    criticality: "critical",
    version: "3.2.0",
  },
  {
    id: "svc-auth",
    name: "Authentication Service",
    description: "Handles authentication and authorization",
    environment: "production",
    status: "healthy",
    criticality: "critical",
    version: "2.8.1",
  },
  {
    id: "svc-user",
    name: "User Service",
    description: "Manages customer profiles and accounts",
    environment: "production",
    status: "healthy",
    criticality: "high",
    version: "2.3.4",
  },
  {
    id: "svc-order",
    name: "Order Service",
    description: "Handles customer orders",
    environment: "production",
    status: "degraded",
    criticality: "critical",
    version: "4.1.2",
  },
  {
    id: "svc-payment",
    name: "Payment Service",
    description: "Handles payment processing",
    environment: "production",
    status: "degraded",
    criticality: "critical",
    version: "3.7.0",
  },
  {
    id: "svc-inventory",
    name: "Inventory Service",
    description: "Manages product inventory",
    environment: "production",
    status: "healthy",
    criticality: "high",
    version: "2.5.1",
  },
  {
    id: "svc-notification",
    name: "Notification Service",
    description: "Handles email and SMS notifications",
    environment: "production",
    status: "healthy",
    criticality: "medium",
    version: "1.9.3",
  },
  {
    id: "svc-search",
    name: "Search Service",
    description: "Provides product and content search",
    environment: "production",
    status: "healthy",
    criticality: "high",
    version: "2.2.0",
  },
];

export const databases = [
  {
    id: "db-user-postgres",
    name: "User PostgreSQL",
    engine: "PostgreSQL",
    environment: "production",
    status: "healthy",
    criticality: "high",
  },
  {
    id: "db-order-postgres",
    name: "Order PostgreSQL",
    engine: "PostgreSQL",
    environment: "production",
    status: "healthy",
    criticality: "critical",
  },
  {
    id: "db-payment-postgres",
    name: "Payment PostgreSQL",
    engine: "PostgreSQL",
    environment: "production",
    status: "degraded",
    criticality: "critical",
  },
  {
    id: "db-redis",
    name: "Redis Cache",
    engine: "Redis",
    environment: "production",
    status: "healthy",
    criticality: "high",
  },
  {
    id: "db-search-index",
    name: "Search Index",
    engine: "OpenSearch",
    environment: "production",
    status: "healthy",
    criticality: "high",
  },
];

export const externalApis = [
  {
    id: "ext-stripe",
    name: "Stripe API",
    provider: "Stripe",
    status: "healthy",
    criticality: "critical",
  },
  {
    id: "ext-sendgrid",
    name: "SendGrid API",
    provider: "SendGrid",
    status: "healthy",
    criticality: "medium",
  },
  {
    id: "ext-twilio",
    name: "Twilio API",
    provider: "Twilio",
    status: "degraded",
    criticality: "medium",
  },
];

export const teams = [
  {
    id: "team-platform",
    name: "Platform Engineering",
    email: "platform@example.com",
  },
  {
    id: "team-identity",
    name: "Identity Engineering",
    email: "identity@example.com",
  },
  {
    id: "team-commerce",
    name: "Commerce Engineering",
    email: "commerce@example.com",
  },
  {
    id: "team-payments",
    name: "Payments Engineering",
    email: "payments@example.com",
  },
];

export const incidents = [
  {
    id: "INC-1001",
    title: "Payment Processing Latency",
    description: "Payment requests are experiencing elevated latency.",
    severity: "SEV-1",
    status: "identified",
    startedAt: "2026-08-09T10:15:00Z",
    resolvedAt: null,
  },
  {
    id: "INC-1002",
    title: "Search Response Degradation",
    description: "Search requests experienced increased response times.",
    severity: "SEV-2",
    status: "monitoring",
    startedAt: "2026-08-08T07:30:00Z",
    resolvedAt: null,
  },
  {
    id: "INC-1003",
    title: "Authentication Failures",
    description: "Users experienced intermittent authentication failures.",
    severity: "SEV-2",
    status: "resolved",
    startedAt: "2026-08-05T14:10:00Z",
    resolvedAt: "2026-08-05T15:25:00Z",
  },
];

export const applicationDependencies = [
  { applicationId: "app-customer-portal", serviceId: "svc-api-gateway" },
  { applicationId: "app-admin-console", serviceId: "svc-api-gateway" },
  { applicationId: "app-mobile", serviceId: "svc-api-gateway" },
];

export const serviceDependencies = [
  { fromId: "svc-api-gateway", toId: "svc-auth" },
  { fromId: "svc-api-gateway", toId: "svc-order" },
  { fromId: "svc-api-gateway", toId: "svc-search" },

  { fromId: "svc-auth", toId: "svc-user" },

  { fromId: "svc-order", toId: "svc-payment" },
  { fromId: "svc-order", toId: "svc-inventory" },
  { fromId: "svc-order", toId: "svc-notification" },
];

export const databaseUsage = [
  { serviceId: "svc-user", databaseId: "db-user-postgres" },
  { serviceId: "svc-auth", databaseId: "db-redis" },

  { serviceId: "svc-order", databaseId: "db-order-postgres" },

  { serviceId: "svc-payment", databaseId: "db-payment-postgres" },
  { serviceId: "svc-payment", databaseId: "db-redis" },

  { serviceId: "svc-inventory", databaseId: "db-order-postgres" },

  { serviceId: "svc-search", databaseId: "db-search-index" },
];

export const externalApiCalls = [
  { serviceId: "svc-payment", externalApiId: "ext-stripe" },
  { serviceId: "svc-notification", externalApiId: "ext-sendgrid" },
  { serviceId: "svc-notification", externalApiId: "ext-twilio" },
];

export const ownership = [
  { teamId: "team-platform", serviceId: "svc-api-gateway" },
  { teamId: "team-platform", serviceId: "svc-notification" },

  { teamId: "team-identity", serviceId: "svc-auth" },
  { teamId: "team-identity", serviceId: "svc-user" },

  { teamId: "team-commerce", serviceId: "svc-order" },
  { teamId: "team-commerce", serviceId: "svc-inventory" },
  { teamId: "team-commerce", serviceId: "svc-search" },

  { teamId: "team-payments", serviceId: "svc-payment" },
];

export const incidentAffectedServices = [
  { incidentId: "INC-1001", serviceId: "svc-payment" },
  { incidentId: "INC-1001", serviceId: "svc-order" },

  { incidentId: "INC-1002", serviceId: "svc-search" },
  { incidentId: "INC-1002", serviceId: "svc-api-gateway" },

  { incidentId: "INC-1003", serviceId: "svc-auth" },
  { incidentId: "INC-1003", serviceId: "svc-user" },
];

export const incidentDatabaseCauses = [
  { incidentId: "INC-1001", databaseId: "db-payment-postgres" },
  { incidentId: "INC-1002", databaseId: "db-search-index" },
  { incidentId: "INC-1003", databaseId: "db-redis" },
];