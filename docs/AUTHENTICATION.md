# Authentication & Administrator Provisioning Architecture

## 1. Overview

**ExamSathi Nepal** uses stateless JSON Web Token (JWT) authentication for API communications between the Next.js frontend and NestJS backend, backed by PostgreSQL and Prisma ORM.

The platform strictly enforces a two-tier role model for end users:
- `STUDENT`: Public user role capable of browsing subjects, taking exams, purchasing courses, and managing study material.
- `ADMIN`: Privileged administrator role capable of managing questions, reviewing students, verifying offline eSewa payments, provisioning access, and issuing administrator invitations.

---

## 2. Public Student Registration

### Endpoint: `POST /api/v1/auth/register`

Public registration is strictly designed to assign only the `STUDENT` role:
1. **Request Whitelisting**: DTO validation allows only `email`, `password`, `fullName`, and `phoneNumber`. Privilege-escalation payloads (e.g. `role: "ADMIN"` or `isAdmin: true`) are rejected with `400 Bad Request`.
2. **Email Normalization**: Emails are trimmed and lowercased before deduplication checks.
3. **Password Policy**: Minimum 8 characters, requiring uppercase, lowercase, and numeric digits.
4. **Credential Hashing**: Passwords are saved as one-way salted hashes using `bcrypt` (10 rounds). Plaintext passwords are never persisted or logged.
5. **Trusted Server Assignment**: The `STUDENT` role is mapped server-side directly in the database transaction.
6. **Response Sanitization**: Returns only `{ id, email, fullName, roles }`, excluding password hashes and authentication secrets.

---

## 3. Initial Administrator Bootstrap

### Operational CLI Command: `npm run admin:bootstrap` (in `backend/`)

To prevent public exploitation, administrative accounts cannot be created via public HTTP endpoints. An initial bootstrapping CLI command provisions the primary administrator identity (`govind803556@gmail.com`).

### Workflow & Invariants:
1. **Environment Check**: Verifies that `DATABASE_URL` is configured and reaches the primary PostgreSQL database.
2. **One-Time Execution Lock**: Checks the `SystemBootstrap` table. If a bootstrap record exists, the command terminates immediately.
3. **Email Resolution**: Accepts `--email` or prompts interactively (defaults to `govind803556@gmail.com`).
4. **Student Conflict Protection**: If an account with this email already exists as a `STUDENT`, the script stops and aborts. Silent role elevation is prohibited.
5. **Masked Password Prompt**: Accepts the password interactively via raw TTY with asterisks masking, confirms the password, and checks complexity.
6. **Atomic Provisioning**: In a single database transaction:
   - Ensures the `ADMIN` role exists in the `Role` table.
   - Inserts the `User` record with the hashed password and `ADMIN` role association.
   - Creates a persistent `SystemBootstrap` record (`bootstrappedAt`, `adminEmail`, `ipAddress`).
   - Writes an entry to `AuditLog` (`action: "SYSTEM_BOOTSTRAP_ADMIN"`).
7. **Safe Output**: Emits only non-sensitive confirmation. Credentials are never printed.

### Running the Bootstrap Command:
```bash
cd backend

# Interactive prompt (recommended in terminal)
npm run admin:bootstrap

# Non-interactive operator invocation
npm run admin:bootstrap -- --email govind803556@gmail.com --password YourSecurePassword123! --non-interactive
```

---

## 4. Administrator Invitation Lifecycle

Once the initial administrator is provisioned, additional administrators are invited through an authenticated invitation workflow.

### 1. Creation (`POST /api/v1/admin/invitations`)
- **Authorization**: Requires an active JWT token with the `ADMIN` or `SUPER_ADMIN` role.
- **Payload**: `{ email: "newadmin@examsathi.com" }`
- **Token Generation**: Generates 32 bytes of cryptographic randomness (`crypto.randomBytes(32).toString('hex')`).
- **Storage**: Only the **SHA-256 hash** of the token is stored in the database (`AdminInvitation.tokenHash`). The raw token is delivered out-of-band or via email.
- **Expiration**: Invitations expire 7 days after creation (`expiresAt`).

### 2. Acceptance (`POST /api/v1/auth/admin-invitations/accept`)
- **Public Endpoint**: Allows the invitee to establish their administrative credentials.
- **Payload**: `{ token: "...", newPassword: "...", fullName: "..." }`
- **Validation**:
  - The incoming token is hashed with SHA-256 and matched against pending invitations.
  - Verifies that `status == PENDING` and `expiresAt > now()`.
  - Atomically marks `status = ACCEPTED` and sets `acceptedAt`.
  - Creates the new user with the `ADMIN` role.
  - Persists an `AuditLog` entry documenting the acceptance.

### 3. Listing & Revocation
- `GET /api/v1/admin/invitations`: Lists all invitations with metadata and status.
- `DELETE /api/v1/admin/invitations/:id`: Revokes an outstanding invitation.

---

## 5. Token & Session Management

- **Access Token**: Short-lived JWT containing `{ sub: userId, email, roles: [RoleType] }`.
- **Validation**: `JwtAuthGuard` verifies signature and expiration on every protected request.
- **Role Enforcement**: `RolesGuard` compares `@Roles(...)` metadata with user claims.

---

## 6. Account Recovery & Password Rotation

- Account recovery requests require email token validation.
- Password updates invalidate existing active JWTs upon token expiration.
- In production, MFA (TOTP) should be enforced for all accounts with `ADMIN` privileges.
