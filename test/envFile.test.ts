import { isDeepStrictEqual } from 'node:util';
import dotenv from 'dotenv';
import { describe, expect, it } from 'vitest';
import { parseEnvFile, scanKeys } from '../src/envFile.js';

const TOKENS = [
  ...['A=', 'B=', 'A="', "B='", 'A=`', 'export ', 'a.b-1:', 'x', ' ', '\t'],
  ...['\n', '\r\n', '\r', '#', '"', "'", '`', '\\', '\\"'],
];

const generatedEnvFiles = (count: number): string[] => {
  let state = 1;
  const next = (below: number) => {
    state = (Math.imul(state, 1103515245) + 12345) >>> 0;
    return (state >>> 16) % below;
  };
  return Array.from({ length: count }, () =>
    Array.from({ length: next(30) }, () => TOKENS[next(TOKENS.length)]).join(''),
  );
};

describe('scanKeys', () => {
  it('finds the same keys as dotenv.parse in 5,000 generated files', () => {
    const disagreements = generatedEnvFiles(5_000).filter(
      (content) =>
        !isDeepStrictEqual(new Set(scanKeys(content)), new Set(Object.keys(dotenv.parse(content)))),
    );
    expect(disagreements).toEqual([]);
  });
});

describe('parseEnvFile', () => {
  it('lists the keys in file order', () => {
    expect(parseEnvFile('.env', 'B=1\nA=2\n')).toEqual({
      name: '.env',
      keys: ['B', 'A'],
      duplicates: [],
    });
  });

  it('keeps integer-like keys in file order', () => {
    expect(parseEnvFile('.env', 'B=1\n42=x\nA=2\n7=y\n').keys).toEqual(['B', '42', 'A', '7']);
  });

  it('lists each key that appears more than once', () => {
    expect(parseEnvFile('.env', 'A=1\nB=2\nA=3\nB=4\nA=5\n')).toEqual({
      name: '.env',
      keys: ['A', 'B'],
      duplicates: ['A', 'B'],
    });
  });

  it('reports only real keys as duplicates, so a repeated __proto__ line is ignored like dotenv ignores it', () => {
    expect(parseEnvFile('.env', '__proto__=1\n__proto__=2\nA=1\n')).toEqual({
      name: '.env',
      keys: ['A'],
      duplicates: [],
    });
  });

  it('reads a quoted multi-line value as one key, even when a line in it looks like a key', () => {
    expect(parseEnvFile('.env', 'CERT="-----BEGIN-----\nA=1\n-----END-----"\nA=2\n')).toEqual({
      name: '.env',
      keys: ['CERT', 'A'],
      duplicates: [],
    });
  });

  it('reads past an escaped quote inside a value', () => {
    expect(parseEnvFile('.env', 'A="say \\"B=1\\""\nB=2\n')).toEqual({
      name: '.env',
      keys: ['A', 'B'],
      duplicates: [],
    });
  });

  it('skips comments and blank lines, accepts export and colons, and reads CRLF files', () => {
    expect(parseEnvFile('.env', 'export A=1\r\n# B=2\r\n\r\nC: 3\r\nD=4 # E=5\r\n')).toEqual({
      name: '.env',
      keys: ['A', 'C', 'D'],
      duplicates: [],
    });
  });
});
