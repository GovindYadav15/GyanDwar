# ADR 0001: Modular Monorepo Architecture with NestJS & Next.js

## Context

ExamSathi Nepal requires a robust web application for students, a full-featured management portal for administrators, and a backend powering secure assessments and payment integrations. Maintaining separate repositories would create contract drift and dual dependency overhead.

## Decision

We adopt a `pnpm` workspace monorepo containing:

- `apps/web`: Next.js 15 (App Router)
- `apps/api`: NestJS 11
- `packages/shared`: Shared TypeScript types, schemas, and enums

## Consequences

- Single source of truth for contracts and types.
- Unified CI and verification commands.
