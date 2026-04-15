# Container Rules

Container work must make local/runtime execution reproducible, observable, and safe.
These rules apply whenever the PRD marks `Container` as `yes`.

## Required Reads

- `docs/skills/container-delivery.md`
- `docs/skills/testing-quality.md`
- `docs/skills/security-baseline.md`
- `docs/workflows/evidence-artifacts.md`
- `docs/workflows/context-artifacts.md`

## Image Design

- Document image name, purpose, base image, exposed ports, and expected runtime command.
- Pin base images when practical; avoid floating tags for production-like images.
- Keep build contexts small and intentional.
- Do not bake secrets, local tokens, or machine-specific paths into images.
- Prefer non-root runtime users when the stack supports it.

## Configuration

- Document required environment variables and safe example values.
- Keep secrets out of Dockerfiles, Compose files, and committed env files.
- Use volumes intentionally and document what persists.
- Define network/port assumptions explicitly.

## Runtime Health

- Include a healthcheck or equivalent smoke command when the service is long-running.
- Startup logs should make misconfiguration diagnosable.
- Containers should fail fast on missing required configuration.
- Avoid silent background failures.

## Compose And Local Development

- Compose services should be named by responsibility, not implementation detail.
- Document dependencies between app, database, cache, and worker services.
- Keep local-only services clearly marked.
- Avoid requiring cloud credentials for basic local smoke checks.

## Verification

Minimum checks for container work:

- `npm run validate`
- Container build or dry-build evidence when tooling is available.
- Runtime smoke command or healthcheck output.
- Logs saved for failed and successful startup when possible.
- Context summary updated with image/runtime decisions, commands, evidence paths, and gaps.

## Evidence To Save

Save evidence under the current run artifact directory:

- Build logs: `notes/`
- Run/healthcheck logs: `notes/`
- Compact handoff summary: `artifacts/context/<run-id>/context-summary.md`

If Docker is unavailable, record that under `Not-tested` and provide static Dockerfile/Compose review evidence.

## Done Criteria

Container work is not done until:

- Image/runtime assumptions are documented.
- Secrets are not baked into images or compose files.
- Build/run or equivalent static evidence is saved.
- `npm run validate` passed.
