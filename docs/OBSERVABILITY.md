# Observability & Monitoring

## 1. Structured Logging

The NestJS API uses structured JSON logging with request correlation IDs (`X-Correlation-ID`), HTTP methods, status codes, and execution latencies.

## 2. Health Probes

- `GET /health/liveness`: Verifies HTTP server is responding.
- `GET /health/readiness`: Verifies database connection and Redis availability.
