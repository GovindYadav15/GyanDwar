# Task TASK-001: Shared Domain Models & Contracts

- **Status**: Completed
- **Assignee**: Architecture Agent
- **Business Objective**: Define shared TypeScript interfaces, enums, DTOs, and validation types so both NestJS and Next.js share a single source of truth.
- **Scope**:
  - `packages/shared/src/enums/`: Roles, ExamCategoryCode, DifficultyLevel, QuestionType, AttemptStatus, PaymentGateway, PaymentStatus, SubscriptionStatus, ResourceType.
  - `packages/shared/src/interfaces/`: User, ExamCategory, Faculty, Subject, Chapter, LearningResource, Question, Assessment, Attempt, Results, Subscription, Order, Payment.
- **Verification Commands**:
  - `pnpm --filter @examsathi/shared build` -> Exit code 0
- **Review Notes & Completion Evidence**:
  - Successfully compiled via strict TypeScript `tsc` without errors.
  - Provides common types for frontend client consumption and backend service implementations.
