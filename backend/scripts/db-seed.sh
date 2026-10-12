#!/usr/bin/env bash
set -e
echo "Running database seed..."
npx ts-node prisma/seed.ts
