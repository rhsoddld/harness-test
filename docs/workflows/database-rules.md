# Database Rules

- Document schema changes before implementation.
- Include migration, rollback, and seed strategy when a database is involved.
- Avoid destructive migrations unless explicitly approved.
- Verify schema changes with a local migration or equivalent dry check.
- Keep generated or local database files out of source history unless intentionally versioned.
