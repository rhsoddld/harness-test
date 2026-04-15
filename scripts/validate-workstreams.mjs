import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, join, relative } from 'node:path';

const root = process.cwd();
const errors = [];
const workstreams = ['Frontend', 'Backend', 'Database', 'Container'];

function markdownFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .map((entry) => join(dir, entry))
    .filter((path) => statSync(path).isFile() && extname(path) === '.md' && basename(path) !== 'index.md');
}

function requireInFile(file, snippets) {
  const text = readFileSync(file, 'utf8');
  for (const snippet of snippets) {
    if (!text.includes(snippet)) {
      errors.push(`${relative(root, file)} is missing required content: ${snippet}`);
    }
  }
}

for (const file of markdownFiles(join(root, 'docs', 'product-specs'))) {
  requireInFile(file, [
    '## Workstreams And Skills',
    '| Workstream | Applies | Required skill/context | Evidence |',
    ...workstreams.map((workstream) => `| ${workstream} |`)
  ]);
}

for (const file of markdownFiles(join(root, 'docs', 'exec-plans', 'active'))) {
  requireInFile(file, [
    '## Workstream Plan',
    ...workstreams.map((workstream) => `### ${workstream}`)
  ]);
}

if (errors.length > 0) {
  console.error('Workstream validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Workstream validation passed.');
