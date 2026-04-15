# Simple Landing Page Hardening

## Source Request

既存の Aster Notes 静的ランディングページを3周目として品質改善する。対象は現在の main にある apps/web/index.html、apps/web/styles.css、apps/web/script.js。Frontend は yes。Backend、Database、Container は no。改善内容は、アクセシビリティ、キーボードフォーカス、CTA interaction、375pxモバイル表示、デスクトップ表示、不要な視覚ノイズの削減、証跡不足の補完。新しい依存は追加しない。実装前に docs/skills/frontend-modern-stack.md、docs/workflows/frontend-rules.md、docs/skills/testing-quality.md、docs/skills/security-baseline.md を読む。context-summary.md には Skills Read、Commands Run、Evidence、Decisions、Assumptions、Not-tested、Next Steps を埋める。最後に npm run validate と静的DOM確認を実行し、可能ならスクリーンショットを artifacts/runs の screenshots に保存する。

## User

TBD: Who is this for?

## Problem

TBD: What user pain or workflow bottleneck should this solve?

## Goals

- TBD

## Non-goals

- TBD

## User Journey

1. TBD

## Workstreams And Skills

| Workstream | Applies | Required skill/context | Evidence |
| --- | --- | --- | --- |
| Frontend | yes | `frontend-modern-stack + frontend-rules` | screenshot or DOM/static check |
| Backend | no | `backend-api-stack + backend-rules` | API/unit/integration check |
| Database | no | `database-postgres-prisma + database-rules` | migration/schema/seed check |
| Container | no | `container-delivery + container-rules` | build/run/log check |

## Always-on Skills

- `testing-quality`: read `docs/skills/testing-quality.md` for verification and evidence strategy.
- `security-baseline`: read `docs/skills/security-baseline.md` for baseline security rules.

## Functional Requirements

- Implement the behavior described in Source Request.
- Preserve the selected workstream constraints and evidence requirements.

## Acceptance Criteria

- [ ] `npm run validate` passes.
- [ ] Required run evidence is saved under `artifacts/runs/<timestamp>-<slug>/`.
- [ ] `artifacts/context/<run-id>/context-summary.md` lists Skills Read, Commands Run, Evidence, Decisions, Assumptions, Not-tested, and Next Steps.
- [ ] Workstream-specific evidence listed in `## Workstreams And Skills` is present or explicitly recorded under `Not-tested`.
- [ ] Frontend changes are checked with static DOM/text checks and browser or screenshot evidence when available.

## Test Plan

- Run `npm run validate`.
- Run task-specific static checks derived from the PRD and active plan.
- For frontend/UI work, inspect the UI in browser or DOM and save screenshots when available.
- Save important command output under the run artifact `notes/` directory.

## Evidence Requirements

- `codex-events.jsonl` saved under the run artifact directory.
- `codex-final.md` saved under the run artifact directory.
- Screenshots saved under `screenshots/` when UI or visual state matters.
- Validation logs saved under `notes/` when commands are run.

## Risks And Open Questions

- TBD

## Created

2026-04-15
