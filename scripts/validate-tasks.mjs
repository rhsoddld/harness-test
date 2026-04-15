import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, join, relative } from 'node:path';

const root = process.cwd();
const errors = [];
const requiredSections = [
  '## Source Request',
  '## Workstreams And Skills',
  '## Required Skill Reads',
  '## Acceptance Criteria',
  '## Test Plan',
  '## Evidence Requirements',
  '## Lifecycle',
  '## Not-tested'
];

function markdownFiles(dir, skip = new Set()) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .map((entry) => join(dir, entry))
    .filter((path) => statSync(path).isFile() && extname(path) === '.md' && !skip.has(basename(path)));
}

for (const prdFile of markdownFiles(join(root, 'docs', 'product-specs'), new Set(['index.md']))) {
  const slug = basename(prdFile, '.md');
  const active = join(root, 'docs', 'exec-plans', 'active', `${slug}.md`);
  const completed = join(root, 'docs', 'exec-plans', 'completed', `${slug}.md`);
  const task = join(root, 'docs', 'tasks', `${slug}.md`);
  if (!existsSync(active) && !existsSync(completed)) continue;
  if (!existsSync(task)) {
    errors.push(`Missing generated task file for ${relative(root, prdFile)}. Run: npm run task:sync -- --slug ${slug}`);
    continue;
  }
  const text = readFileSync(task, 'utf8');
  for (const section of requiredSections) {
    if (!text.includes(section)) errors.push(`${relative(root, task)} missing ${section}`);
  }
  if (!text.includes('<!-- GENERATED FROM PRD')) errors.push(`${relative(root, task)} must include generated marker.`);
  const acceptance = text.split('## Acceptance Criteria')[1]?.split('## Test Plan')[0] ?? '';
  const testPlan = text.split('## Test Plan')[1]?.split('## Evidence Requirements')[0] ?? '';
  if (acceptance.includes('TBD')) errors.push(`${relative(root, task)} acceptance criteria still contains TBD. Update PRD and rerun task:sync.`);
  if (testPlan.includes('TBD')) errors.push(`${relative(root, task)} test plan still contains TBD. Update PRD and rerun task:sync.`);
}

if (errors.length > 0) {
  console.error('Task validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Task validation passed.');
