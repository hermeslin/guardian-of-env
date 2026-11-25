import { diffArrays } from 'diff';
import { describe, expect, it } from 'vitest';
import { colorfulLostKey, colorfulSavedKey, draw } from '../src/tableDrawer.js';

const red = (text: string) => `\u001b[31m${text}\u001b[39m`;
const green = (text: string) => `\u001b[32m${text}\u001b[39m`;

describe('colorful keys', () => {
  it('marks a lost key red and a saved key green', () => {
    expect(colorfulLostKey('AA')).toBe(red('AA'));
    expect(colorfulSavedKey('AA')).toBe(green('AA'));
  });
});

describe('draw', () => {
  const fileNames = ['.env', '.env-example'];

  it('draws one row per shared key', () => {
    const table = draw({ fileNames, diffs: diffArrays(['AA', 'BB'], ['AA', 'BB']) });

    expect(table).toBe(
      [
        '╔══════╤══════════════╗',
        '║ .env │ .env-example ║',
        '╟──────┼──────────────╢',
        '║ AA   │ AA           ║',
        '╟──────┼──────────────╢',
        '║ BB   │ BB           ║',
        '╚══════╧══════════════╝',
        '',
      ].join('\n'),
    );
  });

  it('colours keys that only one side has', () => {
    const table = draw({ fileNames, diffs: diffArrays(['AA', 'BB'], ['BB', 'CC']) });

    expect(table).toBe(
      [
        '╔══════╤══════════════╗',
        '║ .env │ .env-example ║',
        '╟──────┼──────────────╢',
        `║ ${red('AA')}   │ AA           ║`,
        '╟──────┼──────────────╢',
        '║ BB   │ BB           ║',
        '╟──────┼──────────────╢',
        `║ ${green('CC')}   │              ║`,
        '╚══════╧══════════════╝',
        '',
      ].join('\n'),
    );
  });
});
