# Backup & Disaster Recovery Procedures

## 1. Database Backup Strategy

- Automated daily `pg_dump` snapshots retention for 30 days.
- Point-in-time recovery (WAL archiving) enabled on production PostgreSQL.

## 2. Restoration Verification

Periodic test restores into staging to verify schema, table integrity, and foreign key relationships.
