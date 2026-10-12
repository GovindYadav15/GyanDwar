# ExamSathi Nepal (ज्ञानद्वार - GyanDwar)

> **Production-Ready Nepal Engineering & Competitive Examination Preparation Platform**  
> Specialized preparation for **NEC License Examination**, **Lok Sewa Aayog (Engineering & Technical)**, and **Diploma License Examination**.

[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![NestJS Version](https://img.shields.io/badge/NestJS-11.x-red.svg)](https://nestjs.com/)
[![Next.js Version](https://img.shields.io/badge/Next.js-15.x-black.svg)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 🌟 Key Platform Highlights

1. **Flexible Multi-Tier Educational Hierarchy**:
   - `Exam Category` (NEC License, Lok Sewa, Diploma License)
   - `Discipline` (Civil, Electrical, Mechanical, Computer/IT, Electronics)
   - `Exam Track` (e.g. Lok Sewa 7th Level / Assistant 5th Level)
   - `Subject` → `Chapter` → `Sub-Chapters & PDF Notes` → `Assessments`

2. **Assessment & Question Bank Engine**:
   - Multiple Choice Questions (MCQ) with 4-option randomized distractors and explanations.
   - **Markdown MCQ Import Studio**: Admin can paste or import standard `.md` MCQ question pools.
   - **Chapter-wise Practice Tests**: Focused revision on individual units with real-time feedback.
   - **Full-Length 100-Mark Mock Examinations**: Strict timing simulation, randomized question pools, negative marking (20%), server-authoritative timers.

3. **Admin Studio & Entitlements**:
   - Course, chapter, and sub-chapter PDF management with multi-file viewer.
   - Manual & Automated payment receipt verification to grant course access.
   - Multi-tier billing: Monthly, Quarterly, and Annual access passes in Nepalese Rupees (NPR).

4. **Nepal Payment Gateways (eSewa & Khalti)**:
   - Official **eSewa EPAY v2** with HMAC-SHA256 signature verification.
   - Official **Khalti ePayment v2** with server-side lookup validation.

---

## 🏗 Repository Layout

The repository is structured into two completely independent, decoupled projects:

```
.
├── backend/                  # NestJS 11 REST API, Prisma ORM, migrations, seed, tests
│   ├── prisma/               # Database schema (PostgreSQL) and seed script
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/                  # NestJS modules (auth, assessment, payment, admin, etc.)
│   │   └── shared/           # API contracts, enums, interfaces
│   ├── test/                 # Integration and unit tests
│   ├── Dockerfile
│   └── package.json
├── frontend/                 # Next.js 15 App Router, React 19, Tailwind CSS
│   ├── src/                  # Pages (13 routes), UI components, styles
│   │   └── shared/           # Domain contracts, enums, interfaces
│   ├── public/               # Public static assets
│   ├── Dockerfile
│   └── package.json
├── docs/                     # Architecture & specifications
└── docker-compose.yml        # PostgreSQL, Redis, MinIO infrastructure
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js**: v20.x or v22+ (v24.x supported)
- **Docker & Docker Compose** (for PostgreSQL, Redis, and MinIO storage)

### 1. Launch Local Infrastructure

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`
- MinIO on `localhost:9000` (Console on `:9001`)

### 2. Backend Team Setup

```bash
cd backend
npm install
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Apply migrations
npm run db:seed        # Seed realistic exam and user data
npm run dev            # Start API server on http://localhost:4000
```

- **Swagger Documentation**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
- **Run Tests**: `npm test`
- **Build**: `npm run build`

### 3. Frontend Team Setup

```bash
cd frontend
npm install
npm run dev            # Start Next.js web application on http://localhost:3000
```

- **Web Application**: [http://localhost:3000](http://localhost:3000)
- **Admin Studio**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Build**: `npm run build`

---

## ⚖️ License

Distributed under the MIT License.
