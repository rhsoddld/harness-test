# Skill Taxonomy

Skills are repo-local technical playbooks. They tell Codex how to approach implementation once a PRD and active plan identify the workstreams.

## Boundary Definitions

- Skill: technical judgement, stack preference, design tradeoffs, implementation approach.
- Rule: required constraints and done criteria that validation or review can enforce.
- Workflow: process order and repository records that must be updated.

## Always-on Skills

Every implementation should read:

- `testing-quality.md`
- `security-baseline.md`

## Workstream Skills

Read these when the matching PRD workstream is `yes`:

- Frontend: `frontend-modern-stack.md`
- Backend: `backend-api-stack.md`
- Database: `database-postgres-prisma.md`
- Container: `container-delivery.md`

## Skill Update Rule

When a stack decision changes, update the relevant skill and `stack-references.md` in the same PR.
Do not rely on chat context or global Codex skills for project-specific engineering standards.
