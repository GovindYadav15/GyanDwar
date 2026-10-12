# System Architecture & Technical Design

## 1. High-Level Architecture Diagram

```
                 +---------------------------------------------+
                 |       Web Client (frontend/ - Next.js 15)   |
                 |  - Server Components (RSC) by default       |
                 |  - TanStack Query client for live assessments|
                 |  - Modular Tailwind CSS (tokens/components) |
                 |  - MCQ Markdown Studio & PDF Multi-Viewer   |
                 +----------------------+----------------------+
                                        |
                             HTTPS / JSON REST API
                                        |
                 +----------------------v----------------------+
                 |       API Server (backend/ - NestJS 11)     |
                 |  - Global ValidationPipe & DTO Sanitization |
                 |  - Global ExceptionFilter & Logger          |
                 |  - JWT AuthGuard & RBAC RolesGuard          |
                 |  - Entitlement & Subscription Interceptors  |
                 +----+---------------+-----------------+------+
                      |               |                 |
          +-----------v----+   +------v------+   +------v-------------+
          | Auth & Users   |   | Assessment  |   | Payment Adapters   |
          | - Password Hash|   | - Blueprint |   | - eSewa EPAY v2    |
          | - JWT Tokens   |   | - Scoring   |   | - Khalti v2 API    |
          | - Audit Logger |   | - Timing    |   | - Idempotency Lock |
          +-----------+----+   +------+------+   +------+-------------+
                      |               |                 |
                      +---------------+-----------------+
                                      |
                           Prisma ORM (Data Layer)
                                      |
                     +----------------v---------------+
                     |      PostgreSQL 16 Engine      |
                     |  - Normalized Multi-Category   |
                     |  - Assessment Attempt History  |
                     |  - Orders & Payment Events     |
                     +--------------------------------+
```

---

## 2. Core Modules in NestJS (`backend/src/modules/`)

1. **`auth/`**: Registration, login, password hashing (bcrypt), JWT generation, refresh tokens, and active user context.
2. **`content/`**: Hierarchical content trees (Categories, Faculties, Subjects, Chapters, Sub-Chapters, PDF Notes).
3. **`assessment/`**:
   - Question authoring, options, and explanations.
   - Markdown MCQ import parsing and validation.
   - Blueprint configuration: dynamic selection of questions matching difficulty and chapter weights.
   - Attempt management: stateful attempt sessions (`IN_PROGRESS`, `SUBMITTED`, `EXPIRED`, `ABANDONED`).
   - Scoring engine: authoritative server evaluation with negative marking.
4. **`payment/`**:
   - `PaymentGateway` interface:
     - `initiatePayment(order: Order): Promise<PaymentInitiationResult>`
     - `verifyPayment(payload: PaymentVerificationDto): Promise<PaymentVerificationResult>`
   - `EsewaGatewayAdapter` and `KhaltiGatewayAdapter`.
   - `PaymentService`: Idempotent state transitions and audit logging.
5. **`subscription/`**:
   - Plan tier catalog (Monthly, Quarterly, Annual).
   - Subscription lifecycle (`PENDING`, `ACTIVE`, `EXPIRED`, `CANCELLED`).
   - Entitlement checker evaluating user access permissions against content.
6. **`student/`**:
   - Aggregated dashboard statistics: tests attempted, average score, subject mastery percentages, weak areas.
7. **`admin/`**:
   - CRUD management across curriculum, chapters, sub-chapters, PDF attachments.
   - MCQ authoring & Markdown batch import studio.
   - Manual payment verification to unlock courses for students.
8. **`health/`**:
   - Liveness (`/health/liveness`) and readiness (`/health/readiness`) checks.

---

## 3. Frontend Architecture (`frontend/src/`)

- **App Router Layout**:
  - `(public)`: Marketing landing page, exam category exploration, pricing plans, syllabus previews.
  - `(auth)`: Login and registration flows.
  - `(student)`: Protected student dashboard, notes reader with PDF viewer, practice simulator, mock exam room, results review.
  - `(admin)`: Content manager, sub-chapter manager, Markdown MCQ import studio, payment verification workbench.
- **State Management**:
  - React Server Components (RSC) for zero-JS initial payload and SEO.
  - TanStack Query for dynamic client-side assessment sessions and synchronized test clock.
- **CSS Architecture**:
  - Colors: `#0e2148` (Slate Navy), `#483aa0` (Royal Indigo), `#7965c1` (Soft Violet), `#e3d095` (Parchment Gold).
  - Separation of concerns: Tokens in `src/styles/tokens.css`, component classes in `src/styles/components.css`, utilities in `src/styles/utilities.css`.

---

## 4. Decoupled Structure & Independent Teams

The repository is organized into two independent sub-projects to maximize developer velocity:

1. **`backend/`**:
   - Contains NestJS 11, Prisma ORM, migrations, seed, tests, and its own `package.json`.
   - `tsconfig.json` maintains `"rootDir": "./src"` and emits directly to `dist/main.js`.
   - Shared contracts reside in `backend/src/shared` and are mapped to `@examsathi/shared`.
2. **`frontend/`**:
   - Contains Next.js 15, Tailwind CSS, Lucide icons, and its own `package.json`.
   - Shared contracts reside in `frontend/src/shared` and are mapped to `@examsathi/shared`.
   - No monorepo workspace dependencies or build linking needed.
