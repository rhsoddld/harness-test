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






3周目: 修正タスクシナリオ
今回の3周目は、既存の Aster Notes ランディングページに対する hardening / QA fix pass として回します。

目的:

既存ページを読み直す
accessibility / responsive / CTA / focus state / evidence不足を修正
PRDから task.md を生成/同期
Acceptance Criteria / Test Plan を明示
Codex実行
PR body作成
GitHubにPR作成
0. 現在状態を整える
まず、今あるPRD/task系を同期しておきます。

cd /Users/lee/Desktop/harness-test

npm run prd:refresh-checks -- --all
npm run task:sync -- --all
npm run validate:pre-pr

git status --short
もしここで既存の simple-landing-page / simple-landing-page-polish のPRDやtaskが出ても、それは過去2周分の記録です。
3周目は別slugで作ります。

1. 3周目PRDを作る
cd /Users/lee/Desktop/harness-test

npm run prd:create -- \
  --slug simple-landing-page-hardening \
  --title "Simple Landing Page Hardening" \
  --workstreams frontend \
  --input "既存の Aster Notes 静的ランディングページを3周目として品質改善する。対象は現在の main にある apps/web/index.html、apps/web/styles.css、apps/web/script.js。Frontend は yes。Backend、Database、Container は no。改善内容は、アクセシビリティ、キーボードフォーカス、CTA interaction、375pxモバイル表示、デスクトップ表示、不要な視覚ノイズの削減、証跡不足の補完。新しい依存は追加しない。実装前に docs/skills/frontend-modern-stack.md、docs/workflows/frontend-rules.md、docs/skills/testing-quality.md、docs/skills/security-baseline.md を読む。context-summary.md には Skills Read、Commands Run、Evidence、Decisions、Assumptions、Not-tested、Next Steps を埋める。最後に npm run validate と静的DOM確認を実行し、可能ならスクリーンショットを artifacts/runs の screenshots に保存する。"

npm run validate
この時点で以下ができます。

docs/product-specs/simple-landing-page-hardening.md
docs/exec-plans/active/simple-landing-page-hardening.md
docs/tasks/simple-landing-page-hardening.md
確認:

sed -n '1,260p' docs/product-specs/simple-landing-page-hardening.md
sed -n '1,260p' docs/exec-plans/active/simple-landing-page-hardening.md
sed -n '1,260p' docs/tasks/simple-landing-page-hardening.md
2. PRDのAcceptance/Test/Taskを明示的に更新
prd:create で自動生成されますが、実行前にもう一度同期します。

npm run prd:refresh-checks -- --slug simple-landing-page-hardening
npm run task:sync -- --slug simple-landing-page-hardening
npm run validate:pre-pr
3. Codexで3周目を実行
npm run prd:run -- docs/product-specs/simple-landing-page-hardening.md
4. Run evidence / context を確認
cd /Users/lee/Desktop/harness-test

RUN_DIR_3="$(find artifacts/runs -maxdepth 1 -type d -name '*-simple-landing-page-hardening' | sort | tail -1)"
echo "$RUN_DIR_3"

SUMMARY_3="$RUN_DIR_3/run-summary.json"

CONTEXT_3="$(node -e "const fs=require('fs'); const s=JSON.parse(fs.readFileSync(process.argv[1], 'utf8')); console.log(s.contextDir + '/context-summary.md')" "$SUMMARY_3")"

echo "$CONTEXT_3"

find "$RUN_DIR_3" -maxdepth 3 -type f | sort
sed -n '1,260p' "$CONTEXT_3"
5. 3周目worktreeで検証してcommit
cd /Users/lee/Desktop/harness-test-simple-landing-page-hardening

git status --short
npm run validate

git add -A
git commit -m "Harden simple landing page quality" \
  -m "Improve the existing Aster Notes landing page with stronger accessibility, focus behavior, responsive polish, CTA feedback, and evidence coverage before opening the third-pass PR." \
  -m "Confidence: medium" \
  -m "Scope-risk: narrow" \
  -m "Tested: npm run validate"
6. PR bodyを作る
cd /Users/lee/Desktop/harness-test

npm run pr:prepare -- \
  --slug simple-landing-page-hardening \
  --run-dir "$RUN_DIR_3" \
  --title "Simple Landing Page Hardening"

sed -n '1,320p' artifacts/pr/simple-landing-page-hardening/pr-body.md
pr:prepare はこのタイミングでも task:sync を走らせます。

7. PR前チェック
npm run validate:pre-pr
このチェックには以下が含まれます。

validate
validate:acceptance
validate:tasks
つまり:

PRDにAcceptance Criteriaがあるか
Test Planがあるか
docs/tasks/<slug>.md があるか
taskに必要セクションがあるか
workflow / skill / lifecycle が壊れていないか
を見ます。

8. GitHubにPRを作る
origin はもう設定済みなので、これでPRまで行ける想定です。

npm run pr:publish -- \
  --slug simple-landing-page-hardening \
  --run-dir "$RUN_DIR_3" \
  --title "Simple Landing Page Hardening"
pr:publish がやること:

pr:prepare
worktreeで npm run validate
未コミット変更があればcommit
git push -u origin agent/simple-landing-page-hardening
gh pr create
もし gh が未ログイン/未インストールなら、branch push 後に止まります。
その場合は、このファイルをGitHub plugin用のPR本文に使ってください。

artifacts/pr/simple-landing-page-hardening/pr-body.md
9. PR URLでfinalize
PR URLが分かったら差し替えてください。

npm run lifecycle:finalize -- \
  --slug simple-landing-page-hardening \
  --run-dir "$RUN_DIR_3" \
  --pr-url "https://github.com/rhsoddld/harness-test/pull/<PR_NUMBER>" \
  --notes "Third pass hardening for accessibility, responsive behavior, CTA interaction, and evidence coverage."

npm run task:sync -- --slug simple-landing-page-hardening
npm run validate:pre-pr
確認:

sed -n '1,280p' docs/product-specs/simple-landing-page-hardening.md
sed -n '1,280p' docs/exec-plans/completed/simple-landing-page-hardening.md
sed -n '1,280p' docs/tasks/simple-landing-page-hardening.md
10. mainにfinalize記録を入れる
finalize後のPRD/Completed plan/task更新は main 側の記録更新です。
PRとは別にmainへ入れるなら:

git status --short

git add docs/product-specs/simple-landing-page-hardening.md \
  docs/exec-plans/completed/simple-landing-page-hardening.md \
  docs/tasks/simple-landing-page-hardening.md

git commit -m "Record hardening delivery status" \
  -m "Move the third-pass landing page work from active execution into completed lifecycle records so PRD, task, evidence, and PR status remain current." \
  -m "Confidence: high" \
  -m "Scope-risk: narrow" \
  -m "Tested: npm run validate:pre-pr"

git push
もしPR作成で止まった場合
gh 未ログイン
gh auth login
その後:

npm run pr:publish -- \
  --slug simple-landing-page-hardening \
  --run-dir "$RUN_DIR_3" \
  --title "Simple Landing Page Hardening"
branchだけ残っている
git branch -D agent/simple-landing-page-hardening
worktreeが残っている
git worktree remove ../harness-test-simple-landing-page-hardening
git branch -D agent/simple-landing-page-hardening
PRDがすでにある
rm -f docs/product-specs/simple-landing-page-hardening.md
rm -f docs/exec-plans/active/simple-landing-page-hardening.md
rm -f docs/exec-plans/completed/simple-landing-page-hardening.md
rm -f docs/tasks/simple-landing-page-hardening.md
今回追加済みの仕組み
今回、3周目に必要な仕組みは追加して origin/main にpush済みです。

Commit:

ccdf2f2 Keep PRD execution tasks from drifting
追加:

npm run task:sync
npm run prd:refresh-checks
npm run validate:acceptance
npm run validate:tasks
npm run validate:pre-pr
.husky/pre-push
docs/tasks/<slug>.md 生成
pr:prepare / finalize 時の task再同期
prd:run 前の PRD check refresh + task sync + acceptance validation
これで3周目は、PRD、task、Acceptance Criteria、Test Plan、PR前チェック、GitHub PRまで流せる状態です。


