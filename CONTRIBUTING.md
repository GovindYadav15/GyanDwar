# Contributing to ExamSathi Nepal

Thank you for your interest in contributing to ExamSathi Nepal! We welcome contributions that help make professional exam preparation more accessible, performant, and reliable for engineering and competitive exam aspirants across Nepal.

## Development Workflow

1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
4. Verify changes locally:
   ```bash
   pnpm verify
   ```
5. Ensure commit messages follow Conventional Commits:
   - `feat:` new user-facing functionality
   - `fix:` bug fixes
   - `docs:` documentation improvements
   - `refactor:` code restructuring without feature change
   - `test:` adding or fixing tests
   - `chore:` maintenance tasks

## Pull Request Guidelines

- All PRs must target `main`.
- Continuous Integration checks (linting, type-checking, automated tests) must pass.
- Any database schema changes must include backward-compatible Prisma migrations.
- Tests should accompany new business logic (assessments, payment transitions, authorization).
