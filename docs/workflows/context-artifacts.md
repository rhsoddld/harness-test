# Context Artifacts

Raw logs are useful, but Codex also needs compact context that survives handoff.
Each run gets a context directory under `artifacts/context/<run-id>/`.

## Required File

```text
artifacts/context/<run-id>/context-summary.md
```

## What To Capture

- Task summary.
- PRD and execution plan paths.
- Workstreams and skills read.
- Assumptions made.
- Decisions made.
- Commands run.
- Evidence paths.
- Remaining risks and next steps.

## Promotion Rule

If a context item should guide future implementation, move it into the relevant file under `docs/`.
Do not rely on local artifacts for durable project knowledge.
