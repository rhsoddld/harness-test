#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

function parseArgs(argv) {
  const args = { slug: '', all: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === '--slug') args.slug = next, index += 1;
    else if (arg === '--all') args.all = true;
    else if (arg === '-h' || arg === '--help') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function usage() {
  return `Usage:
  node scripts/sync-task.mjs --slug <slug>
  node scripts/sync-task.mjs --all

Generates docs/tasks/<slug>.md from the PRD and matching active/completed plan.
`;
}

function section(text, heading) {
  const marker = `## ${heading}`;
  const start = text.indexOf(marker);
  if (start === -1) return 'TBD';
  const rest = text.slice(start + marker.length);
  const next = rest.search(/\n##\s+/);
  return (next === -1 ? rest : rest.slice(0, next)).trim() || 'TBD';
}

function lines(values) {
  return `${values.join('\n')}\n`;
}

function syncTask(slug) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid slug: ${slug}`);

  const root = process.cwd();
  const prdPath = join(root, 'docs', 'product-specs', `${slug}.md`);
  const activePlanPath = join(root, 'docs', 'exec-plans', 'active', `${slug}.md`);
  const completedPlanPath = join(root, 'docs', 'exec-plans', 'completed', `${slug}.md`);
  const taskDir = join(root, 'docs', 'tasks');
  const taskPath = join(taskDir, `${slug}.md`);

  if (!existsSync(prdPath)) throw new Error(`PRD not found: ${prdPath}`);
  const planPath = existsSync(activePlanPath) ? activePlanPath : completedPlanPath;
  if (!existsSync(planPath)) throw new Error(`Plan not found for slug: ${slug}`);

  const prd = readFileSync(prdPath, 'utf8');
  const plan = readFileSync(planPath, 'utf8');
  const title = prd.match(/^#\s+(.+)$/m)?.[1] ?? slug;
  const status = existsSync(activePlanPath) ? 'active' : 'completed';
  const now = new Date().toISOString();

  mkdirSync(taskDir, { recursive: true });
  writeFileSync(taskPath, lines([
    `# ${title}`,
    '',
    '<!-- GENERATED FROM PRD: edit PRD/plan, then run npm run task:sync -->',
    '',
    `- Slug: ${slug}`,
    `- Status: ${status}`,
    `- PRD: ../product-specs/${slug}.md`,
    `- Plan: ../exec-plans/${status}/${slug}.md`,
    `- Synced-at: ${now}`,
    '',
    '## Source Request',
    '',
    section(prd, 'Source Request'),
    '',
    '## Workstreams And Skills',
    '',
    section(prd, 'Workstreams And Skills'),
    '',
    '## Required Skill Reads',
    '',
    section(plan, 'Required Skill Reads'),
    '',
    '## Acceptance Criteria',
    '',
    section(prd, 'Acceptance Criteria') !== 'TBD' ? section(prd, 'Acceptance Criteria') : section(prd, 'Agent-verifiable Acceptance Criteria'),
    '',
    '## Test Plan',
    '',
    section(prd, 'Test Plan') !== 'TBD' ? section(prd, 'Test Plan') : section(plan, 'Verification'),
    '',
    '## Evidence Requirements',
    '',
    section(prd, 'Evidence Requirements'),
    '',
    '## Lifecycle',
    '',
    section(prd, 'Delivery Status') !== 'TBD' ? section(prd, 'Delivery Status') : 'Not finalized yet.',
    '',
    '## Not-tested',
    '',
    section(plan, 'Not-tested')
  ]));

  console.log(`Synced task: ${taskPath}`);
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  console.log(usage());
  process.exit(0);
}

if (args.all) {
  const prdDir = join(process.cwd(), 'docs', 'product-specs');
  const slugs = existsSync(prdDir)
    ? readdirSync(prdDir)
        .filter((entry) => entry.endsWith('.md') && entry !== 'index.md')
        .map((entry) => basename(entry, '.md'))
    : [];
  for (const slug of slugs) syncTask(slug);
} else if (args.slug) {
  syncTask(args.slug);
} else {
  throw new Error('--slug or --all is required');
}
