# Tasks

`docs/tasks/<slug>.md` is the execution-facing task file generated from the PRD and active/completed plan.

Use:

```bash
npm run task:sync -- --slug <slug>
```

Task files should be updated before `prd:run`, before PR preparation, and after lifecycle finalization if delivery status changes.
