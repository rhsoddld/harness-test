# GitHub Plugin Workflow

GitHub plugin は PR メタデータ、レビューコメント、状態確認の標準入口として使う。

## PR Loop

1. worktree を切る。
2. 変更目的と受け入れ条件を `docs/exec-plans/active/` または PR 本文に記録する。
3. 実装する。
4. `npm run validate` を実行する。
5. Lore commit message で commit する。
6. GitHub plugin で PR を開く、または既存 PR を確認する。
7. レビューコメントは会話だけに閉じず、必要なら docs/hook/test へ昇格する。

## Review Handling

- 指摘は severity と再現手順を確認する。
- 修正後は該当検証を再実行する。
- 仕様判断が変わった場合は `docs/` を更新する。
