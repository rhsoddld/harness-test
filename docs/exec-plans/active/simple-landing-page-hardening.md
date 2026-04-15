# Simple Landing Page Hardening

## Goal

Implement the PRD in ../../product-specs/simple-landing-page-hardening.md.

## Acceptance Criteria

- [ ] All checked PRD acceptance criteria are satisfied.
- [ ] `npm run validate` passes.
- [ ] Evidence artifacts are saved for the implementation run.

## Workstream Plan

### Frontend

Applies: yes

Read `docs/skills/frontend-modern-stack.md` and `docs/workflows/frontend-rules.md`. Implement UI only if this workstream applies.
### Backend

Applies: no

Read `docs/skills/backend-api-stack.md` and `docs/workflows/backend-rules.md`. Define API contracts only if this workstream applies.
### Database

Applies: no

Read `docs/skills/database-postgres-prisma.md` and `docs/workflows/database-rules.md`. Define schema/migration work only if this workstream applies.
### Container

Applies: no

Read `docs/skills/container-delivery.md` and `docs/workflows/container-rules.md`. Define image/runtime work only if this workstream applies.

## Required Skill Reads

- `docs/skills/index.md`
- `docs/skills/testing-quality.md`
- `docs/skills/security-baseline.md`
- Workstream-specific skill files listed above when Applies is yes.

## Constraints

- Keep changes small and reviewable.
- Do not add dependencies unless the PRD or implementation notes justify them.
- Preserve the repository naming, link, docs, and commit hook rules.

## Steps

1. Read `AGENTS.md` and the PRD.
2. Convert TBD fields into concrete assumptions or ask only if materially blocked.
3. Implement the smallest working slice.
4. Run validation.
5. Save run evidence.
6. Prepare a Lore commit or PR summary.

## Verification

- `npm run validate`
- Additional task-specific checks from the PRD.

## Decision Log

- 2026-04-15: Created from initial request via `scripts/create-prd.mjs`.

## Not-tested

- To be filled during implementation.
