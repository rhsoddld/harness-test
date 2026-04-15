# Database Postgres Prisma Skill

Default when the Database workstream applies.

## Stack Preference

- PostgreSQL for relational app data.
- Prisma ORM 6 for schema and client generation when ORM is appropriate.
- Migration files, seed strategy, and rollback notes committed with schema changes.

## Rules

- Read `docs/workflows/database-rules.md` before implementation.
- Never run destructive migrations without explicit approval.
- Document schema ownership and data lifecycle.
- Keep local database files and generated state out of source history unless intentionally versioned.

## Evidence

- Migration dry run or local migration output.
- Schema diff summary.
- Seed/rollback notes.

## References

See `docs/skills/stack-references.md` before Prisma, Node, or database runtime changes.
