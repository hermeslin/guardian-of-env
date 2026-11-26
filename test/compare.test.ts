import { describe, expect, it } from 'vitest';
import { compare } from '../src/compare.js';
import type { EnvFile } from '../src/envFile.js';

const env = (name: string, keys: string[], duplicates: string[] = []): EnvFile => ({
  name,
  keys,
  duplicates,
});

describe('compare', () => {
  it('finds no problems when every file has the same keys, in any order', () => {
    expect(
      compare([env('a', ['A', 'B']), env('b', ['B', 'A']), env('c', ['A', 'B'])], false),
    ).toEqual([]);
  });

  it('puts every key some file lacks into one table over all files, base keys first', () => {
    expect(
      compare([env('a', ['A', 'B', 'C']), env('b', ['A', 'D']), env('c', ['A', 'B', 'E'])], false),
    ).toEqual([
      {
        kind: 'keys',
        files: ['a', 'b', 'c'],
        rows: [
          { key: 'B', present: [true, false, true] },
          { key: 'C', present: [true, false, false] },
          { key: 'D', present: [false, true, false] },
          { key: 'E', present: [false, false, true] },
        ],
      },
    ]);
  });

  it('reports the duplicate keys of each file', () => {
    expect(compare([env('a', ['A', 'B'], ['B']), env('b', ['A', 'B'])], false)).toEqual([
      { kind: 'duplicates', file: 'a', keys: ['B'] },
    ]);
  });

  describe('with strictOrder', () => {
    it('reports the first key out of place in each file', () => {
      expect(
        compare(
          [env('a', ['A', 'B', 'C']), env('b', ['A', 'C', 'B']), env('c', ['C', 'A', 'B'])],
          true,
        ),
      ).toEqual([
        { kind: 'order', file: 'b', base: 'a', expected: 'B', found: 'C' },
        { kind: 'order', file: 'c', base: 'a', expected: 'A', found: 'C' },
      ]);
    });

    it('finds no problems when the order matches', () => {
      expect(compare([env('a', ['A', 'B']), env('b', ['A', 'B'])], true)).toEqual([]);
    });

    it('leaves order out for a file whose keys differ', () => {
      expect(compare([env('a', ['A', 'B']), env('b', ['B'])], true)).toEqual([
        { kind: 'keys', files: ['a', 'b'], rows: [{ key: 'A', present: [true, false] }] },
      ]);
    });
  });

  it('lists the key table first, then duplicates, then order, each in file order', () => {
    expect(
      compare([env('a', ['A', 'B'], ['B']), env('b', ['B', 'A'], ['A']), env('c', ['A'])], true),
    ).toEqual([
      { kind: 'keys', files: ['a', 'b', 'c'], rows: [{ key: 'B', present: [true, true, false] }] },
      { kind: 'duplicates', file: 'a', keys: ['B'] },
      { kind: 'duplicates', file: 'b', keys: ['A'] },
      { kind: 'order', file: 'b', base: 'a', expected: 'A', found: 'B' },
    ]);
  });
});
