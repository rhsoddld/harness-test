# Workflow Index

Workflows define when to do work, which repository records to update, and what evidence closes the loop.
They are process maps, not implementation skill packs.

## Categories

### Intake And Planning

- `prd-to-implementation.md`: create PRDs and active execution plans from initial requests.
- `development-rules.md`: require workstream routing and repo-local rule packs.
- `repository-structure.md`: place app, package, infra, tests, docs, and artifacts in one repository.

### Execution

- `codex-exec-worktree.md`: run Codex in isolated Git worktrees.
- `worktree.md`: manual Git worktree conventions.
- `context-artifacts.md`: save compact handoff context.
- `evidence-artifacts.md`: save raw execution evidence.

### Delivery Lifecycle

- `development-lifecycle.md`: prepare PRs, publish when possible, finalize completed work.
- `github-plugin.md`: GitHub plugin handoff and review handling.
- `git-and-commits.md`: Lore commit protocol.

### Validation

- `validation-and-naming.md`: local validation, links, naming, and hook behavior.

### Workstream Rules

- `frontend-rules.md`: constraints and done criteria for frontend work.
- `backend-rules.md`: constraints and done criteria for backend/API work.
- `database-rules.md`: constraints and done criteria for database work.
- `container-rules.md`: constraints and done criteria for container/runtime work.

### Examples

- `simple-landing-page-example.md`: copyable PRD-first static website trial.

## Boundary With Skills

- Workflow: sequence, ownership, records, evidence, lifecycle.
- Skill: technical playbook, stack preference, implementation judgement.
- Rule: non-negotiable constraints, verification, and done criteria.

If a file starts prescribing implementation technique, it probably belongs in `docs/skills/`.
If a file starts prescribing lifecycle order or repository updates, it belongs in `docs/workflows/`.
