# Security Baseline Skill

Default security layer for every implementation PR.

## Rules

- Do not commit secrets.
- Validate external input at trust boundaries.
- Document authn/authz assumptions for user-specific or write operations.
- Avoid logging sensitive data.
- Prefer least-privilege environment variables and runtime permissions.
- Record security-relevant `Not-tested` gaps explicitly.
