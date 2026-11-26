import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { run } from '../src/cli.js';

const cwd = process.cwd();
const SAME = { exitCode: 0, stdout: '.env files all the same!\n', stderr: '' };
const USAGE = 'Usage: guardian-of-env [--strict-order] <file> <file> [<file>...]\n';

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

describe('guardian-of-env', () => {
  describe('exits 0 and says so when the keys match', () => {
    it.each([
      ['two files', ['test/.env.base', 'test/.env.the.same']],
      ['multi-line files', ['test/.env.multiple', 'test/.env.multiple.the.same']],
      ['three files', ['test/.env.base', 'test/.env.the.same', 'test/.env.the.same']],
      [
        'the same keys in another order',
        ['test/.env.multiple', 'test/.env.multiple.the.same.different.sort'],
      ],
      [
        'the same keys in the same order with --strict-order',
        ['--strict-order', 'test/.env.multiple', 'test/.env.multiple.the.same'],
      ],
    ])('%s', (_, args) => {
      expect(run(args, cwd)).toEqual(SAME);
    });

    it('treating a quoted multi-line value as one key', () => {
      const dir = projectWith({
        '.env': 'CERT="-----BEGIN-----\nBODY=abc\n-----END-----"\nA=1\n',
        '.env.example': 'CERT=\nA=\n',
      });
      expect(run(['.env', '.env.example'], dir)).toEqual(SAME);
    });

    it('for files given as absolute paths', () => {
      const dir = projectWith({ '.env': 'A=1\n', '.env.example': 'A=\n' });
      expect(run([path.join(dir, '.env'), path.join(dir, '.env.example')], cwd)).toEqual(SAME);
    });

    it.each([['.env.e2e'], ['.env.Production']])('for a file name like %s', (name) => {
      const dir = projectWith({ '.env': 'A=1\n', [name]: 'A=2\n' });
      expect(run(['.env', name], dir)).toEqual(SAME);
    });
  });

  describe('exits 1 and prints every problem when the keys differ', () => {
    it('a missing and an extra key', () => {
      expect(run(['test/.env.base', 'test/.env.not.the.same'], cwd)).toEqual({
        exitCode: 1,
        stderr: '',
        stdout: `Not every file has the same keys:
╔════════════════╤════════════════════════╗
║ test/.env.base │ test/.env.not.the.same ║
╟────────────────┼────────────────────────╢
║ AA             │                        ║
╟────────────────┼────────────────────────╢
║                │ BB                     ║
╚════════════════╧════════════════════════╝
`,
      });
    });

    it('the last of three files differing', () => {
      expect(run(['test/.env.base', 'test/.env.the.same', 'test/.env.not.the.same'], cwd)).toEqual({
        exitCode: 1,
        stderr: '',
        stdout: `Not every file has the same keys:
╔════════════════╤════════════════════╤════════════════════════╗
║ test/.env.base │ test/.env.the.same │ test/.env.not.the.same ║
╟────────────────┼────────────────────┼────────────────────────╢
║ AA             │ AA                 │                        ║
╟────────────────┼────────────────────┼────────────────────────╢
║                │                    │ BB                     ║
╚════════════════╧════════════════════╧════════════════════════╝
`,
      });
    });

    it('a key repeated in one file', () => {
      const dir = projectWith({ '.env': 'A=1\nA=2\n', '.env.example': 'A=\n' });
      expect(run(['.env', '.env.example'], dir)).toEqual({
        exitCode: 1,
        stdout: '.env has duplicate keys: A\n',
        stderr: '',
      });
    });

    it('the same keys in another order with --strict-order', () => {
      expect(
        run(
          ['--strict-order', 'test/.env.multiple', 'test/.env.multiple.the.same.different.sort'],
          cwd,
        ),
      ).toEqual({
        exitCode: 1,
        stdout:
          'test/.env.multiple.the.same.different.sort has the keys of test/.env.multiple' +
          ' in another order: expected CC, found DD\n',
        stderr: '',
      });
    });

    it('integer-like keys in another order with --strict-order', () => {
      const dir = projectWith({ '.env': 'B=1\n42=x\n', '.env.example': '42=\nB=\n' });
      expect(run(['--strict-order', '.env', '.env.example'], dir)).toEqual({
        exitCode: 1,
        stdout: '.env.example has the keys of .env in another order: expected B, found 42\n',
        stderr: '',
      });
    });
  });

  describe('exits 2 and explains on stderr when it cannot compare', () => {
    it.each([
      ['no files are given', []],
      ['one file is given', ['test/.env.base']],
    ])('%s', (_, args) => {
      expect(run(args, cwd)).toEqual({
        exitCode: 2,
        stdout: '',
        stderr: `guardian-of-env: expected at least two files\n${USAGE}`,
      });
    });

    it('an option is unknown', () => {
      const result = run(['--strict', 'test/.env.base', 'test/.env.the.same'], cwd);
      expect(result.exitCode).toBe(2);
      expect(result.stdout).toBe('');
      expect(result.stderr).toMatch(/^guardian-of-env: Unknown option '--strict'/);
      expect(result.stderr.endsWith(USAGE)).toBe(true);
    });

    it('a file cannot be read, naming each one', () => {
      expect(run(['test/.env.base', 'test/.env.missing', 'test'], cwd)).toEqual({
        exitCode: 2,
        stdout: '',
        stderr:
          'guardian-of-env: cannot read test/.env.missing (ENOENT)\n' +
          'guardian-of-env: cannot read test (EISDIR)\n',
      });
    });
  });
});
