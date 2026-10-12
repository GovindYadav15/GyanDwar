# AGENTS.md — Engineering Governance & Guidelines

## 1. Project Purpose & Architecture

**ExamSathi Nepal** (repository `GyanDwar`) is an enterprise-grade, production-oriented online examination preparation platform for Nepal's engineering licensing (NEC), civil/technical competitive examinations (Lok Sewa Aayog), and Diploma licensing examinations.

### Architecture Overview

- **Repository Layout**: Two self-contained, independent projects at root: `frontend/` and `backend/`.
- **Frontend (`frontend/`)**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS, TanStack Query, Lucide icons, responsive student and admin dashboards, Markdown MCQ studio, PDF viewer.
- **Backend (`backend/`)**: NestJS 11, TypeScript, REST API (`/api/v1`), Swagger/OpenAPI, Prisma ORM (`backend/prisma`), centralized error handling, structured logging.
- **Shared Contracts**: Common TypeScript interfaces, enums, DTOs, and validation schemas reside inside `src/shared` in each project and are resolved via `@examsathi/shared`.
- **Data & Storage**: PostgreSQL (relational), Redis (cache/rate-limit), S3-compatible storage (notes, PDFs, diagrams).
- **Payment Gateways**: eSewa and Khalti integrations via modular provider adapters with strict server-side signature validation and idempotent transaction processing.

---

## 2. Directory Responsibilities & File Boundaries

| Path                  | Responsibility                                                                 | Team / Owner           |
| --------------------- | ------------------------------------------------------------------------------ | ---------------------- |
| `frontend/`           | Complete Next.js application, UI components, client state, styling, pages       | **Frontend Team**      |
| `backend/`            | Complete NestJS API, controllers, services, database schema, Prisma, migrations | **Backend Team**       |
| `backend/prisma/`     | Database schema (`schema.prisma`), migrations, seed script (`seed.ts`)          | **Backend Team**       |
| `backend/src/shared/` | API types, DTO contracts, enums used by backend                                | **Backend Team**       |
| `frontend/src/shared/`| API types, DTO contracts, enums used by frontend                               | **Frontend Team**      |
| `docs/`               | Architecture, security, API specs, payment guides, ADRs                        | **Both Teams**         |

---

## 3. Strict Coding Conventions & Quality Gates

### TypeScript Strictness

- `strict: true` / safe type handling enforced across projects.
- Zero `any` policy: every data structure, API payload, and parameter must be explicitly typed.
- Nullability must be handled safely via optional chaining and narrowing (`strictNullChecks`).
- Server Components by default in Next.js; Client Components (`'use client'`) must only be used when interactive state/hooks are necessary.

### CSS & Design System Architecture

- **Palette Tokens**:
  - Slate Navy: `#0e2148`
  - Royal Indigo: `#483aa0`
  - Soft Violet: `#7965c1`
  - Parchment Amber: `#e3d095`
- **Modular Styles**:
  - `frontend/src/styles/tokens.css` (CSS custom properties, themes, design variables)
  - `frontend/src/styles/components.css` (Component layer abstractions)
  - `frontend/src/styles/utilities.css` (Specialized animations & utilities)
  - `frontend/src/styles/globals.css` (Global imports)

### Assessment & Business Rules

- **Server Authority**: Test timers and durations are strictly tracked on the server (`startedAt`, `expiresAt`). Browser timers are visual conveniences only.
- **Information Protection**: Correct answers, answer keys, and hidden explanations must NEVER be returned in examination payloads during an active attempt.
- **Financial Precision**: Money amounts must be modeled in NPR using integers (Paisa) or exact Decimal fields, never JavaScript floating-point arithmetic.

---

## 4. Strict Approval & Risk Boundaries

Agents may independently carry out routine development, testing, refactoring, and documentation within assigned tasks.

### Gates Requiring Explicit User Approval:

1. Deleting or overwriting user data or production database tables.
2. Running destructive database migrations or resetting databases.
3. Modifying external production credentials or secrets.
4. Introducing major external dependencies or paid third-party APIs.
5. Breaking existing shared API contracts without backwards compatibility.
6. Triggering destructive cleanup scripts.

### Mandatory Security & Provisioning Governance Rules:

1. **Public Registration Role Assignment**: Public registration (`POST /api/v1/auth/register`) must always explicitly assign `STUDENT`. Never accept role elevation flags (e.g. `role: "ADMIN"` or `isAdmin: true`) from public clients.
2. **Approved Provisioning Mechanisms**: Initial admin accounts must only be created via the secure CLI bootstrap command (`npm run admin:bootstrap`), which enforces one-time execution locks and audit logging. Additional administrators must use authorized cryptographic invitation workflows (`/api/v1/admin/invitations`).
3. **Zero Hardcoded Credentials**: Never write credentials, admin passwords, invitation tokens, or secrets to source code, migrations, seed scripts, `.env.example`, Dockerfiles, documentation, or commit history.
4. **No Silent Student Promotion**: Existing student accounts must never be silently or automatically converted to administrator accounts during bootstrap or registration.
5. **Enforced Backend Authorization**: All administrative endpoints (`/api/v1/admin/*`, verification, metrics, question creation) must require backend token validation and role authorization (`RoleType.ADMIN` / `RoleType.SUPER_ADMIN`). Never rely on hidden UI elements.
6. **Required Security Tests**: All pull requests and feature increments modifying authentication, authorization, or role management must include tests verifying resistance against privilege escalation and token forgery.
7. **Explicit Approval for Security Boundary Changes**: Any modification that alters role boundaries, authentication guards, or token validation policies requires explicit user approval.

---

## 5. Development & Verification Commands

### Backend:
```bash
cd backend
npm install
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:seed        # Seed database
npm run dev            # Start development server on port 4000
npm run build          # Compile NestJS (dist/main.js)
npm test               # Run all test suites
```

### Frontend:
```bash
cd frontend
npm install
npm run dev            # Start Next.js on port 3000
npm run build          # Compile Next.js production bundle
```

---

## 6. Mandatory Pre-Completion Verification Protocol

> **CRITICAL RULE FOR ALL AGENTS**: No agent may mark a task complete, conclude their turn, or hand off work to the user without completing this verification checklist:

1. **Backend Verification**:
   - `cd backend && npm run build` exits with code 0 (`dist/main.js` emitted).
   - `cd backend && npm test` passes all test suites.
2. **Frontend Verification**:
   - `cd frontend && npm run build` exits with code 0 (all App Router routes compile).
3. **Runtime Smoke Verification**:
   - Ensure the server starts without missing module crashes: `node backend/dist/main.js`.
