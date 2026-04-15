# Context Summary Template

Each Codex run should maintain `artifacts/context/<run-id>/context-summary.md` using this shape.

```md
# <run-id> Context

## Task

## PRD And Plan

## Workstreams

## Skills Read

## Commands Run

## Evidence

## Decisions

## Assumptions

## Not-tested

## Next Steps
```

## Rules

- `Skills Read` must list repo-local skill and rule files actually used.
- `Commands Run` must include validation and task-specific checks.
- `Evidence` must include paths to run logs, notes, screenshots, or PR handoff material.
- `Not-tested` must be explicit; write `None` only when that is true.
- Durable decisions must be promoted into `docs/`, not left only in local artifacts.
