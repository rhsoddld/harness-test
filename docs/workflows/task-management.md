# Task Management

Every PRD-backed run has a generated task file under `docs/tasks/<slug>.md`.
The task file is the execution-facing summary used before Codex runs, before PR preparation, and after lifecycle finalization.

## Commands

```bash
npm run task:sync -- --slug <slug>
npm run task:sync -- --all
npm run prd:refresh-checks -- --slug <slug>
npm run validate:pre-pr
```

## Rules

- Edit PRD and execution plan first; regenerate task files afterward.
- `prd:create` creates the first task file automatically.
- `prd:run` refreshes acceptance/test sections and syncs the task before Codex starts.
- `pr:prepare` syncs the task before generating PR body.
- `lifecycle:finalize` syncs the task after Delivery Status changes.
- `pre-push` runs `validate:pre-pr`, which checks acceptance criteria, test plans, and task files.

## Required Task Sections

- Source Request
- Workstreams And Skills
- Required Skill Reads
- Acceptance Criteria
- Test Plan
- Evidence Requirements
- Lifecycle
- Not-tested
