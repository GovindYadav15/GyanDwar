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

3. **Udemy-Style Course Catalog & Multi-Course Access**:
   - Students can select and purchase multiple courses simultaneously.
   - Real-time cart calculation in Nepalese Rupees (NPR).
   - **Offline eSewa Payment Workflow**:
     - Official eSewa ID: `9824803556`
     - Prompt: *"Pay the price and take screenshot of the payment"*
     - Checkout form allows students to upload transfer receipt screenshots and provide transaction codes.
     - Submitted orders appear in the Admin Panel pending verification.
     - Authorized administrators verify the student and payment to activate access to the respective courses.

4. **Role-Based Security & Secure Admin Provisioning**:
   - Exactly two user roles: `STUDENT` and `ADMIN`.
   - Public registration strictly assigns `STUDENT`, preventing privilege escalation.
   - **Secure Initial Admin CLI Bootstrap**: One-time provisioning for `govind803556@gmail.com` with masked password input and atomic state locks.
   - **Cryptographic Admin Invitations**: Authorized administrators invite co-administrators via SHA-256 hashed single-use tokens.

5. **Nepal Payment Gateways (eSewa & Khalti)**:
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
│   ├── scripts/              # Operational CLI commands (admin-bootstrap.ts)
│   ├── src/                  # NestJS modules (auth, assessment, payment, admin, student, etc.)
│   │   └── shared/           # API contracts, enums, interfaces
│   ├── test/                 # Integration and security tests
│   ├── Dockerfile
│   └── package.json
├── frontend/                 # Next.js 15 App Router, React 19, Tailwind CSS
│   ├── src/                  # Pages (14 routes), UI components, styles
│   │   ├── app/courses/buy/  # Udemy-style multi-course checkout & eSewa proof
│   │   ├── app/admin/        # Admin Studio with Student & Payment verification
│   │   └── shared/           # Domain contracts, enums, interfaces
│   ├── public/               # Public static assets
│   ├── Dockerfile
│   └── package.json
├── docs/                     # Architecture, security, and authentication documentation
└── docker-compose.yml        # PostgreSQL, Redis, MinIO infrastructure
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js**: v20.x, v22+, or v24.x
- **PostgreSQL**: PostgreSQL 16+ (Local or cloud managed, e.g. Aiven)
- **Docker & Docker Compose** (optional for local PostgreSQL/Redis/MinIO)

### 1. Backend Setup

```bash
cd backend
npm install
npm run db:generate    # Generate Prisma client
npm run db:push        # Push database schema (or npm run db:migrate)
npm run db:seed        # Seed exam tracks, subjects, chapters, questions
npm run dev            # Start API server on http://localhost:4000
```

- **Swagger Documentation**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
- **Run Tests**: `npm test`
- **Build**: `npm run build`

### 2. Secure Initial Admin Bootstrap

To provision the initial administrator (`govind803556@gmail.com`), execute the operational CLI command:

```bash
cd backend

# Interactive hidden-password prompt:
npm run admin:bootstrap

# Non-interactive operator execution:
npm run admin:bootstrap -- --email govind803556@gmail.com --password YourSecurePassword123! --non-interactive
```

> **Security Note**: This command is strictly one-time. Once completed, a `SystemBootstrap` record is created, and further bootstrap attempts are rejected.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev            # Start Next.js web application on http://localhost:3000
```

- **Student Portal**: [http://localhost:3000](http://localhost:3000)
- **Course Selection & Checkout**: [http://localhost:3000/courses/buy](http://localhost:3000/courses/buy)
- **Admin Studio**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Build Production Bundle**: `npm run build`

---

## 🔒 Verification & Safe Recovery

### Run Verification Suites:
```bash
# Backend test suites (all unit, integration, and security tests)
cd backend && npm test

# Backend compilation check
cd backend && npm run build

# Frontend compilation check
cd frontend && npm run build
```

### Safe Recovery Instructions:
If an operator accidentally loses initial administrator access before inviting other administrators, review the recovery steps in `docs/AUTHENTICATION.md#recovery` or inspect the `SystemBootstrap` and `AuditLog` records directly in the database.

---

## ⚖️ License

Distributed under the MIT License.
