# Backend Rules

Backend work must have explicit contracts, validated boundaries, predictable errors, and testable behavior.
These rules apply whenever the PRD marks `Backend` as `yes`.

## Required Reads

- `docs/skills/backend-api-stack.md`
- `docs/skills/testing-quality.md`
- `docs/skills/security-baseline.md`
- `docs/workflows/evidence-artifacts.md`
- `docs/workflows/context-artifacts.md`

## API Contract

- Define request shape, response shape, and error shape before implementation.
- Document authn/authz assumptions for every user-specific or mutating operation.
- Keep external API behavior stable and explicit; do not rely on undocumented side effects.
- Prefer typed contracts and narrow data transfer objects over passing raw persistence models across boundaries.
- Version or compatibility-impacting changes must be called out in the PRD, plan, or PR body.

## Boundary And Validation

- Validate all external input at the boundary.
- Treat route handlers, server actions, webhooks, queues, and CLI inputs as trust boundaries.
- Normalize inputs before business logic.
- Return predictable validation errors without leaking internals.
- Never trust client-provided identity, role, or ownership fields without server-side verification.

## Service Design

- Keep transport handlers thin once logic grows beyond trivial request mapping.
- Put reusable business logic into service modules with clear inputs and outputs.
- Keep side effects explicit: database writes, external calls, email, jobs, and cache invalidation.
- Avoid hidden global mutable state.
- Record idempotency behavior for retries, webhooks, and payment-like operations.

## Error Handling And Observability

- Use consistent error categories: validation, auth, not found, conflict, rate/limit, internal.
- Log enough context for debugging without secrets or sensitive user data.
- Add correlation/request identifiers when the stack supports it.
- Do not swallow errors that affect user-visible state.
- Document expected failure modes in the PRD or active plan.

## Dependencies

- Do not add backend dependencies unless the PRD or plan records why.
- Prefer platform/framework primitives and existing utilities first.
- If adding a dependency, document alternatives considered, security implications, and verification.

## Verification

Minimum checks for backend work:

- `npm run validate`
- Success-path check for each new or changed API behavior.
- Failure-path check for validation and authorization-sensitive behavior.
- Contract check or static assertion for request/response shape when practical.
- Context summary updated with API contracts, commands, evidence paths, and gaps.

## Evidence To Save

Save evidence under the current run artifact directory:

- Command output: `notes/`
- API smoke output or test logs: `notes/`
- Compact handoff summary: `artifacts/context/<run-id>/context-summary.md`

If an external service cannot be exercised locally, record the gap under `Not-tested` with the strongest safe substitute.

## Done Criteria

Backend work is not done until:

- API contracts are documented.
- Boundary validation is implemented or explicitly blocked.
- Success and failure paths were checked.
- `npm run validate` passed.
- Evidence and `Not-tested` gaps are recorded.
