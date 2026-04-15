# Harness Test

Codex/エージェントが worktree 単位で実装、検証、レビュー、PR 作成まで進められるようにするためのハーネス用リポジトリです。

## Quick Start

```bash
npm install
npm run prepare
npm run validate
```

## Core Ideas

- `AGENTS.md` は短い地図にする。
- 詳細なルール、仕様、意思決定、品質状態は `docs/` に置く。
- Hook と検証スクリプトで、エージェントが守るべき不変条件を機械的に確認する。
- GitHub plugin と Git worktree を前提に、PR 単位で短く反復する。
- `codex exec --json` の実行ログとスクリーンショット証跡を run 単位で保存する。

## Main Documents

- `AGENTS.md`: エージェント向け入口。
- `ARCHITECTURE.md`: 境界、依存方向、将来のコード配置。
- `docs/HARNESS_ENGINEERING.md`: ハーネスエンジニアリング方針。
- `docs/workflows/worktree.md`: worktree 作業ルール。
- `docs/workflows/github-plugin.md`: GitHub plugin を使う PR ルール。
- `docs/workflows/git-and-commits.md`: Lore commit protocol。
- `docs/workflows/evidence-artifacts.md`: 実行ログとスクリーンショット証跡。
- `docs/workflows/codex-exec-worktree.md`: Codex Exec + worktree 試験フロー。
- `docs/workflows/validation-and-naming.md`: lint/link/naming/commit hook ルール。
- `docs/workflows/prd-to-implementation.md`: PRD 生成から Codex 実行までの流れ。
- `docs/workflows/development-rules.md`: Frontend/Backend/Database/Container の workstream rule。
- `docs/workflows/simple-landing-page-example.md`: PRD 作成から始めるコピー用Webサイト例。
- `docs/workflows/development-lifecycle.md`: PR 作成、completed 更新、PRD 最新化の流れ。
- `docs/workflows/task-management.md`: PRDからtask.mdを生成/同期する流れ。
- `docs/workflows/repository-structure.md`: 開発コードとハーネスを同じrepoで管理する配置。
- `docs/workflows/context-artifacts.md`: 実行context保存ルール。
- `docs/skills/index.md`: repo-local skill pack。

## PRD Driven Trial

Create a PRD and execution plan from an initial request:

```bash
npm run prd:create -- --slug first-feature --title "First Feature" --workstreams frontend --input "最初に作りたい内容を書く"
```

Run Codex in a worktree from that PRD:

```bash
npm run prd:run -- docs/product-specs/first-feature.md
```

## Validation

`npm run validate` checks required docs, local Markdown links, naming rules, PRD workstream sections, lifecycle completion records, and is also run by Husky before commit. Commit messages are checked by the Husky `commit-msg` hook.
