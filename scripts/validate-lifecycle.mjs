import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, join, relative } from 'node:path';

const root = process.cwd();
const errors = [];

function markdownFiles(dir, skip = new Set()) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .map((entry) => join(dir, entry))
    .filter((path) => statSync(path).isFile() && extname(path) === '.md' && !skip.has(basename(path)));
}

const prdDir = join(root, 'docs', 'product-specs');
const activeDir = join(root, 'docs', 'exec-plans', 'active');
const completedDir = join(root, 'docs', 'exec-plans', 'completed');

for (const prdFile of markdownFiles(prdDir, new Set(['index.md']))) {
  const slug = basename(prdFile, '.md');
  const activePlan = join(activeDir, `${slug}.md`);
  const completedPlan = join(completedDir, `${slug}.md`);
  if (!existsSync(activePlan) && !existsSync(completedPlan)) {
    errors.push(`${relative(root, prdFile)} must have a matching active or completed execution plan.`);
  }
}

for (const completedFile of markdownFiles(completedDir)) {
  const text = readFileSync(completedFile, 'utf8');
  const slug = basename(completedFile, '.md');
  const prdFile = join(prdDir, `${slug}.md`);
  if (!text.includes('## Completion Record')) {
    errors.push(`${relative(root, completedFile)} must include ## Completion Record.`);
  }
  if (!existsSync(prdFile)) {
    errors.push(`${relative(root, completedFile)} must have matching PRD docs/product-specs/${slug}.md.`);
    continue;
  }
  const prdText = readFileSync(prdFile, 'utf8');
  if (!prdText.includes('## Delivery Status')) {
    errors.push(`${relative(root, prdFile)} must include ## Delivery Status after plan completion.`);
  }
}

if (errors.length > 0) {
  console.error('Lifecycle validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Lifecycle validation passed.');
