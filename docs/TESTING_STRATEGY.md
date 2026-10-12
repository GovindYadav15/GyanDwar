# Testing Strategy & Quality Assurance

## 1. Testing Pyramid

- **Unit Tests**:
  - Assessment Scoring: Positive marks, negative marks deduction, accuracy percentage, pass/fail evaluation.
  - Payment Gateways: HMAC-SHA256 signature generation, payload verification, sandbox mocks.
  - Entitlements: Plan validity, expiration boundaries, role checks.
- **Integration Tests**:
  - API endpoint lifecycles using Supertest and NestJS Test module.
  - Full attempt lifecycle: Start -> Answer Save -> Submit -> Scorecard.
  - Payment idempotency: Multiple callbacks for the same order handle gracefully.
- **End-to-End Tests**:
  - Simulated student journey: Register, browse category, start chapter practice, submit test, purchase plan, verify entitlement.

## 2. Test Commands

```bash
# Run all workspace tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run integration tests
pnpm test:integration
```
