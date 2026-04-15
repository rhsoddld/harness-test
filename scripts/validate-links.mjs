import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize, relative, resolve } from 'node:path';

const root = process.cwd();
const errors = [];
const ignoredDirs = new Set(['.git', 'node_modules', 'artifacts']);
const markdownFiles = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (ignoredDirs.has(entry)) continue;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else if (extname(path) === '.md') markdownFiles.push(path);
  }
}

function slugifyHeading(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function anchorsFor(text) {
  const anchors = new Set();
  for (const line of text.split('\n')) {
    const match = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (match) anchors.add(slugifyHeading(match[2]));
  }
  return anchors;
}

function isExternal(target) {
  return /^(https?:|mailto:|tel:)/i.test(target);
}

walk(root);

for (const file of markdownFiles) {
  const text = readFileSync(file, 'utf8');
  const linkPattern = /(?<!!\[[^\]]*\])\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const imagePattern = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const links = [...text.matchAll(linkPattern), ...text.matchAll(imagePattern)];

  for (const match of links) {
    const rawTarget = match[1];
    if (!rawTarget || rawTarget.startsWith('#') || isExternal(rawTarget)) continue;
    if (rawTarget.startsWith('app://') || rawTarget.startsWith('file://')) continue;

    const [targetPath, rawAnchor] = rawTarget.split('#');
    const decodedTargetPath = decodeURIComponent(targetPath);
    const absoluteTarget = normalize(resolve(dirname(file), decodedTargetPath));

    if (!absoluteTarget.startsWith(root)) {
      errors.push(`${relative(root, file)} links outside repository: ${rawTarget}`);
      continue;
    }

    if (!existsSync(absoluteTarget)) {
      errors.push(`${relative(root, file)} has broken local link: ${rawTarget}`);
      continue;
    }

    if (rawAnchor && statSync(absoluteTarget).isFile() && extname(absoluteTarget) === '.md') {
      const targetText = readFileSync(absoluteTarget, 'utf8');
      const anchors = anchorsFor(targetText);
      if (!anchors.has(decodeURIComponent(rawAnchor))) {
        errors.push(`${relative(root, file)} links to missing anchor ${rawTarget}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error('Link validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Link validation passed.');
