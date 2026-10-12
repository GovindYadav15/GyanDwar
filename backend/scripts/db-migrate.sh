#!/usr/bin/env bash
set -e
echo "Running Prisma migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma
