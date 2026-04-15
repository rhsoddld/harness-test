# Testing Quality Skill

Default quality layer for every implementation PR.

## Stack Preference

- Vitest for fast TypeScript unit tests when a JS/TS app exists.
- Playwright for browser behavior and screenshots.
- Static checks for docs, naming, PRD lifecycle, and links.

## Rules

- Always run `npm run validate`.
- Add the smallest test that protects the changed behavior.
- Save command output under run artifact `notes/` when a command is important evidence.
- Record gaps under `Not-tested` instead of implying coverage.
