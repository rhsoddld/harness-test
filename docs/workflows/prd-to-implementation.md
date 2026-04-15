# PRD To Implementation

最初の開発内容は、まず PRD と active execution plan に変換してから Codex worktree 実行へ渡す。

## Create PRD From Initial Request

```bash
npm run prd:create -- --slug login-flow --title "Login Flow" --input "ユーザーがメールリンクでログインできるようにしたい"
```

This creates:

- `docs/product-specs/login-flow.md`
- `docs/exec-plans/active/login-flow.md`

## Fill The PRD

`TBD` をできるだけ具体化する。
特に次を埋める。

- User
- Problem
- Goals
- Non-goals
- Functional Requirements
- Agent-verifiable Acceptance Criteria
- Evidence Requirements
- Risks And Open Questions

## Run Codex From PRD

```bash
npm run prd:run -- docs/product-specs/login-flow.md
```

This calls `scripts/codex-worktree-run.mjs`, creates a worktree, runs `codex exec --json`, and saves evidence under `artifacts/runs/`.

## Completion Rule

完了時は以下を確認する。

- PRD acceptance criteria are satisfied.
- `npm run validate` passes.
- Run evidence exists under `artifacts/runs/<timestamp>-<slug>/`.
- UI/visual work has screenshots under `screenshots/`.
- `Not-tested` is honest and specific.
