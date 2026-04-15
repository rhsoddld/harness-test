# Frontend Modern Stack Skill

Default when the Frontend workstream applies.

## Stack Preference

- Next.js App Router for production web apps.
- React 19-compatible patterns.
- TypeScript for application code.
- Tailwind CSS 4 when utility CSS is helpful.
- Playwright or browser tooling for visual/user-flow evidence.

## Rules

- Read `docs/workflows/frontend-rules.md` before implementation.
- Keep the UI accessible at keyboard and screen-reader level.
- Prefer Server Components for data-fetching surfaces when using Next.js App Router.
- Keep client components small and explicit.
- Capture screenshots when visual output changes and tooling is available.
- Avoid introducing UI dependencies unless PRD constraints justify them.

## Evidence

- Static checks for expected text and links.
- Browser check or screenshot for visual changes.
- `npm run validate` from the repo or worktree.

## References

See `docs/skills/stack-references.md` before major framework changes.
