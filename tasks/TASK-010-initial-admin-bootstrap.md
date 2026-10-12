# TASK-010: Initial Administrator Bootstrap CLI

## Objective
Implement an isolated, non-HTTP operational CLI utility to provision the initial system administrator identity (`govind803556@gmail.com`).

## Requirements
1. Backend script: `backend/scripts/admin-bootstrap.ts`, invokable via `npm run admin:bootstrap`.
2. Connect to configured PostgreSQL database and check `SystemBootstrap` table.
3. Reject duplicate execution: bootstrap is strictly one-time.
4. Mask password input in terminal (no cleartext terminal echoing).
5. Enforce password complexity policy (min 8 chars, uppercase, lowercase, number).
6. Atomically provision `ADMIN` user, record `SystemBootstrap`, and emit `AuditLog`.
7. Reject silent student promotion if the email already belongs to a student.

## Acceptance Criteria
- [x] CLI command prompts securely or accepts operator flags.
- [x] Repeated runs exit with non-zero error and descriptive explanation.
- [x] Zero hardcoded credentials in source code or repositories.
- [x] State lock persisted in `SystemBootstrap`.
