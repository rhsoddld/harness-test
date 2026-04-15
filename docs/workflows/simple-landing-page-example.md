# Simple Landing Page Example

この例は、PRD ファイルを事前に置かず、PRD 作成から Codex worktree 実行までを試すためのコピー用レシピ。

## Copy And Run

```bash
cd /Users/lee/Desktop/harness-test

npm run prd:create -- \
  --slug simple-landing-page \
  --title "Simple Landing Page" \
  --workstreams frontend \
  --input "シンプルな静的Webサイトを作る。Viteや追加依存は使わず、index.html、styles.css、script.js だけで構成する。内容は架空の小さなプロダクト 'Aster Notes' のランディングページ。ヒーロー、特徴3つ、使い方3ステップ、CTA、レスポンシブ対応を含める。Frontend は yes。Backend、Database、Container は no。UI確認が必要なのでブラウザまたはHTMLを確認し、可能ならスクリーンショットを artifacts/runs の screenshots に保存する。最後に npm run validate を通す。"

npm run prd:run -- docs/product-specs/simple-landing-page.md
```

## Expected Source Files

Codex should create these in the implementation worktree:

- `index.html`
- `styles.css`
- `script.js`

## Expected Evidence

The parent repository should receive run artifacts under:

```text
artifacts/runs/<timestamp>-simple-landing-page/
  codex-events.jsonl
  codex-final.md
  run-summary.json
  notes/
  screenshots/
```
