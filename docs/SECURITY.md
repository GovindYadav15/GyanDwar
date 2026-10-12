# Security Architecture & Threat Model

## 1. Threat Scenarios & Mitigations

| Threat                              | Impact                                               | Mitigation Strategy                                                                                                                  |
| ----------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Client Timer Manipulation**       | Student extends test duration in browser             | Server records UTC `expiresAt` at start and rejects any submission post-deadline (+ 30s grace).                                      |
| **Answer Key Extraction**           | Inspecting Network tab to find correct MCQ answers   | Active attempt serialization explicitly strips `isCorrect` and `explanationText`.                                                    |
| **Forged Payment Redirect**         | User fakes eSewa redirect URL to activate plan       | Server ignores frontend query params for activation. Server re-calculates HMAC-SHA256 signature and performs server-to-server query. |
| **Replay / Duplicate Payment**      | Same gateway transaction ID submitted twice          | Database uniqueness constraint on `Payment.gatewayTransactionId` within a serialized transaction.                                    |
| **Brute Force Login**               | Password cracking attacks                            | IP and account rate limiting via `ThrottlerGuard` (max 5 failed attempts per 15 mins).                                               |
| **SQL Injection / Mass Assignment** | Data corruption or unauthorized privilege escalation | Prisma parameterized queries + NestJS `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`.                             |
