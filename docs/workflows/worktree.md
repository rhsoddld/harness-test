# Worktree Workflow

このリポジトリは Git worktree でブランチごとに隔離して実施する前提。

## Branch Naming

```text
agent/<short-task-name>
fix/<short-bug-name>
docs/<short-topic>
```

## Create A Worktree

```bash
git fetch origin
git worktree add ../harness-test-<task> -b agent/<task> origin/main
cd ../harness-test-<task>
npm install
npm run prepare
npm run validate
```

## Working Rules

- 1 worktree は 1 PR 目的にする。
- 並列作業では shared docs の編集衝突を避けるため、計画ファイルをタスクごとに分ける。
- 作業終了前に `npm run validate` を実行する。
- worktree を消す前に PR、未 push commit、未保存 artifacts を確認する。

## Cleanup

```bash
git worktree list
git worktree remove ../harness-test-<task>
git branch -d agent/<task>
```
