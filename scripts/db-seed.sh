#!/usr/bin/env bash
set -e
echo "Seeding database with realistic exam preparation data..."
pnpm --filter @examsathi/api db:seed
