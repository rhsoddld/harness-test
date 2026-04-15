#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

function parseArgs(argv) {
  const args = { slug: '', runDir: '', base: 'main', title: '', bodyOut: '' };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === '--slug') args.slug = next, index += 1;
    else if (arg === '--run-dir') args.runDir = next, index += 1;
    else if (arg === '--base') args.base = next, index += 1;
    else if (arg === '--title') args.title = next, index += 1;
    else if (arg === '--body-out') args.bodyOut = next, index += 1;
    else if (arg === '-h' || arg === '--help') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function usage() {
  return `Usage:
  node scripts/prepare-pr.mjs --slug <slug> [--run-dir artifacts/runs/<run>] [--base main] [--title "..."]

Creates artifacts/pr/<slug>/pr-body.md for GitHub plugin or gh-based PR creation.
`;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: options.cwd ?? process.cwd(), encoding: 'utf8', stdio: 'pipe' });
  return {
    ok: result.status === 0,
    stdout: result.stdout?.trim() ?? '',
    stderr: result.stderr?.trim() ?? '',
    status: result.status
  };
}

function latestRunDir(slug) {
  const runsRoot = join(process.cwd(), 'artifacts', 'runs');
  if (!existsSync(runsRoot)) return '';
  return readdirSync(runsRoot)
    .filter((entry) => entry.endsWith(`-${slug}`))
    .map((entry) => join(runsRoot, entry))
    .filter((path) => statSync(path).isDirectory())
    .sort()
    .at(-1) ?? '';
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  console.log(usage());
  process.exit(0);
}
if (!args.slug) throw new Error('--slug is required');

const root = process.cwd();
const repoName = basename(root);
const runDir = args.runDir || latestRunDir(args.slug);
const prdPath = join(root, 'docs', 'product-specs', `${args.slug}.md`);
const activePlan = join(root, 'docs', 'exec-plans', 'active', `${args.slug}.md`);
const completedPlan = join(root, 'docs', 'exec-plans', 'completed', `${args.slug}.md`);
const outDir = join(root, 'artifacts', 'pr', args.slug);
const bodyOut = args.bodyOut || join(outDir, 'pr-body.md');
const worktreePath = join(dirname(root), `${repoName}-${args.slug}`);

if (!existsSync(prdPath)) throw new Error(`PRD not found: ${prdPath}`);
if (!existsSync(activePlan) && !existsSync(completedPlan)) throw new Error(`No active or completed plan found for slug: ${args.slug}`);
if (!runDir || !existsSync(runDir)) throw new Error('Run evidence directory not found. Pass --run-dir explicitly.');

mkdirSync(outDir, { recursive: true });

const status = existsSync(worktreePath) ? run('git', ['status', '--short'], { cwd: worktreePath }).stdout : 'Worktree not found.';
const branch = existsSync(worktreePath) ? run('git', ['branch', '--show-current'], { cwd: worktreePath }).stdout : `agent/${args.slug}`;
const finalPath = join(runDir, 'codex-final.md');
const summaryPath = join(runDir, 'run-summary.json');
let contextPath = 'missing';
if (existsSync(summaryPath)) {
  try {
    const summary = JSON.parse(readFileSync(summaryPath, 'utf8'));
    if (summary.contextDir) contextPath = join(summary.contextDir, 'context-summary.md');
  } catch {
    contextPath = 'unreadable run-summary.json';
  }
}
const prdText = readFileSync(prdPath, 'utf8');
const workstreamChecks = ['Frontend', 'Backend', 'Database', 'Container']
  .map((name) => {
    const match = prdText.match(new RegExp(`\\| ${name} \\| ([^|]+) \\|`));
    const applies = match?.[1]?.trim() ?? 'unknown';
    return `- [ ] ${name}: ${applies}`;
  });
const prdRel = prdPath.replace(`${root}/`, '');

const body = [
  `# ${args.title || args.slug}`,
  '',
  '## Summary',
  '',
  `Implements the PRD in \`${prdRel}\`.`,
  '',
  '## Workstream Rules',
  '',
  '- Frontend / Backend / Database / Container routing is recorded in the PRD and plan.',
  '- Repo-local rule packs live under `docs/workflows/*-rules.md`.',
  '',
  '## Evidence',
  '',
  `- Run directory: \`${runDir}\``,
  existsSync(finalPath) ? `- Codex final: \`${finalPath}\`` : '- Codex final: missing',
  existsSync(summaryPath) ? `- Run summary: \`${summaryPath}\`` : '- Run summary: missing',
  contextPath !== 'missing' ? `- Context summary: \`${contextPath}\`` : '- Context summary: missing',
  '',
  '## Workstream Checklist',
  '',
  ...workstreamChecks,
  '',
  '## Verification',
  '',
  '- [ ] `npm run validate`',
  '- [ ] Task-specific PRD acceptance criteria',
  '- [ ] Screenshots saved if UI/visual work applies',
  '- [ ] Context summary includes Skills Read, Commands Run, Evidence, Decisions, Assumptions, Not-tested, and Next Steps',
  '',
  '## Branch',
  '',
  `- Base: \`${args.base}\``,
  `- Head: \`${branch || `agent/${args.slug}`}\``,
  `- Worktree: \`${worktreePath}\``,
  '',
  '## Worktree Status',
  '',
  '```text',
  status || 'clean',
  '```',
  '',
  '## Not-tested',
  '',
  '- Fill this before opening or mark as none.',
  ''
].join('\n');

writeFileSync(bodyOut, body);
writeFileSync(join(outDir, 'pr-summary.json'), `${JSON.stringify({ slug: args.slug, base: args.base, branch, runDir, bodyOut, worktreePath }, null, 2)}\n`);
console.log(`PR body: ${bodyOut}`);
console.log(`PR summary: ${join(outDir, 'pr-summary.json')}`);
