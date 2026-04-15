# Simple Landing Page

## Goal

Implement `docs/product-specs/simple-landing-page.md` as a small static website.

## Acceptance Criteria

- [ ] All checked PRD acceptance criteria are satisfied.
- [ ] `npm run validate` passes.
- [ ] Evidence artifacts are saved for the implementation run.
- [ ] If browser/visual inspection is available, screenshots are saved under the run artifact `screenshots/` directory.

## Constraints

- Use only `index.html`, `styles.css`, and `script.js` for the website.
- Do not add dependencies.
- Do not add a build system.
- Keep the design intentional and responsive, not generic placeholder UI.
- Preserve the repository naming, link, docs, and commit hook rules.

## Steps

1. Read `AGENTS.md`, `docs/workflows/prd-to-implementation.md`, and the PRD.
2. Create `index.html`, `styles.css`, and `script.js` at the repository root.
3. Implement the Aster Notes landing page sections.
4. Add a small CTA interaction in `script.js`.
5. Run static checks such as `rg` against required content.
6. Run `npm run validate`.
7. If available, inspect the page in a browser and save screenshots to the run artifact directory.
8. Final response must list changed files, verification, evidence artifacts, and `Not-tested`.

## Verification

- `npm run validate`
- `rg "Aster Notes" index.html`
- `rg "styles.css|script.js" index.html`
- `rg "feature|Feature|特徴|step|Step|ステップ" index.html styles.css`
- Browser or screenshot check if available.

## Decision Log

- 2026-04-15: Created from initial website trial request via `scripts/create-prd.mjs`, then concretized for a dependency-free static site.

## Not-tested

- TBD after implementation run.
