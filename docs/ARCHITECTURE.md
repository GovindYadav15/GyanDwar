# System Architecture & Technical Design

## 1. High-Level Architecture Diagram

```
                 +---------------------------------------------+
                 |       Web Client (Next.js 15 App Router)   |
                 |  - Server Components (RSC) by default       |
                 |  - TanStack Query client for live assessments|
                 |  - Modular Tailwind CSS (tokens/components) |
                 +----------------------+----------------------+
                                        |
                             HTTPS / JSON REST API
                                        |
                 +----------------------v----------------------+
                 |          API Server (NestJS 11)             |
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

## 2. Core Modules in NestJS (`apps/api/src/modules/`)

1. **`auth/`**: Registration, login, password hashing (bcrypt), JWT generation, refresh tokens, and active user context.
2. **`content/`**: Hierarchical content trees (Categories, Faculties, Subjects, Chapters, Notes).
3. **`assessment/`**:
   - Question authoring, options, and explanations.
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
   - CRUD management across curriculum, question bank, order adjustments, and audit log exploration.
8. **`health/`**:
   - Liveness (`/health/liveness`) and readiness (`/health/readiness`) checks.

---

## 3. Frontend Architecture (`apps/web/src/`)

- **App Router Layout**:
  - `(public)`: Marketing landing page, exam category exploration, pricing plans, syllabus previews.
  - `(auth)`: Login and registration flows.
  - `(student)`: Protected student dashboard, notes reader, practice simulator, mock exam room, results review.
  - `(admin)`: Content manager, question authoring workbench, order audit table.
- **State Management**:
  - React Server Components (RSC) for zero-JS initial payload and SEO.
  - TanStack Query for dynamic client-side assessment sessions and synchronized test clock.
- **CSS Architecture**:
  - Colors: `#0e2148` (Slate Navy), `#483aa0` (Royal Indigo), `#7965c1` (Soft Violet), `#e3d095` (Parchment Gold).
  - Separation of concerns: Tokens in `src/styles/tokens.css`, component classes in `src/styles/components.css`, utilities in `src/styles/utilities.css`.
