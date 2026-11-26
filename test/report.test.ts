import { describe, expect, it } from 'vitest';
import { report } from '../src/report.js';

describe('report', () => {
  it('draws a column per file and a row per key some file lacks', () => {
    expect(
      report([
        {
          kind: 'keys',
          files: ['.env', '.env.example'],
          rows: [
            { key: 'API_KEY', present: [true, false] },
            { key: 'DEBUG', present: [false, true] },
          ],
        },
      ]),
    ).toBe(`Not every file has the same keys:
╔═════════╤══════════════╗
║ .env    │ .env.example ║
╟─────────┼──────────────╢
║ API_KEY │              ║
╟─────────┼──────────────╢
║         │ DEBUG        ║
╚═════════╧══════════════╝
`);
  });

  it('names a file with duplicate keys', () => {
    expect(report([{ kind: 'duplicates', file: '.env', keys: ['A', 'B'] }])).toBe(
      '.env has duplicate keys: A, B\n',
    );
  });

  it('names the first key out of place', () => {
    expect(
      report([{ kind: 'order', file: '.env.ci', base: '.env', expected: 'B', found: 'C' }]),
    ).toBe('.env.ci has the keys of .env in another order: expected B, found C\n');
  });

  it('prints the problems in the order given', () => {
    expect(
      report([
        { kind: 'duplicates', file: '.env.ci', keys: ['A'] },
        { kind: 'order', file: '.env.ci', base: '.env', expected: 'B', found: 'C' },
      ]),
    ).toBe(
      '.env.ci has duplicate keys: A\n' +
        '.env.ci has the keys of .env in another order: expected B, found C\n',
    );
  });
});
