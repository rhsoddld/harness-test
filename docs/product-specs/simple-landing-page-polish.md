# Simple Landing Page Polish

## Source Request

1周目で作成した Aster Notes の静的ランディングページを改善する。対象は simple-landing-page の成果物。Frontend は yes。Backend、Database、Container は no。視覚デザインをより意図的にし、モバイル375pxとデスクトップで読みやすくし、CTA interaction と focus state を改善する。既存の index.html、styles.css、script.js を読み、必要最小限の変更で磨く。UI確認が必要なので可能ならスクリーンショットを artifacts/runs の screenshots に保存する。context-summary.md には Skills Read、Commands Run、Evidence、Decisions、Assumptions、Not-tested、Next Steps を埋める。最後に npm run validate を通す。

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

## Delivery Status

- Status: completed
- Updated-at: 2026-04-15T10:50:00.694Z
- Completed-plan: ../exec-plans/completed/simple-landing-page-polish.md
- Evidence: artifacts/runs/2026-04-15T10-41-16-312Z-simple-landing-page-polish
- Pull-request: TBD
- Notes: Second pass polish and accessibility improvements.
