# TASK-012: Authorization & Centralized Audit Logging

## Objective
Enforce strict server-side role authorization and record all security-critical administrative and financial actions.

## Requirements
1. Protect all `/api/v1/admin/*` routes with `JwtAuthGuard` and `RolesGuard([RoleType.ADMIN, RoleType.SUPER_ADMIN])`.
2. Implement student listing and verification (`GET /api/v1/admin/students`, `POST /api/v1/admin/students/:userId/verify`).
3. Implement multi-course payment order inspection and verification (`GET /api/v1/admin/orders`, `POST /api/v1/admin/orders/:orderId/verify`).
4. Centralize event emission in `AuditLog` table with action names, resource types, and sanitized metadata.

## Acceptance Criteria
- [x] Students cannot invoke administrative endpoints.
- [x] Admin approval of payment unlocks course enrollments and subscription entitlements.
- [x] Audit logs record bootstrap, invitations, student verification, and payment orders.
