# TASK-011: Authorized Admin Invitations

## Objective
Implement a cryptographically secure, authorized invitation workflow for provisioning additional administrators.

## Requirements
1. Admin invitation creation: `POST /api/v1/admin/invitations` (requires `ADMIN` or `SUPER_ADMIN` role).
2. Generate 32 bytes of cryptographically secure pseudorandom token.
3. Persist only the SHA-256 hash in `AdminInvitation.tokenHash`.
4. Invitation acceptance: `POST /api/v1/auth/admin-invitations/accept`.
5. Atomic redemption: verify hash, expiration, and single-use status, then provision user with `ADMIN` role.
6. Invitation management: list (`GET /api/v1/admin/invitations`) and revocation (`DELETE /api/v1/admin/invitations/:id`).

## Acceptance Criteria
- [x] Unauthenticated or student users cannot issue admin invitations.
- [x] Only SHA-256 hashes stored in database.
- [x] Expired or reused tokens rejected.
- [x] Audit logs recorded for invitation creation and acceptance.
