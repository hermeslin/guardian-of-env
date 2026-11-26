import { describe, expect, it } from 'vitest';
import { parseEnvFile } from '../src/envFile.js';

describe('parseEnvFile', () => {
  it('lists the keys in file order', () => {
    expect(parseEnvFile('.env', 'B=1\nA=2\n')).toEqual({
      name: '.env',
      keys: ['B', 'A'],
      duplicates: [],
    });
  });

  it('lists each key that appears more than once', () => {
    expect(parseEnvFile('.env', 'A=1\nB=2\nA=3\nB=4\nA=5\n')).toEqual({
      name: '.env',
      keys: ['A', 'B'],
      duplicates: ['A', 'B'],
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
