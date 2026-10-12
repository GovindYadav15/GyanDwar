# Authentication Architecture

## 1. Overview

The platform uses stateless JSON Web Token (JWT) authentication for API communications between the Next.js frontend and NestJS backend.

## 2. Token Lifecycle

- **Access Token**: Short-lived (default 15 minutes - 1 day), contains `sub` (userId), `email`, and `roles`.
- **Refresh Token**: Long-lived (default 30 days), stored as HTTP-only secure cookie or exchangeable token.
- Passwords are encrypted using `bcrypt` with salt rounds = 12.

## 3. Auth Flow

1. User submits credentials to `POST /api/v1/auth/login`.
2. NestJS validates credentials with `BcryptService`.
3. If valid, JWT is signed using `JWT_SECRET` and returned with user profile metadata.
4. Next.js stores token in memory/secure session cookie and includes `Authorization: Bearer <token>` in subsequent requests.
5. In NestJS, `JwtAuthGuard` extracts token, verifies signature and expiration, and attaches the user payload to `req.user`.
