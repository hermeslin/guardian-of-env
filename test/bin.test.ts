import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const BIN = path.resolve('dist/main.js');

const exec = (args: string[], env: NodeJS.ProcessEnv = process.env) => {
  const { status, stdout, stderr } = spawnSync(process.execPath, [BIN, ...args], {
    encoding: 'utf8',
    env,
  });
  return { exitCode: status, stdout, stderr };
};

const withoutForceColor = () =>
  Object.fromEntries(Object.entries(process.env).filter(([name]) => name !== 'FORCE_COLOR'));

describe('the guardian-of-env bin', () => {
  it('exits 0 with the verdict on stdout when the keys match', () => {
    expect(exec(['test/.env.base', 'test/.env.the.same'])).toEqual({
      exitCode: 0,
      stdout: '.env files all the same!\n',
      stderr: '',
    });
  });

  it('exits 1 with the report on stdout when the keys differ', () => {
    const result = exec(['test/.env.base', 'test/.env.not.the.same']);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toMatch(/^Not every file has the same keys:\n/);
    expect(result.stderr).toBe('');
  });

  it('exits 2 with the usage on stderr when it cannot compare', () => {
    const result = exec(['test/.env.base']);
    expect(result.exitCode).toBe(2);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('Usage: guardian-of-env');
  });

  it('prints no colors when its output is piped', () => {
    const result = exec(['test/.env.base', 'test/.env.not.the.same'], withoutForceColor());
    expect(result.stdout).not.toContain('\u001b[');
  });

  it('colors file names when FORCE_COLOR is set', () => {
    const result = exec(['test/.env.base', 'test/.env.not.the.same'], {
      ...process.env,
      FORCE_COLOR: '1',
    });
    expect(result.stdout).toContain('\u001b[32mtest/.env.base\u001b[39m');
  });
});
