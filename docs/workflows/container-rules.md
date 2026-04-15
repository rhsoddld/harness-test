# Container Rules

- Document image name, exposed ports, required env vars, and volumes.
- Prefer reproducible builds with pinned base images when practical.
- Include a healthcheck or equivalent runtime verification when the stack supports it.
- Save build/run logs as evidence for container changes.
- Do not bake secrets into images or compose files.
