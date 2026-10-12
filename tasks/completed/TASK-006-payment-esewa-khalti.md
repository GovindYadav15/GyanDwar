# Task TASK-006: eSewa & Khalti Payment Integration

- **Status**: Completed
- **Assignee**: Payment Agent
- **Business Objective**: Implement payment adapters for eSewa EPAY v2 (HMAC-SHA256 signature) and Khalti ePayment v2 (lookup API) with idempotent subscription provisioning.
- **Scope**:
  - `apps/api/src/modules/payment/gateways/esewa.gateway.ts`
  - `apps/api/src/modules/payment/gateways/esewa.gateway.spec.ts`
  - `apps/api/src/modules/payment/gateways/khalti.gateway.ts`
  - `apps/api/src/modules/payment/payment.service.ts`
  - `apps/web/src/app/pricing/page.tsx`
  - `apps/web/src/app/payments/`
- **Verification Commands**:
  - `pnpm test` -> Verified HMAC signature generation, authentic callback validation, forged signature rejection, amount mismatch rejection.
- **Review Notes & Completion Evidence**:
  - Idempotent transaction execution wrapped in Prisma transactions preventing duplicate charges and double activations.
