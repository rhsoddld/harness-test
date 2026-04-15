#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

function parseArgs(argv) {
  const args = { slug: '', title: '', input: '', workstreams: '' };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === '--slug') args.slug = next, index += 1;
    else if (arg === '--title') args.title = next, index += 1;
    else if (arg === '--input') args.input = next, index += 1;
    else if (arg === '--workstreams') args.workstreams = next, index += 1;
    else if (arg === '-h' || arg === '--help') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function usage() {
  return `Usage:
  node scripts/create-prd.mjs --slug <kebab-name> --title "<title>" --input "<initial development request>" [--workstreams frontend,backend,database,container]

Creates:
  docs/product-specs/<slug>.md
  docs/exec-plans/active/<slug>.md
`;
}

function assertSlug(slug) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('--slug must be kebab-case, for example: login-flow');
  }
}

function lines(values) {
  return `${values.join('\n')}\n`;
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  console.log(usage());
  process.exit(0);
}

if (!args.slug || !args.title || !args.input) {
  throw new Error('--slug, --title, and --input are required. Use --help for examples.');
}

assertSlug(args.slug);

const productSpecDir = join(process.cwd(), 'docs', 'product-specs');
const planDir = join(process.cwd(), 'docs', 'exec-plans', 'active');
const prdPath = join(productSpecDir, `${args.slug}.md`);
const planPath = join(planDir, `${args.slug}.md`);

if (existsSync(prdPath)) throw new Error(`PRD already exists: ${prdPath}`);
if (existsSync(planPath)) throw new Error(`Execution plan already exists: ${planPath}`);

mkdirSync(productSpecDir, { recursive: true });
mkdirSync(planDir, { recursive: true });

const now = new Date().toISOString().slice(0, 10);
const selectedWorkstreams = new Set(
  (args.workstreams || 'frontend')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
);
const workstreamRows = [
  ['Frontend', 'frontend', 'frontend-modern-stack + frontend-rules', 'screenshot or DOM/static check'],
  ['Backend', 'backend', 'backend-api-stack + backend-rules', 'API/unit/integration check'],
  ['Database', 'database', 'database-postgres-prisma + database-rules', 'migration/schema/seed check'],
  ['Container', 'container', 'container-delivery + container-rules', 'build/run/log check']
].map(([label, key, skill, evidence]) => `| ${label} | ${selectedWorkstreams.has(key) ? 'yes' : 'no'} | \`${skill}\` | ${evidence} |`);
const workstreamPlan = [
  ['Frontend', 'frontend', 'Read \`docs/skills/frontend-modern-stack.md\` and \`docs/workflows/frontend-rules.md\`. Implement UI only if this workstream applies.'],
  ['Backend', 'backend', 'Read \`docs/skills/backend-api-stack.md\` and \`docs/workflows/backend-rules.md\`. Define API contracts only if this workstream applies.'],
  ['Database', 'database', 'Read \`docs/skills/database-postgres-prisma.md\` and \`docs/workflows/database-rules.md\`. Define schema/migration work only if this workstream applies.'],
  ['Container', 'container', 'Read \`docs/skills/container-delivery.md\` and \`docs/workflows/container-rules.md\`. Define image/runtime work only if this workstream applies.']
].map(([label, key, guidance]) => [`### ${label}`, '', `Applies: ${selectedWorkstreams.has(key) ? 'yes' : 'no'}`, '', guidance].join('\n'));

writeFileSync(prdPath, lines([
  `# ${args.title}`,
  '',
  '## Source Request',
  '',
  args.input,
  '',
  '## User',
  '',
  'TBD: Who is this for?',
  '',
  '## Problem',
  '',
  'TBD: What user pain or workflow bottleneck should this solve?',
  '',
  '## Goals',
  '',
  '- TBD',
  '',
  '## Non-goals',
  '',
  '- TBD',
  '',
  '## User Journey',
  '',
  '1. TBD',
  '',
  '## Workstreams And Skills',
  '',
  '| Workstream | Applies | Required skill/context | Evidence |',
  '| --- | --- | --- | --- |',
  ...workstreamRows,
  '',
  '## Always-on Skills',
  '',
  '- `testing-quality`: read `docs/skills/testing-quality.md` for verification and evidence strategy.',
  '- `security-baseline`: read `docs/skills/security-baseline.md` for baseline security rules.',
  '',
  '## Functional Requirements',
  '',
  '- TBD',
  '',
  '## Agent-verifiable Acceptance Criteria',
  '',
  '- [ ] TBD: The agent can verify this with a command, test, screenshot, or artifact.',
  '',
  '## Evidence Requirements',
  '',
  '- `codex-events.jsonl` saved under the run artifact directory.',
  '- `codex-final.md` saved under the run artifact directory.',
  '- Screenshots saved under `screenshots/` when UI or visual state matters.',
  '- Validation logs saved under `notes/` when commands are run.',
  '',
  '## Risks And Open Questions',
  '',
  '- TBD',
  '',
  '## Created',
  '',
  now
]));

writeFileSync(planPath, lines([
  `# ${args.title}`,
  '',
  '## Goal',
  '',
  `Implement the PRD in ../../product-specs/${args.slug}.md.`,
  '',
  '## Acceptance Criteria',
  '',
  '- [ ] All checked PRD acceptance criteria are satisfied.',
  '- [ ] `npm run validate` passes.',
  '- [ ] Evidence artifacts are saved for the implementation run.',
  '',
  '## Workstream Plan',
  '',
  ...workstreamPlan,
  '',
  '## Required Skill Reads',
  '',
  '- `docs/skills/index.md`',
  '- `docs/skills/testing-quality.md`',
  '- `docs/skills/security-baseline.md`',
  '- Workstream-specific skill files listed above when Applies is yes.',
  '',
  '## Constraints',
  '',
  '- Keep changes small and reviewable.',
  '- Do not add dependencies unless the PRD or implementation notes justify them.',
  '- Preserve the repository naming, link, docs, and commit hook rules.',
  '',
  '## Steps',
  '',
  '1. Read `AGENTS.md` and the PRD.',
  '2. Convert TBD fields into concrete assumptions or ask only if materially blocked.',
  '3. Implement the smallest working slice.',
  '4. Run validation.',
  '5. Save run evidence.',
  '6. Prepare a Lore commit or PR summary.',
  '',
  '## Verification',
  '',
  '- `npm run validate`',
  '- Additional task-specific checks from the PRD.',
  '',
  '## Decision Log',
  '',
  `- ${now}: Created from initial request via \`scripts/create-prd.mjs\`.`,
  '',
  '## Not-tested',
  '',
  '- TBD'
]));

console.log(`Created PRD: ${prdPath}`);
console.log(`Created execution plan: ${planPath}`);
