#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

function parseArgs(argv) {
  const args = { slug: '', runDir: '', prUrl: '', status: 'completed', notes: '' };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === '--slug') args.slug = next, index += 1;
    else if (arg === '--run-dir') args.runDir = next, index += 1;
    else if (arg === '--pr-url') args.prUrl = next, index += 1;
    else if (arg === '--status') args.status = next, index += 1;
    else if (arg === '--notes') args.notes = next, index += 1;
    else if (arg === '-h' || arg === '--help') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function usage() {
  return `Usage:
  node scripts/finalize-run.mjs --slug <slug> --run-dir artifacts/runs/<run> [--pr-url <url>] [--status completed|blocked] [--notes "..."]

Moves docs/exec-plans/active/<slug>.md to completed and updates the PRD delivery status.
`;
}

function lines(values) {
  return `${values.join('\n')}\n`;
}

function upsertSection(text, heading, body) {
  const marker = `## ${heading}`;
  const start = text.indexOf(marker);
  if (start === -1) return `${text.trimEnd()}\n\n${marker}\n\n${body.trim()}\n`;

  const rest = text.slice(start + marker.length);
  const next = rest.search(/\n##\s+/);
  if (next === -1) return `${text.slice(0, start)}${marker}\n\n${body.trim()}\n`;
  const end = start + marker.length + next;
  return `${text.slice(0, start)}${marker}\n\n${body.trim()}\n${text.slice(end)}`;
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  console.log(usage());
  process.exit(0);
}
if (!args.slug || !args.runDir) throw new Error('--slug and --run-dir are required');
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(args.slug)) throw new Error('--slug must be kebab-case');

const root = process.cwd();
const activePlan = join(root, 'docs', 'exec-plans', 'active', `${args.slug}.md`);
const completedPlan = join(root, 'docs', 'exec-plans', 'completed', `${args.slug}.md`);
const prdPath = join(root, 'docs', 'product-specs', `${args.slug}.md`);
const runDir = args.runDir;
const completedAt = new Date().toISOString();

if (!existsSync(activePlan)) throw new Error(`Active plan not found: ${activePlan}`);
if (!existsSync(prdPath)) throw new Error(`PRD not found: ${prdPath}`);
if (!existsSync(runDir)) throw new Error(`Run evidence directory not found: ${runDir}`);
if (existsSync(completedPlan)) throw new Error(`Completed plan already exists: ${completedPlan}`);

mkdirSync(join(root, 'docs', 'exec-plans', 'completed'), { recursive: true });
renameSync(activePlan, completedPlan);

const completedText = readFileSync(completedPlan, 'utf8');
const completionRecord = lines([
  `- Status: ${args.status}`,
  `- Completed-at: ${completedAt}`,
  `- Evidence: ${runDir}`,
  `- Pull-request: ${args.prUrl || 'TBD'}`,
  `- Notes: ${args.notes || 'TBD'}`
]);
writeFileSync(completedPlan, upsertSection(completedText, 'Completion Record', completionRecord));

const prdText = readFileSync(prdPath, 'utf8');
const deliveryStatus = lines([
  `- Status: ${args.status}`,
  `- Updated-at: ${completedAt}`,
  `- Completed-plan: ../exec-plans/completed/${basename(completedPlan)}`,
  `- Evidence: ${runDir}`,
  `- Pull-request: ${args.prUrl || 'TBD'}`,
  `- Notes: ${args.notes || 'TBD'}`
]);
writeFileSync(prdPath, upsertSection(prdText, 'Delivery Status', deliveryStatus));

console.log(`Completed plan: ${completedPlan}`);
console.log(`Updated PRD: ${prdPath}`);
