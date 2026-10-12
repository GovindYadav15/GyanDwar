# ExamSathi Nepal (ज्ञानद्वार - GyanDwar)

> **Production-Ready Nepal Engineering & Competitive Examination Preparation Platform**
> Specialized preparation for **NEC License Examination**, **Lok Sewa Aayog (Engineering & Technical)**, and **Diploma License Examination**.

[![CI Pipeline](https://github.com/examsathi/gyandwar/actions/workflows/ci.yml/badge.svg)](https://github.com/examsathi/gyandwar/actions/workflows/ci.yml)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![NestJS Version](https://img.shields.io/badge/NestJS-11.x-red.svg)](https://nestjs.com/)
[![Next.js Version](https://img.shields.io/badge/Next.js-15.x-black.svg)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 🌟 Key Platform Highlights

1. **Flexible Multi-Tier Educational Hierarchy**:
   - `Exam Category` (NEC License, Lok Sewa, Diploma License)
   - `Faculty / Discipline` (Civil, Electrical, Mechanical, Computer/IT, Electronics)
   - `Exam Track / Level` (e.g. Lok Sewa 7th Level / Assistant 5th Level)
   - `Subject` → `Chapter` → `Learning Materials & Assessments`

2. **Assessment & Question Bank Engine**:
   - Multiple Choice Questions (MCQ) with 4-option randomized distractors and in-depth explanations.
   - **Chapter-wise Practice Tests**: Focused revision on individual units with real-time feedback.
   - **Full-Length 100-Mark Mock Examinations**: Strict timing simulation, randomized question pools, negative marking (e.g., 20% or configurable), server-authoritative timers, and comprehensive performance analytics.
   - Safe attempt state persistence, interrupted session handling, and answer-key protection during active testing.

3. **Entitlements & Subscription Engine**:
   - Configurable free preview chapters, free diagnostic practice tests, and full premium passes.
   - Multi-tier billing: Monthly, Quarterly, and Annual access passes in Nepalese Rupees (NPR).
   - Centralized server-side entitlement enforcement for learning materials, PDFs, and tests.

4. **Nepal Payment Gateways (eSewa & Khalti)**:
   - Official **eSewa EPAY v2** with HMAC-SHA256 signature generation and server-side verification.
   - Official **Khalti ePayment v2** with server-side lookup validation and idempotency protection.
   - Resilient state reconciliation preventing double-charges, transaction replay, and fraudulent callbacks.

5. **Design System & Visual Experience**:
   - Custom palette: `#0e2148` (Slate Navy), `#483aa0` (Royal Indigo), `#7965c1` (Soft Violet), and `#e3d095` (Parchment Gold).
   - Maintainable modular CSS structure with separated CSS tokens, components, and utility layers.

---

## 🏗 Architecture & Workspace Layout

```
.
├── apps/
│   ├── web/                    # Next.js 15+ App Router, React 19, Tailwind CSS, TanStack Query
│   └── api/                    # NestJS REST API (/api/v1), Swagger OpenAPI, Prisma ORM
├── packages/
│   ├── shared/                 # Shared domain types, contracts, DTOs, validation schemas
│   └── config/                 # Shared configs (ESLint, Prettier, TypeScript)
├── prisma/
│   ├── schema.prisma           # Relational schema (PostgreSQL)
│   └── seed.ts                 # Realistic demonstration seed data
├── docs/                       # Comprehensive documentation suite
├── tasks/                      # Structured task lifecycle boards (backlog, in-progress, completed)
├── tests/                      # System integration & E2E test suites
└── docker-compose.yml          # Local containerized infrastructure (PostgreSQL, Redis, MinIO)
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js**: v20.x or v22+ (v24.16+ supported)
- **pnpm**: v9.x or v10.x
- **Docker & Docker Compose** (for PostgreSQL, Redis, and MinIO storage)

### 1. Clone & Install

```bash
git clone https://github.com/examsathi/gyandwar.git
cd gyandwar
pnpm install
```

### 2. Environment Configuration

Copy the environment template:

```bash
cp .env.example .env
```

Update credentials as necessary.

### 3. Launch Local Infrastructure

```bash
docker-compose up -d
```

This starts:

- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`
- MinIO Object Storage on `localhost:9000` (Console on `:9001`)

### 4. Database Setup & Seed

```bash
# Push schema and generate Prisma client
pnpm db:migrate
# Seed realistic NEC, Lok Sewa, and Diploma examination data
pnpm db:seed
```

### 5. Start Development Servers

```bash
pnpm dev
```

- **Web App**: [http://localhost:3000](http://localhost:3000)
- **API Server**: [http://localhost:4000](http://localhost:4000)
- **Swagger Documentation**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

---

## 🧪 Testing & Verification

Run all test suites and quality gates:

```bash
# Run unit & integration tests
pnpm test

# Check code formatting & linting
pnpm format:check
pnpm lint

# Build all packages & apps
pnpm build

# Run end-to-end full verification
pnpm verify
```

---

## 📚 Documentation Directory

- [Architecture Guide](docs/ARCHITECTURE.md)
- [Requirements & Specifications](docs/REQUIREMENTS.md)
- [Database Schema & ERD](docs/DATABASE_SCHEMA.md)
- [API Contracts & Swagger](docs/API_CONTRACTS.md)
- [Payment Integration (eSewa & Khalti)](docs/PAYMENT_INTEGRATION.md)
- [Assessment & Examination Engine](docs/ASSESSMENT_ENGINE.md)
- [Security & Threat Model](docs/SECURITY.md)
- [Testing Strategy & CI](docs/TESTING_STRATEGY.md)

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.
