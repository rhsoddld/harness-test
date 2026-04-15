# Database Rules

Database work must be reversible, reviewable, and tied to a clear data lifecycle.
These rules apply whenever the PRD marks `Database` as `yes`.

## Required Reads

- `docs/skills/database-postgres-prisma.md`
- `docs/skills/testing-quality.md`
- `docs/skills/security-baseline.md`
- `docs/workflows/evidence-artifacts.md`
- `docs/workflows/context-artifacts.md`

## Schema Design

- Document the entity, ownership, lifecycle, and retention expectations before implementation.
- Prefer explicit constraints over application-only assumptions.
- Name tables, columns, indexes, and relations consistently with existing conventions.
- Avoid nullable fields unless the PRD explains the missing/unknown state.
- Record cardinality and uniqueness requirements.

## Migrations

- Include migration, rollback, and seed strategy when schema changes are introduced.
- Never run destructive migrations without explicit approval.
- For destructive or backfill-heavy changes, plan expand/migrate/contract steps.
- Keep generated or local database state out of source history unless intentionally versioned.
- Do not mix unrelated schema changes in the same migration.

## Data Access

- Keep persistence models from leaking into unrelated UI or transport layers.
- Validate tenant/user ownership server-side before reads and writes.
- Avoid N+1 query patterns when listing related data.
- Prefer transactions for multi-write invariants.
- Document consistency expectations for background jobs, caches, or eventual consistency.

## Seeds And Test Data

- Seeds must be deterministic and safe to re-run.
- Test data should not resemble real secrets or real personal data.
- Keep local-only fixtures clearly separated from production migration assets.

## Verification

Minimum checks for database work:

- `npm run validate`
- Migration generation or dry-run evidence when tooling exists.
- Schema diff or migration summary saved to notes.
- Seed/rollback notes for new persistent data structures.
- Context summary updated with schema decisions, commands, evidence paths, and gaps.

## Evidence To Save

Save evidence under the current run artifact directory:

- Migration output: `notes/`
- Schema diff or generated SQL summary: `notes/`
- Compact handoff summary: `artifacts/context/<run-id>/context-summary.md`

If a database cannot be run locally, record why under `Not-tested` and provide static migration/schema evidence.

## Done Criteria

Database work is not done until:

- Schema intent and lifecycle are documented.
- Migration and rollback strategy are recorded.
- Verification evidence exists or a clear `Not-tested` gap is recorded.
- `npm run validate` passed.
