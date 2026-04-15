# Development Lifecycle

開発は PRD 作成で始まり、PR 作成と completion record 更新で終わる。
`codex exec` の実行だけでは完了ではない。

## Lifecycle Commands

1. Create PRD and active plan.

```bash
npm run prd:create -- --slug <slug> --title "<title>" --workstreams frontend --input "<request>"
```

2. Run Codex in a worktree.

```bash
npm run prd:run -- docs/product-specs/<slug>.md
```

3. Prepare PR body for GitHub plugin or CLI.

```bash
npm run pr:prepare -- --slug <slug> --run-dir artifacts/runs/<timestamp>-<slug>
```

4. Publish PR when `origin` and `gh` are available.

```bash
npm run pr:publish -- --slug <slug> --run-dir artifacts/runs/<timestamp>-<slug> --title "<title>"
```

If `gh` is unavailable, `pr:publish` still prepares the PR body and tells you to use the registered GitHub plugin.

5. Finalize after PR is opened or the work is otherwise closed.

```bash
npm run lifecycle:finalize -- --slug <slug> --run-dir artifacts/runs/<timestamp>-<slug> --pr-url <url>
```

## What Finalize Updates

- Moves `docs/exec-plans/active/<slug>.md` to `docs/exec-plans/completed/<slug>.md`.
- Adds `## Completion Record` to the completed plan.
- Adds or updates `## Delivery Status` in `docs/product-specs/<slug>.md`.

## Validation

`npm run validate` checks that:

- Every PRD has a matching active or completed execution plan.
- Every completed plan has `## Completion Record`.
- Every completed plan has a matching PRD with `## Delivery Status`.

This keeps repository knowledge current after development instead of leaving stale active plans behind.
