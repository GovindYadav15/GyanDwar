#!/usr/bin/env bash
set -e

echo "=== Initializing ExamSathi Nepal Development Environment ==="
if [ ! -f .env ]; then
  echo "Copying .env.example to .env..."
  cp .env.example .env
fi

echo "Installing workspace dependencies..."
pnpm install

echo "Starting local docker containers (Postgres, Redis, MinIO)..."
docker-compose up -d

echo "Generating Prisma Client..."
pnpm db:generate

echo "Environment ready! Run 'pnpm dev' to launch web and api."
