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
8. `docs/workflows/validation-and-naming.md` で lint/link/naming/commit hook ルールを確認する。
9. `docs/workflows/prd-to-implementation.md` で PRD から実装する流れを確認する。
10. `docs/workflows/development-rules.md` で Frontend/Backend/Database/Container の workstream rule を確認する。
11. `docs/workflows/development-lifecycle.md` で PR 作成、completed 更新、最新情報維持の流れを確認する。
12. `docs/workflows/repository-structure.md` で開発コードとハーネスを同じrepoで管理する配置を確認する。
13. `docs/workflows/context-artifacts.md` で実行context保存ルールを確認する。
14. `docs/skills/index.md` で開発時に必要なrepo-local skillsを確認する。
15. `docs/workflows/task-management.md` で PRD から task.md を同期する流れを確認する。

## Operating Rules

- 人間は意図、優先順位、受け入れ条件を与え、エージェントは実装、検証、レビュー準備を行う。
- 重要な知識はチャットだけに残さず、コード、Markdown、スキーマ、実行可能スクリプトとしてリポジトリへ置く。
- 大きいタスクは `docs/exec-plans/active/` に実行計画を作ってから進める。
- 完了した計画は `docs/exec-plans/completed/` へ移動し、判断ログを残す。
- 境界、品質、コミット形式は好みではなく機械的ルールとして Hook/CI に昇格する。
- 新規依存は必要性、代替案、検証方法を計画または PR 本文に記録する。
- worktree ごとに独立して検証できる状態を保つ。
- `codex exec` などの非対話実行は `artifacts/runs/` に JSONL ログ、最終応答、スクリーンショット保存先を残す。
- PRD 起点の開発は `npm run prd:create` で PRD と active plan を作り、`npm run prd:run` で Codex worktree 実行へ渡す。
- PRD と active plan には Frontend/Backend/Database/Container の workstream と適用ルールを必ず明記する。
- 開発後は `pr:prepare` または `pr:publish` を実行し、`lifecycle:finalize` で active plan を completed に移して PRD の Delivery Status を更新する。
- 開発コードは原則 `apps/`, `packages/`, `infra/`, `tests/` に置き、ハーネスdocsと同じリポジトリで管理する。
- Codex実行時は `artifacts/context/<run-id>/context-summary.md` に短い引き継ぎcontextを残す。
- PRD/planで指定された repo-local skill は実装前に必ず読む。
- Codex実行前、PR準備前、finalize後は `docs/tasks/<slug>.md` を PRD/plan から同期する。

## Verification Contract

- 変更後は最低限 `npm run validate` を実行する。
- UI やランタイムが追加されたら、起動、操作、ログ確認の手順を `docs/` に追加する。
- 既知の未検証事項は PR または実行計画に `Not-tested:` として残す。

## Commit Contract

コミットメッセージは Lore Commit Protocol に従う。
詳細は `docs/workflows/git-and-commits.md` を参照する。
