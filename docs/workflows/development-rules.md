# Development Rules

開発は PRD から始め、PRD と active execution plan に workstream と skill routing を明記する。
Codex が実装するときは、この routing を読んで必要な専門コンテキストを使う。

## Required Workstreams

PRD には必ず次の表を置く。

| Workstream | Applies | Required skill/context | Evidence |
| --- | --- | --- | --- |
| Frontend | yes/no | `frontend-rules` | screenshot or DOM/static check |
| Backend | yes/no | `backend-rules` | API/unit/integration check |
| Database | yes/no | `database-rules` | migration/schema/seed check |
| Container | yes/no | `container-rules` | build/run/log check |

`Applies` が `yes` の行は、実行計画にも具体的な作業と検証を書く。

## Built-in Rule Packs

このリポジトリでは、外部 Skill を暗黙に呼ぶだけにせず、最低限守るルールを repo-local docs として固定する。

- Frontend: `docs/workflows/frontend-rules.md`
- Backend: `docs/workflows/backend-rules.md`
- Database: `docs/workflows/database-rules.md`
- Container: `docs/workflows/container-rules.md`

## Enforcement

`npm run validate` は以下を確認する。

- PRD に `## Workstreams And Skills` がある。
- active execution plan に `## Workstream Plan` がある。
- PRD に Frontend, Backend, Database, Container の4行がある。
- active execution plan に Frontend, Backend, Database, Container の4項目がある。

## When To Use Codex Skills

Codex のローカル Skill が該当する場合は、その Skill を使う。
ただし Skill の有無に依存してルールが消えないよう、repo-local rule pack を常に優先して読む。

- Frontend/UI work: use frontend design rules and capture screenshots when possible.
- Backend/API work: define API contracts and request/response validation.
- Database work: document schema, migrations, rollback, and seed strategy.
- Container work: document build, run, healthcheck, logs, and exposed ports.
