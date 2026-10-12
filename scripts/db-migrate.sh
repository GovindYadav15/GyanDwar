#!/usr/bin/env bash
set -e
echo "Running Prisma migrations..."
pnpm --filter @examsathi/api db:migrate
