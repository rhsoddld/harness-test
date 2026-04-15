# Backend API Stack Skill

Default when the Backend workstream applies.

## Stack Preference

- Next.js Route Handlers or Server Actions for app-local APIs.
- Explicit request, response, and error contracts.
- TypeScript-first service boundaries.
- Runtime input validation at external boundaries.

## Rules

- Read `docs/workflows/backend-rules.md` before implementation.
- Keep transport handlers thin when business logic grows.
- Define authn/authz assumptions before exposing mutations.
- Return predictable errors; do not leak secrets or internals.
- Add success and failure-path checks where possible.

## Evidence

- API contract notes in PRD or design docs.
- Unit/integration check output saved to run notes.
- `npm run validate`.
