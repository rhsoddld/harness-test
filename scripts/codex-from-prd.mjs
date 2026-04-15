#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const prdPath = process.argv[2];
if (!prdPath || prdPath === '-h' || prdPath === '--help') {
  console.log('Usage:\n  node scripts/codex-from-prd.mjs docs/product-specs/<slug>.md');
  process.exit(prdPath ? 0 : 1);
}

if (!existsSync(prdPath)) throw new Error(`PRD not found: ${prdPath}`);

const slug = basename(prdPath, '.md');
spawnSync('node', ['scripts/refresh-prd-checks.mjs', '--slug', slug], { cwd: process.cwd(), stdio: 'inherit' });
spawnSync('node', ['scripts/sync-task.mjs', '--slug', slug], { cwd: process.cwd(), stdio: 'inherit' });
const acceptanceCheck = spawnSync('node', ['scripts/validate-acceptance.mjs'], { cwd: process.cwd(), stdio: 'inherit' });
if (acceptanceCheck.status !== 0) process.exit(acceptanceCheck.status ?? 1);

const prd = readFileSync(prdPath, 'utf8');
const planPath = join('docs', 'exec-plans', 'active', `${slug}.md`);
const plan = existsSync(planPath) ? readFileSync(planPath, 'utf8') : 'No active execution plan found.';

const task = `Implement from PRD.\n\nPRD:\n${prd}\n\nExecution plan:\n${plan}\n\nFollow AGENTS.md. Keep evidence under artifacts/runs. Run npm run validate before finalizing.`;

const result = spawnSync('node', ['scripts/codex-worktree-run.mjs', '--slug', slug, '--task', task], {
  cwd: process.cwd(),
  stdio: 'inherit'
});

process.exit(result.status ?? 1);
