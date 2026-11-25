import path from 'node:path';
import { describe, expect, it } from 'vitest';
import EnvFilesNotEqualError from '../src/errors/EnvFilesNotEqualError.js';
import { compare, list, readFile } from '../src/envs.js';

const cwd = process.cwd();
const fixtures = (...names: string[]) => names.map((name) => path.resolve(cwd, 'test', name));

describe('list', () => {
  it('resolves the given file names against the cwd', () => {
    expect(list(['.env.krkr', '.env'])).toEqual([`${cwd}/.env.krkr`, `${cwd}/.env`]);
  });

  it('defaults to .env and .env.example', () => {
    expect(list()).toEqual([`${cwd}/.env`, `${cwd}/.env.example`]);
  });
});

describe('readFile', () => {
  it('returns each path with its raw content', () => {
    const files = readFile(fixtures('.env.base', '.env.not.the.same'));

    expect(files.map((file) => file.path)).toEqual(fixtures('.env.base', '.env.not.the.same'));
    expect(files.map((file) => file.content.toString())).toEqual(['AA=A', 'BB=B']);
  });
});

describe('compare', () => {
  it('returns true when every file has the same keys as the first', () => {
    expect(compare({ files: readFile(fixtures('.env.base', '.env.the.same')) })).toBe(true);
    expect(compare({ files: readFile(fixtures('.env.multiple', '.env.multiple.the.same')) })).toBe(true);
  });

  it('throws EnvFilesNotEqualError when a key is missing or extra', () => {
    expect(() => compare({ files: readFile(fixtures('.env.base', '.env.not.the.same')) })).toThrow(
      EnvFilesNotEqualError,
    );
    expect(() =>
      compare({ files: readFile(fixtures('.env.multiple', '.env.multiple.not.the.same')) }),
    ).toThrow(EnvFilesNotEqualError);
  });

  it('throws EnvFilesNotEqualError when the same keys appear in a different order', () => {
    expect(() =>
      compare({ files: readFile(fixtures('.env.multiple', '.env.multiple.the.same.different.sort')) }),
    ).toThrow(EnvFilesNotEqualError);
  });
});
