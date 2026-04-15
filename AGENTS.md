# Harness Engineering Agent Map

このリポジトリは、Codex/エージェントが安全に並列作業し、GitHub PR まで進めるためのハーネスを先に整える。
`AGENTS.md` は百科事典ではなく目次として扱い、詳細な判断材料は `docs/` 配下の記録システムへ置く。

## First Read

1. `README.md` で目的とセットアップを確認する。
2. `ARCHITECTURE.md` で境界と依存方向を確認する。
3. `docs/HARNESS_ENGINEERING.md` でエージェント運用原則を確認する。
4. `docs/workflows/worktree.md` で worktree 運用を確認する。
5. `docs/workflows/github-plugin.md` で GitHub plugin 前提の PR フローを確認する。
6. `docs/workflows/evidence-artifacts.md` で実行ログとスクリーンショット証跡の保存ルールを確認する。
7. `docs/workflows/codex-exec-worktree.md` で Codex Exec + worktree の試験フローを確認する。

## Operating Rules

- 人間は意図、優先順位、受け入れ条件を与え、エージェントは実装、検証、レビュー準備を行う。
- 重要な知識はチャットだけに残さず、コード、Markdown、スキーマ、実行可能スクリプトとしてリポジトリへ置く。
- 大きいタスクは `docs/exec-plans/active/` に実行計画を作ってから進める。
- 完了した計画は `docs/exec-plans/completed/` へ移動し、判断ログを残す。
- 境界、品質、コミット形式は好みではなく機械的ルールとして Hook/CI に昇格する。
- 新規依存は必要性、代替案、検証方法を計画または PR 本文に記録する。
- worktree ごとに独立して検証できる状態を保つ。
- `codex exec` などの非対話実行は `artifacts/runs/` に JSONL ログ、最終応答、スクリーンショット保存先を残す。

## Verification Contract

- 変更後は最低限 `npm run validate` を実行する。
- UI やランタイムが追加されたら、起動、操作、ログ確認の手順を `docs/` に追加する。
- 既知の未検証事項は PR または実行計画に `Not-tested:` として残す。

## Commit Contract

コミットメッセージは Lore Commit Protocol に従う。
詳細は `docs/workflows/git-and-commits.md` を参照する。
