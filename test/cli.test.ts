import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const CLI = path.resolve('lib/main.js');
const SAME = '.env files all the same!\n';

const run = (args: string[], cwd = process.cwd()) => {
  const { status, stdout, stderr } = spawnSync(process.execPath, [CLI, ...args], {
    cwd,
    encoding: 'utf8',
  });
  return { exitCode: status, stdout, stderr };
};

const tmpDirs: string[] = [];
const projectWith = (files: Record<string, string>) => {
  const dir = mkdtempSync(path.join(tmpdir(), 'guardian-of-env-'));
  tmpDirs.push(dir);
  for (const [name, content] of Object.entries(files)) writeFileSync(path.join(dir, name), content);
  return dir;
};

afterEach(() => {
  for (const dir of tmpDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('guardian-of-env CLI', () => {
  describe('exits 0 and says so when the keys match', () => {
    it.each([
      ['two files', ['test/.env.base', 'test/.env.the.same']],
      ['multi-line files', ['test/.env.multiple', 'test/.env.multiple.the.same']],
      ['three files', ['test/.env.base', 'test/.env.the.same', 'test/.env.the.same']],
      ['a single file', ['test/.env.base']],
    ])('%s', (_, args) => {
      expect(run(args)).toEqual({ exitCode: 0, stdout: SAME, stderr: '' });
    });

    it('.env and .env.example in the cwd when no arguments are given', () => {
      const cwd = projectWith({ '.env': 'A=1\nB=2\n', '.env.example': 'A=\nB=\n' });
      expect(run([], cwd)).toEqual({ exitCode: 0, stdout: SAME, stderr: '' });
    });

    it('even when a key is repeated in one file', () => {
      const cwd = projectWith({ '.env': 'A=1\nA=2\n', '.env.example': 'A=\n' });
      expect(run(['.env', '.env.example'], cwd)).toEqual({ exitCode: 0, stdout: SAME, stderr: '' });
    });
  });

  describe('exits 1 and prints the key table when the keys differ', () => {
    it.each([
      ['a missing and an extra key', ['test/.env.base', 'test/.env.not.the.same']],
      ['multi-line files', ['test/.env.multiple', 'test/.env.multiple.not.the.same']],
      ['the same keys in another order', ['test/.env.multiple', 'test/.env.multiple.the.same.different.sort']],
      ['the first of three files that differs', ['test/.env.base', 'test/.env.not.the.same', 'test/.env.the.same']],
    ])('%s', (_, args) => {
      const result = run(args);
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toBe('');
      expect(result.stdout).toMatchSnapshot();
    });

    it('.env and .env.example in the cwd when no arguments are given', () => {
      const cwd = projectWith({ '.env': 'A=1\nB=2\n', '.env.example': 'A=\nC=\n' });
      const result = run([], cwd);
      expect(result.exitCode).toBe(1);
      expect(result.stdout).toMatchSnapshot();
    });
  });

  describe('crashes with exit code 1 and an uncaught error', () => {
    it('when a file does not exist', () => {
      const result = run(['test/.env.base', 'test/.env.does.not.exist']);
      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe('');
      expect(result.stderr).toContain('ENOENT');
    });

    it('when no arguments are given and the cwd has no .env', () => {
      const result = run([], projectWith({}));
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('ENOENT');
    });

    it('when a file is given as an absolute path', () => {
      const cwd = projectWith({ '.env': 'A=1\n', '.env.example': 'A=\n' });
      const result = run([path.join(cwd, '.env'), path.join(cwd, '.env.example')], cwd);
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('ENOENT');
    });

    it.each([['.env.e2e'], ['.env.Production']])('when a file name like %s has digits or capitals', (name) => {
      const cwd = projectWith({ '.env': 'A=1\n', [name]: 'A=2\n' });
      const result = run(['.env', name], cwd);
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('TypeError');
    });

    it('when a file other than the second one differs among three', () => {
      const result = run(['test/.env.base', 'test/.env.the.same', 'test/.env.not.the.same']);
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Table must have a consistent number of cells');
    });
  });
});
