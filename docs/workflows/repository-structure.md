# Repository Structure

Harness docs, product code, infrastructure, tests, execution evidence, and context live in the same repository.
This keeps PRD, code, verification, and delivery lifecycle together.

## Layout

```text
apps/
  web/
packages/
  ui/
  config/
infra/
  container/
  database/
tests/
  e2e/
docs/
  product-specs/
  exec-plans/
  skills/
  workflows/
artifacts/
  runs/
  context/
  pr/
```

## Rules

- App code goes under `apps/` unless the PRD explicitly requests a root-level static smoke test.
- Shared libraries go under `packages/`.
- Container and database assets go under `infra/`.
- Cross-app tests go under `tests/`.
- Raw execution logs go under `artifacts/runs/`.
- Compact execution context goes under `artifacts/context/`.
- PR handoff material goes under `artifacts/pr/`.

`artifacts/` is local evidence and normally ignored by Git. Durable decisions must be promoted into `docs/`.
