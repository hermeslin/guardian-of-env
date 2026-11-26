import { readFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { compare } from './compare.js';
import { type EnvFile, parseEnvFile } from './envFile.js';
import { report } from './report.js';

interface Output {
  exitCode: 0 | 1 | 2;
  stdout: string;
  stderr: string;
}

const USAGE = 'Usage: guardian-of-env [--strict-order] <file> <file> [<file>...]\n';

const usageError = (reason: string): Output => ({
  exitCode: 2,
  stdout: '',
  stderr: `guardian-of-env: ${reason}\n${USAGE}`,
});

export const run = (args: string[], cwd: string): Output => {
  let parsed;
  try {
    parsed = parseArgs({
      args,
      options: { 'strict-order': { type: 'boolean', default: false } },
      allowPositionals: true,
    });
  } catch (error) {
    return usageError((error as Error).message);
  }
  const names = parsed.positionals;
  if (names.length < 2) return usageError('expected at least two files');

  const files: EnvFile[] = [];
  let stderr = '';
  for (const name of names) {
    let content;
    try {
      content = readFileSync(path.resolve(cwd, name), 'utf8');
    } catch (error) {
      stderr += `guardian-of-env: cannot read ${name} (${(error as NodeJS.ErrnoException).code})\n`;
      continue;
    }
    files.push(parseEnvFile(name, content));
  }
  if (stderr) return { exitCode: 2, stdout: '', stderr };

  const problems = compare(files, parsed.values['strict-order']);
  if (problems.length === 0)
    return { exitCode: 0, stdout: '.env files all the same!\n', stderr: '' };
  return { exitCode: 1, stdout: report(problems), stderr: '' };
};
