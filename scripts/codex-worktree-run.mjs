#!/usr/bin/env node
import { createWriteStream, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

function parseArgs(argv) {
  const args = {
    base: 'HEAD',
    slug: '',
    task: '',
    model: '',
    sandbox: 'workspace-write',
    worktreeRoot: '',
    keepGoing: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === '--base') args.base = next, index += 1;
    else if (arg === '--slug') args.slug = next, index += 1;
    else if (arg === '--task') args.task = next, index += 1;
    else if (arg === '--model') args.model = next, index += 1;
    else if (arg === '--sandbox') args.sandbox = next, index += 1;
    else if (arg === '--worktree-root') args.worktreeRoot = next, index += 1;
    else if (arg === '--keep-going') args.keepGoing = true;
    else if (arg === '-h' || arg === '--help') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function usage() {
  return `Usage:
  node scripts/codex-worktree-run.mjs --slug <name> --task <prompt> [--base HEAD] [--model gpt-5.4]

Creates a sibling Git worktree, runs codex exec --json in it, and stores evidence under artifacts/runs/.
`;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: 'utf8',
    stdio: options.stdio ?? 'pipe'
  });

  if (result.status !== 0) {
    const stderr = result.stderr?.trim();
    const stdout = result.stdout?.trim();
    throw new Error([`Command failed: ${command} ${args.join(' ')}`, stdout, stderr].filter(Boolean).join('\n'));
  }

  return result.stdout.trim();
}

function safeSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'codex-run';
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function codexPrompt({ task, artifactDir }) {
  return `You are running inside a throwaway Git worktree created for a Codex-only harness trial.

Task:
${task}

Harness contract:
- Read AGENTS.md first, then follow the repository docs that apply to the task.
- Keep all run evidence in this directory: ${artifactDir}
- If you interact with a browser, UI, visual output, or anything screenshot-relevant, save screenshots under: ${join(artifactDir, 'screenshots')}
- Save any extra notes, copied command output, or reproduction details under: ${join(artifactDir, 'notes')}
- Run the relevant validation commands before finalizing.
- Final response must include: changed files, verification performed, evidence files saved, and Not-tested items.
- Do not delete the worktree or artifacts directory.
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }
  if (!args.task) throw new Error('--task is required');

  const repoRoot = run('git', ['rev-parse', '--show-toplevel']);
  const repoName = basename(repoRoot);
  const slug = safeSlug(args.slug || args.task);
  const runId = `${timestamp()}-${slug}`;
  const branch = `agent/${slug}`;
  const parentDir = args.worktreeRoot ? resolve(args.worktreeRoot) : dirname(repoRoot);
  const worktreePath = join(parentDir, `${repoName}-${slug}`);
  const artifactDir = join(repoRoot, 'artifacts', 'runs', runId);

  if (existsSync(worktreePath)) {
    throw new Error(`Worktree path already exists: ${worktreePath}`);
  }

  mkdirSync(join(artifactDir, 'screenshots'), { recursive: true });
  mkdirSync(join(artifactDir, 'notes'), { recursive: true });

  run('git', ['worktree', 'add', '-b', branch, worktreePath, args.base], { cwd: repoRoot, stdio: 'inherit' });

  const eventsPath = join(artifactDir, 'codex-events.jsonl');
  const finalPath = join(artifactDir, 'codex-final.md');
  const summaryPath = join(artifactDir, 'run-summary.json');
  const prompt = codexPrompt({ task: args.task, artifactDir });
  const codexArgs = [
    'exec',
    '--json',
    '--cd', worktreePath,
    '--sandbox', args.sandbox,
    '--add-dir', artifactDir,
    '--output-last-message', finalPath
  ];

  if (args.model) codexArgs.push('--model', args.model);
  codexArgs.push(prompt);

  const startedAt = new Date().toISOString();
  const eventStream = createWriteStream(eventsPath, { flags: 'w' });
  const child = spawn('codex', codexArgs, {
    cwd: worktreePath,
    env: {
      ...process.env,
      CODEX_HARNESS_ARTIFACT_DIR: artifactDir
    }
  });

  child.stdout.on('data', (chunk) => {
    process.stdout.write(chunk);
    eventStream.write(chunk);
  });

  child.stderr.on('data', (chunk) => {
    process.stderr.write(chunk);
  });

  const exitCode = await new Promise((resolveExit) => {
    child.on('close', resolveExit);
  });
  eventStream.end();

  const finishedAt = new Date().toISOString();
  writeFileSync(summaryPath, `${JSON.stringify({
    runId,
    slug,
    task: args.task,
    base: args.base,
    branch,
    repoRoot,
    worktreePath,
    artifactDir,
    eventsPath,
    finalPath,
    startedAt,
    finishedAt,
    exitCode
  }, null, 2)}\n`);

  if (exitCode !== 0 && !args.keepGoing) {
    throw new Error(`codex exec exited with code ${exitCode}. Evidence saved to ${artifactDir}`);
  }

  console.log(`\nEvidence saved to ${artifactDir}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
