import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, join, relative } from 'node:path';

const root = process.cwd();
const errors = [];
const requiredSkills = [
  'docs/skills/index.md',
  'docs/skills/frontend-modern-stack.md',
  'docs/skills/backend-api-stack.md',
  'docs/skills/database-postgres-prisma.md',
  'docs/skills/container-delivery.md',
  'docs/skills/testing-quality.md',
  'docs/skills/security-baseline.md',
  'docs/skills/stack-references.md'
];

for (const skill of requiredSkills) {
  if (!existsSync(join(root, skill))) errors.push(`Missing required skill file: ${skill}`);
}

function markdownFiles(dir, skip = new Set()) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .map((entry) => join(dir, entry))
    .filter((path) => statSync(path).isFile() && extname(path) === '.md' && !skip.has(basename(path)));
}

const skillMap = new Map([
  ['frontend-modern-stack', 'docs/skills/frontend-modern-stack.md'],
  ['backend-api-stack', 'docs/skills/backend-api-stack.md'],
  ['database-postgres-prisma', 'docs/skills/database-postgres-prisma.md'],
  ['container-delivery', 'docs/skills/container-delivery.md'],
  ['testing-quality', 'docs/skills/testing-quality.md'],
  ['security-baseline', 'docs/skills/security-baseline.md']
]);

for (const prdFile of markdownFiles(join(root, 'docs', 'product-specs'), new Set(['index.md']))) {
  const text = readFileSync(prdFile, 'utf8');
  for (const skillName of skillMap.keys()) {
    if (text.includes(skillName) && !existsSync(join(root, skillMap.get(skillName)))) {
      errors.push(`${relative(root, prdFile)} references missing skill: ${skillName}`);
    }
  }
  if (!text.includes('testing-quality') || !text.includes('security-baseline')) {
    errors.push(`${relative(root, prdFile)} must reference testing-quality and security-baseline skills.`);
  }
}

for (const planFile of markdownFiles(join(root, 'docs', 'exec-plans', 'active'))) {
  const text = readFileSync(planFile, 'utf8');
  if (!text.includes('## Required Skill Reads')) {
    errors.push(`${relative(root, planFile)} must include ## Required Skill Reads.`);
  }
}

if (errors.length > 0) {
  console.error('Skill validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Skill validation passed.');
