# TASK-013: Security Regression & Provisioning Tests

## Objective
Implement comprehensive automated tests validating privilege boundaries, bootstrap invariants, token cryptography, and role authorization.

## Requirements
1. Jest test suite in `backend/test/security-provisioning.spec.ts`.
2. Test cases for:
   - Public registration rejecting `role: "ADMIN"` and `isAdmin: true`.
   - Admin bootstrap command enforcing single-use locks and resisting silent student promotion.
   - Admin invitations generating unguessable tokens, SHA-256 storage, and single-use enforcement.
   - Multi-course offline payment verification activating `CourseEnrollment` records.
   - Role-based access control blocking students from administrative routes.

## Acceptance Criteria
- [x] All test suites pass cleanly (`npm test`).
- [x] Zero flaky tests or hardcoded production secrets.
