import { readFileSync } from 'node:fs';

const [, , messagePath] = process.argv;

if (!messagePath) {
  console.error('Usage: node scripts/validate-commit-msg.mjs <commit-msg-file>');
  process.exit(2);
}

const message = readFileSync(messagePath, 'utf8').trimEnd();
const errors = [];
const lines = message.split('\n');
const firstLine = lines[0]?.trim() ?? '';

if (firstLine.length < 12) {
  errors.push('Intent line must explain why the change exists and be at least 12 characters.');
}

if (firstLine.length > 72) {
  errors.push('Intent line should be 72 characters or fewer.');
}

if (/^(add|update|fix|change|create|remove)\b/i.test(firstLine)) {
  errors.push('Intent line should describe why, not just what. Avoid starting with Add/Update/Fix/Change/Create/Remove.');
}

const trailerPattern = /^([A-Z][A-Za-z-]*):\s+.+$/;
const trailers = lines.filter((line) => trailerPattern.test(line));
const trailerKeys = new Set(trailers.map((line) => line.split(':', 1)[0]));

if (!trailerKeys.has('Confidence')) {
  errors.push('Missing required trailer: Confidence: <low|medium|high>');
}

if (!trailerKeys.has('Scope-risk')) {
  errors.push('Missing required trailer: Scope-risk: <narrow|moderate|broad>');
}

if (!trailerKeys.has('Tested') && !trailerKeys.has('Not-tested')) {
  errors.push('Missing verification trailer: Tested: ... or Not-tested: ...');
}

const confidenceLine = trailers.find((line) => line.startsWith('Confidence:'));
if (confidenceLine && !/^Confidence:\s+(low|medium|high)$/i.test(confidenceLine)) {
  errors.push('Confidence must be one of: low, medium, high.');
}

const scopeRiskLine = trailers.find((line) => line.startsWith('Scope-risk:'));
if (scopeRiskLine && !/^Scope-risk:\s+(narrow|moderate|broad)$/i.test(scopeRiskLine)) {
  errors.push('Scope-risk must be one of: narrow, moderate, broad.');
}

if (errors.length > 0) {
  console.error('Commit message validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  console.error('\nSee docs/workflows/git-and-commits.md for the Lore Commit Protocol.');
  process.exit(1);
}
