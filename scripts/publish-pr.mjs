#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

function parseArgs(argv) {
  const args = { slug: '', base: 'main', title: '', runDir: '', commitTitle: '' };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === '--slug') args.slug = next, index += 1;
    else if (arg === '--base') args.base = next, index += 1;
    else if (arg === '--title') args.title = next, index += 1;
    else if (arg === '--run-dir') args.runDir = next, index += 1;
    else if (arg === '--commit-title') args.commitTitle = next, index += 1;
    else if (arg === '-h' || arg === '--help') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function usage() {
  return `Usage:
  node scripts/publish-pr.mjs --slug <slug> [--base main] [--title "..."] [--run-dir artifacts/runs/<run>]

Uses gh CLI when available. If gh or origin remote is missing, it leaves a PR body under artifacts/pr/<slug>/.
`;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: options.cwd ?? process.cwd(), encoding: 'utf8', stdio: options.stdio ?? 'pipe' });
  if (options.allowFailure) return result;
  if (result.status !== 0) {
    throw new Error([`Command failed: ${command} ${args.join(' ')}`, result.stdout?.trim(), result.stderr?.trim()].filter(Boolean).join('\n'));
  }
  return result;
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  console.log(usage());
  process.exit(0);
}
if (!args.slug) throw new Error('--slug is required');

const root = process.cwd();
const repoName = basename(root);
const worktreePath = join(dirname(root), `${repoName}-${args.slug}`);
const prBody = join(root, 'artifacts', 'pr', args.slug, 'pr-body.md');

run('node', ['scripts/prepare-pr.mjs', '--slug', args.slug, '--base', args.base, ...(args.title ? ['--title', args.title] : []), ...(args.runDir ? ['--run-dir', args.runDir] : [])], { cwd: root, stdio: 'inherit' });

if (!existsSync(worktreePath)) throw new Error(`Worktree not found: ${worktreePath}`);

run('npm', ['run', 'validate'], { cwd: worktreePath, stdio: 'inherit' });
const status = run('git', ['status', '--short'], { cwd: worktreePath }).stdout.trim();
if (status) {
  run('git', ['add', '-A'], { cwd: worktreePath, stdio: 'inherit' });
  run('git', ['commit',
    '-m', args.commitTitle || `Implement ${args.slug}`,
    '-m', `Implementation follows the PRD and preserves repository validation plus evidence artifact requirements.`,
    '-m', 'Confidence: medium',
    '-m', 'Scope-risk: narrow',
    '-m', 'Tested: npm run validate'
  ], { cwd: worktreePath, stdio: 'inherit' });
}

const origin = run('git', ['remote', 'get-url', 'origin'], { cwd: worktreePath, allowFailure: true });
if (origin.status !== 0) {
  console.log(`No origin remote configured. PR body is ready at: ${prBody}`);
  console.log('Use the GitHub plugin after adding a remote and pushing the branch.');
  process.exit(0);
}

const branch = run('git', ['branch', '--show-current'], { cwd: worktreePath }).stdout.trim();
run('git', ['push', '-u', 'origin', branch], { cwd: worktreePath, stdio: 'inherit' });

const gh = run('gh', ['--version'], { allowFailure: true });
if (gh.status !== 0) {
  console.log(`gh CLI not found. Branch pushed. PR body is ready at: ${prBody}`);
  console.log('Open the PR with the registered GitHub plugin using that body.');
  process.exit(0);
}

run('gh', ['pr', 'create', '--base', args.base, '--head', branch, '--title', args.title || args.slug, '--body-file', prBody], { cwd: worktreePath, stdio: 'inherit' });
