# Simple Landing Page

## Source Request

シンプルな静的Webサイトを作る。Viteや追加依存は使わず、`index.html`、`styles.css`、`script.js` だけで構成する。
内容は架空の小さなプロダクト `Aster Notes` のランディングページ。
ヒーロー、特徴3つ、使い方3ステップ、CTA、レスポンシブ対応を含める。
UI確認が必要なのでブラウザまたはHTMLを確認し、可能ならスクリーンショットを `artifacts/runs` の `screenshots/` に保存する。
最後に `npm run validate` を通す。

## User

個人のメモや小さなアイデアを整理したいクリエイター、学生、個人開発者。

## Problem

既存のノートアプリは情報量が多く、最初の価値が伝わるまでに時間がかかる。
訪問者が数秒で「何のサービスか」「何が便利か」「次に何をすればいいか」を理解できるページが必要。

## Goals

- 1ページの静的ランディングページを作る。
- 追加依存なしでブラウザから直接開ける構成にする。
- ヒーロー、特徴、使い方、CTA が視覚的に分かるようにする。
- モバイル幅でも崩れないレスポンシブ layout にする。
- 実行ログと、可能ならスクリーンショットを artifacts に残す。

## Non-goals

- バックエンド実装はしない。
- フォーム送信や認証は実装しない。
- npm dependency や build tool は追加しない。
- 本物のブランド素材や外部画像は使わない。

## User Journey

1. ユーザーが `index.html` を開く。
2. ヒーローで `Aster Notes` の価値を理解する。
3. 3つの特徴を読む。
4. 3ステップの使い方を見る。
5. CTA ボタンを押すと、ページ内のメッセージが変わるなど軽い反応がある。

## Functional Requirements

- `index.html` を作成する。
- `styles.css` を作成する。
- `script.js` を作成する。
- ページタイトルに `Aster Notes` を含める。
- ヒーローセクションを含める。
- 特徴カードを3つ含める。
- 使い方ステップを3つ含める。
- CTA ボタンを含める。
- CTA ボタン押下時に JavaScript で小さな状態変化を起こす。
- 画面幅 375px 程度でも読める layout にする。
- 外部 CDN、外部 font、外部画像に依存しない。

## Agent-verifiable Acceptance Criteria

- [ ] `index.html`, `styles.css`, `script.js` が存在する。
- [ ] `index.html` が `styles.css` と `script.js` を参照している。
- [ ] `rg "Aster Notes" index.html` でプロダクト名が確認できる。
- [ ] `rg "feature|Feature|特徴" index.html styles.css` または同等の構造で特徴セクションが確認できる。
- [ ] `rg "step|Step|ステップ" index.html styles.css` または同等の構造で使い方セクションが確認できる。
- [ ] `npm run validate` が成功する。
- [ ] UI/visual 確認を行った場合、スクリーンショットが run artifact の `screenshots/` に保存される。

## Evidence Requirements

- `codex-events.jsonl` saved under the run artifact directory.
- `codex-final.md` saved under the run artifact directory.
- Validation logs saved under `notes/` when commands are run.
- Screenshots saved under `screenshots/` when browser or visual inspection is performed.

## Risks And Open Questions

- Browser automation or screenshot capture may be unavailable in a headless environment; if so, record that under `Not-tested`.
- Since no build tool is used, verification is limited to static inspection and browser/manual visual checks.

## Created

2026-04-15
