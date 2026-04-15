import { readdirSync, statSync } from 'node:fs';
import { basename, join, relative } from 'node:path';

const root = process.cwd();
const errors = [];
const ignoredDirs = new Set(['.git', 'node_modules', 'artifacts', '.husky', '.omx']);
const fileAllowlist = new Set([
  '.DS_Store',
  '.gitignore',
  '.gitkeep',
  'AGENTS.md',
  'ARCHITECTURE.md',
  'HARNESS_ENGINEERING.md',
  'PLANS.md',
  'PRODUCT_SENSE.md',
  'QUALITY_SCORE.md',
  'README.md',
  'RELIABILITY.md',
  'SECURITY.md',
  'LICENSE'
]);
const kebabFile = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+)*$/;
const kebabDir = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validate(path) {
  for (const entry of readdirSync(path)) {
    if (ignoredDirs.has(entry)) continue;
    const fullPath = join(path, entry);
    const stat = statSync(fullPath);
    const rel = relative(root, fullPath);

    if (fileAllowlist.has(entry)) {
      continue;
    }

    if (stat.isDirectory()) {
      if (!kebabDir.test(entry)) errors.push(`Directory should use kebab-case: ${rel}`);
      validate(fullPath);
      continue;
    }

    if (!kebabFile.test(entry)) errors.push(`File should use kebab-case or allowlist entry: ${rel}`);
  }
}

validate(root);

if (errors.length > 0) {
  console.error('Naming validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Naming validation passed.');
