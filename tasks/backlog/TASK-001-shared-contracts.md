# Task TASK-001: Shared Domain Models & Contracts

- **Status**: Ready
- **Assignee**: Architecture Agent
- **Business Objective**: Define shared TypeScript interfaces, enums, DTOs, and validation types so both NestJS and Next.js share a single source of truth.
- **Scope**:
  - `packages/shared/src/enums/`: Roles, ExamCategoryCode, DifficultyLevel, QuestionType, AttemptStatus, PaymentProvider, PaymentStatus, SubscriptionStatus.
  - `packages/shared/src/dtos/`: Auth, Content, Assessment, Payment, Subscription contracts.
- **Verification Commands**:
  - `pnpm --filter @examsathi/shared build`
