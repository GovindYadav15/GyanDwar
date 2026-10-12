# ADR 0002: Server-Authoritative Assessment Timing & Answer Protection

## Context

In competitive mock examinations, students may attempt client clock skewing, devtools inspection, or network interception to gain unfair advantages.

## Decision

- Assessment attempts track `startedAt` and `expiresAt` exclusively on the server in UTC.
- Question payloads returned during active attempts omit `isCorrect` on options and `explanationText` on questions.
- A 30-second latency window is permitted for final submission before auto-expiring.

## Consequences

- Guaranteed assessment integrity.
- Client clock manipulations do not affect scoring or test cutoff times.
