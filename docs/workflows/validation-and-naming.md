# Validation And Naming

`npm run validate` は commit 前と手動確認で必ず通す。
Husky の `pre-commit` も同じ検証を実行する。

## Validate Commands

```bash
npm run validate
npm run validate:docs
npm run validate:links
npm run validate:naming
npm run validate:commit-msg -- .git/COMMIT_EDITMSG
```

## What Is Checked

- Docs structure: ハーネスに必要な必須ファイルと必須ディレクトリが存在する。
- Link check: Markdown 内のローカルリンクと Markdown anchor が壊れていない。
- Naming check: 通常ファイルとディレクトリは kebab-case にする。
- Commit message: Lore Commit Protocol の最低限の trailer を持つ。

## Naming Rules

- Root allowlist: `AGENTS.md`, `ARCHITECTURE.md`, `README.md`, `LICENSE`.
- Directories: `kebab-case`.
- Files: `kebab-case` with lowercase extensions, for example `codex-worktree-run.mjs`.
- Local runtime directories are ignored: `.git`, `.husky`, `.omx`, `artifacts`, `node_modules`.

## Link Check Scope

- Local Markdown links and images are checked.
- External URLs are allowed but not fetched by default, so validation does not depend on network availability.
- If an external URL becomes important evidence, summarize the source in docs and preserve the retrieval date manually.
