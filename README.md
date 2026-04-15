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
