import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const errors = [];
const requiredHeadings = [
  '## Task',
  '## PRD And Plan',
  '## Workstreams',
  '## Skills Read',
  '## Commands Run',
  '## Evidence',
  '## Decisions',
  '## Assumptions',
  '## Not-tested',
  '## Next Steps'
];

const templatePath = join(root, 'docs', 'workflows', 'context-summary-template.md');
if (!existsSync(templatePath)) {
  errors.push('Missing docs/workflows/context-summary-template.md');
} else {
  const template = readFileSync(templatePath, 'utf8');
  for (const heading of requiredHeadings) {
    if (!template.includes(heading)) errors.push(`Context template missing heading: ${heading}`);
  }
}

const runnerPath = join(root, 'scripts', 'codex-worktree-run.mjs');
if (!existsSync(runnerPath)) {
  errors.push('Missing scripts/codex-worktree-run.mjs');
} else {
  const runner = readFileSync(runnerPath, 'utf8');
  for (const heading of requiredHeadings) {
    if (!runner.includes(heading)) errors.push(`Codex runner context seed missing heading: ${heading}`);
  }
  if (!runner.includes('CODEX_HARNESS_CONTEXT_DIR')) {
    errors.push('Codex runner must export CODEX_HARNESS_CONTEXT_DIR.');
  }
}

if (errors.length > 0) {
  console.error('Context validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Context validation passed.');
