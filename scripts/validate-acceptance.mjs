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

function section(text, heading) {
  const marker = `## ${heading}`;
  const start = text.indexOf(marker);
  if (start === -1) return '';
  const rest = text.slice(start + marker.length);
  const next = rest.search(/\n##\s+/);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
}

for (const prdFile of markdownFiles(join(root, 'docs', 'product-specs'), new Set(['index.md']))) {
  const text = readFileSync(prdFile, 'utf8');
  const acceptance = section(text, 'Acceptance Criteria') || section(text, 'Agent-verifiable Acceptance Criteria');
  const testPlan = section(text, 'Test Plan');
  const rel = relative(root, prdFile);

  if (!acceptance) errors.push(`${rel} must include Acceptance Criteria or Agent-verifiable Acceptance Criteria.`);
  if (acceptance.includes('TBD')) errors.push(`${rel} acceptance criteria must not contain TBD.`);
  if (!/- \[[ xX]\]\s+\S/.test(acceptance)) errors.push(`${rel} acceptance criteria must use checklist items.`);
  if (!/(npm run validate|screenshot|browser|test|rg |curl|migration|healthcheck|static)/i.test(acceptance)) {
    errors.push(`${rel} acceptance criteria must include verifiable command/evidence language.`);
  }

  if (!testPlan) errors.push(`${rel} must include ## Test Plan.`);
  if (testPlan && testPlan.includes('TBD')) errors.push(`${rel} test plan must not contain TBD.`);
  if (testPlan && !/(npm run validate|screenshot|browser|test|rg |curl|migration|healthcheck|static)/i.test(testPlan)) {
    errors.push(`${rel} test plan must name concrete checks or evidence.`);
  }
}

if (errors.length > 0) {
  console.error('Acceptance/test validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Acceptance/test validation passed.');
