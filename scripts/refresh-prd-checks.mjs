#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
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
  node scripts/refresh-prd-checks.mjs --slug <slug>
  node scripts/refresh-prd-checks.mjs --all

Adds or refreshes concrete Acceptance Criteria and Test Plan sections in PRDs.
`;
}

function section(text, heading) {
  const marker = `## ${heading}`;
  const start = text.indexOf(marker);
  if (start === -1) return '';
  const rest = text.slice(start + marker.length);
  const next = rest.search(/\n##\s+/);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
}

function upsertSection(text, heading, body, beforeHeading = '') {
  const marker = `## ${heading}`;
  const start = text.indexOf(marker);
  if (start !== -1) {
    const rest = text.slice(start + marker.length);
    const next = rest.search(/\n##\s+/);
    if (next === -1) return `${text.slice(0, start)}${marker}\n\n${body.trim()}\n`;
    const end = start + marker.length + next;
    return `${text.slice(0, start)}${marker}\n\n${body.trim()}\n${text.slice(end)}`;
  }

  if (beforeHeading) {
    const before = text.indexOf(`## ${beforeHeading}`);
    if (before !== -1) return `${text.slice(0, before)}${marker}\n\n${body.trim()}\n\n${text.slice(before)}`;
  }

  return `${text.trimEnd()}\n\n${marker}\n\n${body.trim()}\n`;
}

function refresh(slug) {
  const prdPath = join(process.cwd(), 'docs', 'product-specs', `${slug}.md`);
  if (!existsSync(prdPath)) throw new Error(`PRD not found: ${prdPath}`);

  let text = readFileSync(prdPath, 'utf8');
  const source = section(text, 'Source Request');
  const workstreams = section(text, 'Workstreams And Skills');
  const frontend = /\| Frontend \| yes \|/.test(workstreams);
  const backend = /\| Backend \| yes \|/.test(workstreams);
  const database = /\| Database \| yes \|/.test(workstreams);
  const container = /\| Container \| yes \|/.test(workstreams);

  const acceptance = [
    '- [ ] `npm run validate` passes.',
    '- [ ] Required run evidence is saved under `artifacts/runs/<timestamp>-<slug>/`.',
    '- [ ] `artifacts/context/<run-id>/context-summary.md` lists Skills Read, Commands Run, Evidence, Decisions, Assumptions, Not-tested, and Next Steps.',
    '- [ ] Workstream-specific evidence listed in `## Workstreams And Skills` is present or explicitly recorded under `Not-tested`.'
  ];
  if (frontend) acceptance.push('- [ ] Frontend changes are checked with static DOM/text checks and browser or screenshot evidence when available.');
  if (backend) acceptance.push('- [ ] Backend API success and failure paths are checked with command output saved to run notes.');
  if (database) acceptance.push('- [ ] Database migration/schema evidence and rollback notes are saved to run notes.');
  if (container) acceptance.push('- [ ] Container build/run or healthcheck evidence is saved to run notes.');

  const testPlan = [
    '- Run `npm run validate`.',
    '- Run task-specific static checks derived from the PRD and active plan.',
    frontend ? '- For frontend/UI work, inspect the UI in browser or DOM and save screenshots when available.' : '',
    backend ? '- For backend work, run API contract or smoke checks for success and failure paths.' : '',
    database ? '- For database work, run migration/schema dry checks or save static migration evidence.' : '',
    container ? '- For container work, run build/run/healthcheck when Docker is available or record a static review fallback.' : '',
    '- Save important command output under the run artifact `notes/` directory.'
  ].filter(Boolean);

  text = text.replace(/## Agent-verifiable Acceptance Criteria\n\n(?:.|\n)*?(?=\n##\s+)/, '');
  text = upsertSection(text, 'Acceptance Criteria', acceptance.join('\n'), 'Evidence Requirements');
  text = upsertSection(text, 'Test Plan', testPlan.join('\n'), 'Evidence Requirements');

  if (source && !section(text, 'Functional Requirements').replace(/\s/g, '').replace(/-TBD/g, '')) {
    text = upsertSection(text, 'Functional Requirements', `- Implement the behavior described in Source Request.\n- Preserve the selected workstream constraints and evidence requirements.`, 'Acceptance Criteria');
  }

  writeFileSync(prdPath, text);
  console.log(`Refreshed PRD checks: ${prdPath}`);
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  console.log(usage());
  process.exit(0);
}
if (args.all) {
  const dir = join(process.cwd(), 'docs', 'product-specs');
  const slugs = existsSync(dir)
    ? readdirSync(dir).filter((entry) => entry.endsWith('.md') && entry !== 'index.md').map((entry) => basename(entry, '.md'))
    : [];
  for (const slug of slugs) refresh(slug);
} else if (args.slug) {
  refresh(args.slug);
} else {
  throw new Error('--slug or --all is required');
}
