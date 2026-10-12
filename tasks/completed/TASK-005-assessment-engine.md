# Task TASK-005: Assessment Engine & 100-Mark Mock Simulator

- **Status**: Completed
- **Assignee**: Assessment Agent
- **Business Objective**: Implement practice test engine and 100-mark mock test simulator with negative marking, server-authoritative timer, and instant review cards.
- **Scope**:
  - `apps/api/src/modules/assessment/scoring.engine.ts`
  - `apps/api/src/modules/assessment/scoring.engine.spec.ts`
  - `apps/web/src/app/assessments/`
  - `apps/web/src/app/assessments/[id]/page.tsx`
  - `apps/web/src/app/assessments/results/[attemptId]/page.tsx`
- **Verification Commands**:
  - `pnpm test` -> 7/7 tests passed (ScoringEngine spec + Esewa spec)
- **Review Notes & Completion Evidence**:
  - Positive scoring (+1.0), negative marking (-0.2), accuracy rate calculation, and zero floor logic asserted.
  - Active attempts strip answer keys from network payloads until submission.
