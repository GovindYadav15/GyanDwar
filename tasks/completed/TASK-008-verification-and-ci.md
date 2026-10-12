# Task TASK-008: Automated Verification, Unit Tests & CI Pipeline

- **Status**: Completed
- **Assignee**: QA & DevOps Agent
- **Business Objective**: Provide working test suites (scoring, payment signatures, entitlements), verification shell scripts, and CI pipeline checks.
- **Scope**:
  - `tests/integration/platform-integration.spec.ts`
  - `scripts/verify.sh`
  - `scripts/setup.sh`
  - `.github/workflows/ci.yml`
  - Root `verify` script
- **Verification Commands**:
  - `pnpm format:check` -> Exit code 0
  - `pnpm test` -> 7/7 tests passed
  - `pnpm --filter @examsathi/api build` -> Exit code 0
  - `pnpm --filter @examsathi/web build` -> Exit code 0
- **Review Notes & Completion Evidence**:
  - Full end-to-end quality gates verified across all workspace packages and apps.
