#!/usr/bin/env bash
set -e

echo "=== Running Quality Assurance & Verification Pipeline ==="

echo "1. Checking formatting..."
pnpm format:check

echo "2. Running ESLint..."
pnpm lint

echo "3. Running Unit and Integration Tests..."
pnpm test

echo "4. Building all packages and applications..."
pnpm build

echo "=== Verification SUCCESSFUL! All quality gates passed. ==="
