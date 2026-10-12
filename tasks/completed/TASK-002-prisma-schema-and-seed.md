# Task TASK-002: Prisma Schema & Multi-Tier Seed Data

- **Status**: Completed
- **Assignee**: Database Agent
- **Business Objective**: Implement PostgreSQL relational schema supporting dynamic educational hierarchy (NEC, Lok Sewa, Diploma), questions, attempts, subscriptions, and realistic demonstration seed data.
- **Scope**:
  - `prisma/schema.prisma`
  - `prisma/seed.ts`
- **Verification Commands**:
  - `pnpm exec prisma generate --schema=./prisma/schema.prisma` -> Code 0
- **Review Notes & Completion Evidence**:
  - Prisma client generated successfully without validation errors.
  - Entities modeled: `User`, `Role`, `UserRole`, `ExamCategory`, `Faculty`, `ExamTrack`, `Subject`, `Chapter`, `LearningResource`, `Question`, `AnswerOption`, `Assessment`, `AssessmentQuestion`, `AssessmentAttempt`, `AttemptResponse`, `SubscriptionPlan`, `PlanEntitlement`, `Subscription`, `Order`, `Payment`, `PaymentEvent`, `AuditLog`.
  - Rich demonstration seed script provided covering NEC civil mock test, Lok Sewa technical units, and multi-tier pricing plans.
