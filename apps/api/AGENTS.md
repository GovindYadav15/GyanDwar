# Backend Agent Guidelines — NestJS API (`apps/api`)

## Domain & Responsibilities

The Backend Agent owns `apps/api/` and collaborates with the Database Agent on `prisma/`.

### Mandates:

1. All endpoints must reside under `/api/v1` and feature full Swagger `@ApiTags`, `@ApiOperation`, and response schemas.
2. Maintain clean architectural layers:
   - `Controllers`: Route handling, HTTP status codes, parameter extraction.
   - `Services`: Core business logic, transactions, third-party gateway interactions.
   - `DTOs`: Whitelisted, validated inputs using `class-validator`.
   - `Guards`: Authentication (`JwtAuthGuard`) and Authorization (`RolesGuard`, `EntitlementGuard`).
3. Assessment integrity:
   - When returning questions for an active attempt, strip correct answers and explanations.
   - Evaluate submissions server-side with negative mark deductions.
4. Payment security:
   - Verify eSewa HMAC-SHA256 signatures server-side.
   - Check Khalti transactions via lookup endpoint.
   - Apply idempotent updates within transactions.
