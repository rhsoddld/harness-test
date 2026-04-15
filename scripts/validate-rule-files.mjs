import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const errors = [];
const ruleFiles = [
  'docs/workflows/frontend-rules.md',
  'docs/workflows/backend-rules.md',
  'docs/workflows/database-rules.md',
  'docs/workflows/container-rules.md'
];
const requiredSections = [
  '## Required Reads',
  '## Verification',
  '## Evidence To Save',
  '## Done Criteria'
];

for (const ruleFile of ruleFiles) {
  const path = join(root, ruleFile);
  if (!existsSync(path)) {
    errors.push(`Missing rule file: ${ruleFile}`);
    continue;
  }
  const text = readFileSync(path, 'utf8');
  for (const section of requiredSections) {
    if (!text.includes(section)) errors.push(`${ruleFile} missing ${section}`);
  }
}

if (errors.length > 0) {
  console.error('Rule file validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Rule file validation passed.');
