# Deployment Architecture

## 1. Production Topology

- **Frontend**: Next.js deployed on Node.js container or Vercel edge/serverless.
- **Backend API**: NestJS container deployed on ECS, Kubernetes, or Render/Railway behind an Application Load Balancer.
- **Database**: Managed PostgreSQL (e.g. AWS RDS or Supabase) with read replica.
- **Object Storage**: S3 or Cloudflare R2 for notes and uploaded materials.

## 2. Docker Build Strategy

Multi-stage Dockerfiles for both `apps/web` and `apps/api`:

1. **Builder Stage**: Installs dependencies and builds TypeScript artifacts.
2. **Runner Stage**: Minimal alpine image containing only production dependencies and compiled outputs.
