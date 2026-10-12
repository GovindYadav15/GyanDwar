# Environment Configuration Guide

## Required Variables

| Variable              | Scope | Purpose                        | Example                 |
| --------------------- | ----- | ------------------------------ | ----------------------- |
| `PORT`                | API   | HTTP Server Port               | `4000`                  |
| `DATABASE_URL`        | API   | PostgreSQL Connection String   | `postgresql://...`      |
| `JWT_SECRET`          | API   | Secret for signing auth tokens | Min 32 chars            |
| `ESEWA_MERCHANT_CODE` | API   | eSewa merchant identifier      | `EPAYTEST`              |
| `ESEWA_SECRET_KEY`    | API   | eSewa HMAC key                 | Sandbox secret          |
| `KHALTI_SECRET_KEY`   | API   | Khalti Live/Sandbox secret     | `test_secret_key_...`   |
| `NEXT_PUBLIC_API_URL` | Web   | Base URL for API requests      | `http://localhost:4000` |
