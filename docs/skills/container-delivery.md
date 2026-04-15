# Container Delivery Skill

Default when the Container workstream applies.

## Stack Preference

- Dockerfile and Compose for local reproducibility.
- Pinned base images when practical.
- Healthchecks and explicit exposed ports.
- Runtime logs captured as evidence.

## Rules

- Read `docs/workflows/container-rules.md` before implementation.
- Do not bake secrets into images or compose files.
- Keep container startup observable with logs and healthchecks.
- Document required environment variables.

## Evidence

- Build logs.
- Run logs.
- Healthcheck or smoke command output.
