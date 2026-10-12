# AGENTS.md — Multi-Agent Engineering Governance & Guidelines

## 1. Project Purpose & Architecture

**ExamSathi Nepal** (repository `GyanDwar`) is an enterprise-grade, production-oriented online examination preparation platform for Nepal's engineering licensing (NEC), civil/technical competitive examinations (Lok Sewa Aayog), and Diploma licensing examinations.

### Architecture Overview

- **Monorepo**: Managed via `pnpm` workspaces (`apps/*`, `packages/*`).
- **Frontend (`apps/web`)**: Next.js (App Router), React, TypeScript, Tailwind CSS, TanStack Query, shadcn/ui accessible components.
- **Backend (`apps/api`)**: NestJS, TypeScript, REST API (`/api/v1`), Swagger/OpenAPI, Prisma ORM, centralized error handling, structured logging.
- **Shared (`packages/shared`)**: Shared TypeScript interfaces, enums, DTOs, and validation schemas.
- **Data & Storage**: PostgreSQL (relational), Redis (cache/rate-limit), S3-compatible storage (notes, PDFs, diagrams).
- **Payment Gateways**: eSewa and Khalti integrations via modular provider adapters with strict server-side signature validation and idempotent transaction processing.

---

## 2. Directory Responsibilities & File Boundaries

| Path               | Responsibility                                                        | Primary Agent Owner    |
| ------------------ | --------------------------------------------------------------------- | ---------------------- |
| `apps/web/`        | Next.js App Router, React UI components, client state, styling        | **Frontend Agent**     |
| `apps/api/`        | NestJS modules, controllers, services, guards, pipes, background jobs | **Backend Agent**      |
| `packages/shared/` | Cross-app types, DTO contracts, validation schemas, enums             | **Architecture Agent** |
| `prisma/`          | Database schema (`schema.prisma`), migrations, seed datasets          | **Database Agent**     |
| `docs/`            | Architecture, security, API specs, payment guides, ADRs               | **All Agents**         |
| `tasks/`           | Backlog, active, and completed task files                             | **Task Coordinator**   |
| `tests/`           | System-level integration tests, E2E fixtures                          | **QA Agent**           |
| `scripts/`         | Local setup, database migration, and verification automation          | **DevOps Agent**       |

---

## 3. Strict Coding Conventions & Quality Gates

### TypeScript Strictness

- `strict: true` is strictly enforced across all packages.
- Zero `any` policy: every data structure, API payload, and parameter must be explicitly typed.
- Nullability must be handled safely via optional chaining and narrowing (`noImplicitAny`, `strictNullChecks`).
- Server Components by default in Next.js; Client Components (`'use client'`) must only be used when interactive state/hooks are necessary.

### CSS & Design System Architecture

- **Palette Tokens**:
  - Slate Navy: `#0e2148`
  - Royal Indigo: `#483aa0`
  - Soft Violet: `#7965c1`
  - Parchment Amber: `#e3d095`
- **Maintainability Rule**: Do **not** dump all custom CSS into a single unstructured `index.css`. Style assets must be modularized into:
  - `apps/web/src/styles/tokens.css` (CSS custom properties, themes, design variables)
  - `apps/web/src/styles/components.css` (Component layer abstractions)
  - `apps/web/src/styles/utilities.css` (Specialized animations & utilities)
  - Linked through Tailwind CSS configuration.

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

---

## 5. Task Management Lifecycle

All work items follow the lifecycle:
`tasks/backlog/` → `tasks/ready/` → `tasks/in-progress/` → `tasks/review/` → `tasks/completed/`

A task is considered complete ONLY when:

1. All acceptance criteria are satisfied.
2. Code follows documented architecture and styling standards.
3. Automated unit and/or integration tests pass.
4. Lints, TypeScript checks, and builds pass cleanly.
5. Documentation and task files are updated with verifiable proof.

---

## 6. Verification Commands

- Check formatting: `pnpm format:check`
- Lint code: `pnpm lint`
- Type-check: `pnpm build` (or `tsc --noEmit` in workspace packages)
- Run tests: `pnpm test`
- Full pipeline verification: `pnpm verify`
