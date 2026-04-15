# Evidence Artifacts

エージェント実行は、あとから人間や別エージェントが確認できる証跡を残す。
実行ログ、最終レポート、スクリーンショット、追加メモを run 単位で保存する。

## Directory Layout

```text
artifacts/
  runs/
    <timestamp>-<slug>/
      codex-events.jsonl
      codex-final.md
      run-summary.json
      screenshots/
      notes/
```

## What To Save

- `codex-events.jsonl`: `codex exec --json` のイベントログ。
- `codex-final.md`: Codex の最終応答。
- `run-summary.json`: worktree path、branch、base ref、prompt、exit code。
- `screenshots/`: UI やブラウザ検証で取得した画像。
- `notes/`: 再現手順、手動確認、追加ログの抜粋。

## Screenshot Rule

UI、ブラウザ、視覚差分、または手順説明に画面状態が関係する場合は、最低1枚のスクリーンショットを保存する。
保存先は run ごとの `screenshots/` にする。

## Retention Rule

- `artifacts/runs/` はローカル証跡として `.gitignore` する。
- PR に必要な証跡は、画像そのものではなく要約、コマンド、保存パス、重要な抜粋を PR 本文に記載する。
- 永続化すべき仕様や判断は `docs/` に昇格する。
