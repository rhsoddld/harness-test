# Harness Engineering

この方針は OpenAI の Harness Engineering 記事を参考に、このリポジトリ向けに実行可能なルールへ落としたものです。

## Principles

- Map, not manual: `AGENTS.md` は短い地図にし、詳細は `docs/` へ分散する。
- Repo as memory: 判断、仕様、規約、品質状態はリポジトリ内のバージョン管理された成果物に残す。
- Mechanize preferences: 繰り返し守りたい好みは Hook、lint、test、CI に昇格する。
- Worktree isolation: 変更は worktree 単位で独立して起動、検証、破棄できるようにする。
- Short PR loops: PR は小さく保ち、レビュー、修正、検証のループを短くする。
- Garbage collection: 技術的負債やドキュメントの腐敗は定期的に検出し、小さく返済する。

## Repository Knowledge Store

```text
AGENTS.md
ARCHITECTURE.md
docs/
  design-docs/
  exec-plans/
    active/
    completed/
    tech-debt-tracker.md
  generated/
  product-specs/
  references/
  workflows/
  HARNESS_ENGINEERING.md
  PLANS.md
  PRODUCT_SENSE.md
  QUALITY_SCORE.md
  RELIABILITY.md
  SECURITY.md
```

## Promotion Rule

同じレビューコメントや修正指示が2回以上出たら、次のどれかへ昇格する。

1. `docs/` のルールを更新する。
2. `scripts/` の検証へ追加する。
3. Husky hook または CI に追加する。
4. アーキテクチャ境界として `ARCHITECTURE.md` に記録する。

## Agent Readability Checklist

- 新しい概念は置き場所と所有ドキュメントがある。
- 実行コマンドは `package.json` scripts から辿れる。
- 手順はローカル worktree で再現できる。
- 未検証事項は隠さず `Not-tested:` として残る。
- PR では「何をしたか」より「なぜその形にしたか」を記録する。
