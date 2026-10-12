FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@10.29.2

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @examsathi/shared build
RUN pnpm --filter @examsathi/api exec prisma generate --schema=./prisma/schema.prisma
RUN pnpm --filter @examsathi/api build

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g pnpm@10.29.2

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

EXPOSE 4000

CMD ["node", "apps/api/dist/main.js"]
