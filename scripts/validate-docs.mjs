import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const requiredPaths = [
  'AGENTS.md',
  'ARCHITECTURE.md',
  'README.md',
  'docs/HARNESS_ENGINEERING.md',
  'docs/PLANS.md',
  'docs/PRODUCT_SENSE.md',
  'docs/QUALITY_SCORE.md',
  'docs/RELIABILITY.md',
  'docs/SECURITY.md',
  'docs/design-docs/index.md',
  'docs/design-docs/core-beliefs.md',
  'docs/exec-plans/active',
  'docs/exec-plans/completed',
  'docs/exec-plans/tech-debt-tracker.md',
  'docs/generated/README.md',
  'docs/product-specs/index.md',
  'docs/references/index.md',
  'docs/workflows/worktree.md',
  'docs/workflows/github-plugin.md',
  'docs/workflows/git-and-commits.md',
  'docs/workflows/evidence-artifacts.md',
  'docs/workflows/codex-exec-worktree.md',
  'docs/workflows/prd-to-implementation.md',
  'docs/workflows/validation-and-naming.md'
];

const root = process.cwd();
const errors = [];

for (const requiredPath of requiredPaths) {
  if (!existsSync(join(root, requiredPath))) {
    errors.push(`Missing required harness path: ${requiredPath}`);
  }
}

if (existsSync(join(root, 'AGENTS.md'))) {
  const lines = readFileSync(join(root, 'AGENTS.md'), 'utf8').trimEnd().split('\n');
  if (lines.length > 120) {
    errors.push(`AGENTS.md should stay map-sized. Current lines: ${lines.length}; max: 120.`);
  }
}

const docsToCheck = [
  'docs/HARNESS_ENGINEERING.md',
  'docs/workflows/worktree.md',
  'docs/workflows/github-plugin.md',
  'docs/workflows/git-and-commits.md',
  'docs/workflows/evidence-artifacts.md',
  'docs/workflows/codex-exec-worktree.md',
  'docs/workflows/prd-to-implementation.md',
  'docs/workflows/validation-and-naming.md'
];

for (const doc of docsToCheck) {
  if (!existsSync(join(root, doc))) continue;
  const text = readFileSync(join(root, doc), 'utf8');
  if (!text.startsWith('# ')) {
    errors.push(`${doc} must start with a level-1 heading.`);
  }
}

if (errors.length > 0) {
  console.error('Harness validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Harness validation passed.');
