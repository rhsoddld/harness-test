# Web App

Primary frontend/full-stack web application home.

Default target stack for real app work:

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS 4 when utility CSS is needed
- Playwright for browser evidence when UI behavior matters

For the dependency-free landing-page smoke test, Codex may create root-level `index.html`, `styles.css`, and `script.js` if the PRD explicitly asks for that minimal shape.

## Static Landing Page Check

The Aster Notes smoke-test landing page is dependency-free and lives in this directory:

- `index.html`
- `styles.css`
- `script.js`

Open `apps/web/index.html` directly in a browser, then verify:

- The hero, three feature cards, three ordered how-it-works steps, and CTA are visible.
- The navigation links jump to their matching sections.
- The layout remains readable at mobile and desktop widths.
- Browser console output has no page errors.
