# Security Architecture & Threat Model

## 1. Threat Scenarios & Mitigations

| Threat | Impact | Mitigation Strategy |
| --- | --- | --- |
| **Privilege Escalation via Registration** | Attacker registers with `role: "ADMIN"` or `isAdmin: true` | NestJS `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })` rejects forbidden fields with HTTP 400. Trusted server logic exclusively assigns `RoleType.STUDENT`. |
| **Unauthorized Admin Provisioning** | Attacker accesses an HTTP endpoint to create administrator accounts | No public admin creation endpoint exists. Initial admin is provisioned strictly via backend CLI command (`npm run admin:bootstrap`), locked by database state (`SystemBootstrap`). |
| **Invitation Token Tampering & Leaks** | Attacker steals or alters administrator invitations | Admin invitations generate 256-bit cryptographically secure pseudorandom tokens. Only their one-way SHA-256 hash is saved in PostgreSQL (`AdminInvitation.tokenHash`). Tokens are single-use with a 7-day TTL. |
| **Client Timer Manipulation** | Student extends test duration in browser | Server records UTC `expiresAt` at start and rejects any submission post-deadline (+ 30s grace). |
| **Answer Key Extraction** | Inspecting Network tab to find correct MCQ answers | Active attempt serialization explicitly strips `isCorrect` and `explanationText`. |
| **Forged Payment Redirect** | User fakes eSewa redirect URL to activate plan | Server ignores frontend query params for activation. Server re-calculates HMAC-SHA256 signature and performs server-to-server query. |
| **Replay / Duplicate Payment** | Same gateway transaction ID submitted twice | Database uniqueness constraint on `Payment.gatewayTransactionId` within a serialized transaction. |
| **Offline eSewa Receipt Fraud** | Attacker submits false screenshots or fake transaction codes | Orders require manual inspection of uploaded payment receipts by an authorized administrator in the Admin Panel before access is granted. |
| **Brute Force Login** | Password cracking attacks | IP and account rate limiting via `ThrottlerGuard` (max 5 failed attempts per 15 mins). |
| **SQL Injection & Mass Assignment** | Data corruption or unauthorized privilege escalation | Prisma parameterized queries + NestJS strict DTO parsing. Request objects are never spread directly into database mutation calls. |

---

## 2. Privileged Account Creation & Security Invariants

### 1. Initial Admin Provisioning Lockout
- The initial administrator is created using the CLI bootstrap utility (`backend/scripts/admin-bootstrap.ts`).
- An atomic table `SystemBootstrap` records the bootstrap event.
- Repeated executions immediately fail.
- Silent account promotion is explicitly blocked: if an account exists with the `STUDENT` role, the bootstrap utility refuses to alter the role.

### 2. Cryptographic Admin Invitations
- Only authenticated administrators with the `ADMIN` or `SUPER_ADMIN` role may issue invitations.
- Raw tokens are transmitted directly to the invited administrator and are never logged or stored in plaintext.
- The acceptance endpoint verifies the hash, checks the expiration timestamp, invalidates the token upon use, and generates the account with the `ADMIN` role.

---

## 3. Authorization Boundaries

- Every administrative route under `/api/v1/admin/*` is guarded by `JwtAuthGuard` and `RolesGuard`.
- Role verification checks database-backed `Role` entities linked through `UserRole`.
- Frontend route protections exist for user guidance, but server-side authorization is the sole source of authority.

---

## 4. Centralized Audit Logging

Every security-sensitive operation is recorded in the `AuditLog` table:
- **`SYSTEM_BOOTSTRAP_ADMIN`**: Recorded when the initial administrator is created via the CLI.
- **`ADMIN_INVITATION_CREATED`**: Recorded when an administrator issues an invitation.
- **`ADMIN_INVITATION_ACCEPTED`**: Recorded when an invitee creates their administrator account.
- **`VERIFY_STUDENT_STATUS`**: Recorded when an administrator verifies a student account.
- **`VERIFY_PAYMENT_ORDER`**: Recorded when an administrator approves an offline payment receipt.
- **`REJECT_PAYMENT_ORDER`**: Recorded when an administrator rejects an invalid payment receipt.

Audit records track the `userId` of the actor, target `resourceType` and `resourceId`, timestamp, and non-sensitive payload metadata. Passwords, raw invitation tokens, and authorization secrets are never included in audit payloads.

---

## 5. Secret Handling Policy

- Passwords are encrypted using `bcrypt` (10 rounds).
- Database credentials and API keys reside solely in environment variables (`.env`).
- No passwords, invitation tokens, or cryptographic keys are ever committed to version control.
