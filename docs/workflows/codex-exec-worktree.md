# Codex Exec Worktree Workflow

Codex だけを使い、Git worktree を切って `codex exec` で非対話実行するための標準フロー。

## One-command Trial

```bash
node scripts/codex-worktree-run.mjs --slug docs-smoke --task "AGENTS.md と docs を読み、npm run validate を実行して結果を artifacts に記録して"
```

## What The Script Does

1. Git repository root を確認する。
2. sibling directory に worktree を作る。
3. `artifacts/runs/<timestamp>-<slug>/` を作る。
4. `codex exec --json` を worktree 内で実行する。
5. JSONL 実行ログを `codex-events.jsonl` に保存する。
6. 最終応答を `codex-final.md` に保存する。
7. worktree、branch、exit code などを `run-summary.json` に保存する。

## Agent Contract Passed To Codex

実行される Codex には次を明示する。

- 変更前に `AGENTS.md` と関連 docs を読む。
- 検証コマンドを実行する。
- UI/ブラウザ作業がある場合は `screenshots/` にスクリーンショットを保存する。
- 実行ログや証跡は `CODEX_HARNESS_ARTIFACT_DIR` に置く。
- 完了時に、変更、検証、保存した証跡、未検証事項を報告する。

## Cleanup

```bash
git worktree list
git worktree remove <worktree-path>
git branch -d agent/<slug>
```

## Notes

- このスクリプトは既存 worktree や branch を強制削除しない。
- Git repository ではない場所では実行できない。
- `artifacts/runs/` はローカル証跡で、通常は commit しない。
