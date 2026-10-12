# TASK-009: Secure Student Registration

## Objective
Implement hardened public student registration preventing privilege escalation and enforcing zero-trust role assignment.

## Requirements
1. Public registration endpoint: `POST /api/v1/auth/register`.
2. Strict DTO validation with NestJS `whitelist: true, forbidNonWhitelisted: true`.
3. Reject client-injected role fields (`role: "ADMIN"`, `isAdmin: true`).
4. Force server-side `RoleType.STUDENT` assignment.
5. Password hashing via salted `bcrypt` (10 rounds).
6. Response sanitization to exclude hashes, tokens, or security metadata.

## Acceptance Criteria
- [x] Whitelisted DTO schema enforces valid email, password, and profile fields.
- [x] Privilege escalation attempts return HTTP 400.
- [x] Passwords stored only as salted hashes.
- [x] Response payload omits internal security fields.
