# Frontend Rules

Frontend work must be intentional, accessible, responsive, and verifiable.
These rules apply whenever the PRD marks `Frontend` as `yes`.

## Required Reads

- `docs/skills/frontend-modern-stack.md`
- `docs/skills/testing-quality.md`
- `docs/skills/security-baseline.md`
- `docs/workflows/evidence-artifacts.md`
- `docs/workflows/context-artifacts.md`

## Default Architecture

- Put production web app code under `apps/web` unless the PRD explicitly asks for a root-level static smoke test.
- Prefer typed component boundaries and small modules over large page files.
- Keep route/page composition separate from reusable UI primitives when the stack supports it.
- Put reusable presentation primitives under `packages/ui` once a component is used by more than one surface.
- Keep environment-specific behavior behind configuration, not inline conditionals spread across components.

## Design Quality Bar

- Choose a clear visual direction before styling: product feel, spacing rhythm, color system, and interaction tone.
- Avoid generic placeholder layouts, unstyled default controls, and interchangeable AI-looking sections.
- Use semantic hierarchy: one primary page purpose, clear headings, predictable CTA priority.
- Define reusable design tokens or CSS variables for colors, spacing, radius, shadow, and motion when styling grows beyond a single file.
- Keep motion purposeful: entrance, feedback, or state transition. Do not add decorative motion that obscures usability.

## Accessibility

- Use semantic HTML before ARIA.
- Every interactive element must be keyboard reachable and have a visible focus state.
- Forms need labels, validation messages, and error states tied to the relevant control.
- Color contrast must be readable in normal and emphasized states.
- Do not rely on color alone to communicate status.
- Respect reduced-motion preferences when adding animation.

## Responsive Behavior

- Verify the main user journey at approximately 375px mobile width and desktop width.
- Avoid horizontal overflow.
- Keep tap targets usable on mobile.
- Navigation, CTA, cards, and forms must remain readable without layout overlap.
- If the UI has dense data, define the mobile behavior explicitly instead of letting the browser guess.

## State And Interaction

- Loading, empty, success, error, disabled, and optimistic states must be considered for interactive UI.
- Do not leave buttons clickable while an irreversible action is already submitting.
- User-triggered state changes should provide visible feedback.
- Client-side state should be local unless sharing is required; avoid global state by default.
- Persisted or server-derived state must have an explicit invalidation/refetch strategy.

## Dependencies

- Do not add frontend dependencies unless the PRD or implementation plan records why.
- Prefer platform APIs and existing repo utilities first.
- If adding a dependency, document the rejected alternatives and the verification performed.
- Avoid UI libraries that force a visual language unless the PRD asks for that system.

## Verification

Minimum checks for frontend work:

- `npm run validate`
- Static search for required product copy, routes, or test ids when applicable.
- Browser or DOM verification for the primary interaction.
- Screenshot evidence for visual changes when browser tooling is available.
- Context summary updated with visual decisions, commands, evidence paths, and gaps.

## Evidence To Save

Save evidence under the current run artifact directory:

- Screenshots: `screenshots/`
- Command output: `notes/`
- Compact handoff summary: `artifacts/context/<run-id>/context-summary.md`

If screenshots cannot be captured, record why under `Not-tested` and provide the strongest available fallback evidence.

## Done Criteria

Frontend work is not done until:

- The PRD acceptance criteria are satisfied or explicitly marked blocked.
- Required frontend skill/rule files were read.
- Main mobile and desktop layouts were checked.
- Primary interactions were verified.
- `npm run validate` passed.
- Evidence and `Not-tested` gaps are recorded.
