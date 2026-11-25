import { describe, expect, it } from 'vitest';
import { highlightFile, parseArgs, startCompare } from '../src/guardian.js';

const cwd = process.cwd();
const red = (text: string) => `\u001b[31m${text}\u001b[39m`;
const green = (text: string) => `\u001b[32m${text}\u001b[39m`;

describe('highlightFile', () => {
  it('wraps the text in green', () => {
    expect(highlightFile('.env')).toBe(green('.env'));
  });
});

describe('parseArgs', () => {
  it('keeps the arguments and reads each file relative to the cwd', () => {
    const parsed = parseArgs(['test/.env.base', 'test/.env.the.same']);

    expect(parsed.args).toEqual(['test/.env.base', 'test/.env.the.same']);
    expect(parsed.strict).toBe(true);
    expect(parsed.files.map((file) => file.path)).toEqual([
      `${cwd}/test/.env.base`,
      `${cwd}/test/.env.the.same`,
    ]);
    expect(parsed.files.map((file) => file.content.toString())).toEqual(['AA=A', 'AA=A']);
  });
});

describe('startCompare', () => {
  it('reports the files as the same when their keys match', () => {
    expect(startCompare(parseArgs(['test/.env.base', 'test/.env.the.same']))).toEqual({
      same: true,
      messages: ['.env files all the same!'],
    });
  });

  it('names the files and draws the key table when keys differ', () => {
    expect(startCompare(parseArgs(['test/.env.base', 'test/.env.not.the.same']))).toEqual({
      same: false,
      messages: [
        `${green('test/.env.base test/.env.not.the.same')} not the same`,
        [
          '╔═══════════╤═══════════════════╗',
          '║ .env.base │ .env.not.the.same ║',
          '╟───────────┼───────────────────╢',
          `║ ${red('BB')}        │ BB                ║`,
          '╟───────────┼───────────────────╢',
          `║ ${green('AA')}        │                   ║`,
          '╚═══════════╧═══════════════════╝',
          '',
        ].join('\n'),
      ],
    });
  });

  it('names the default files when no arguments were given', () => {
    const { files } = parseArgs(['test/.env.base', 'test/.env.not.the.same']);
    const { messages } = startCompare({ args: [], strict: true, files });

    expect(messages[0]).toBe(`${green('.env .env.example')} not the same`);
  });

  it('rethrows errors other than a key mismatch', () => {
    const files = [
      { path: '/project/.env', content: 'A=1' },
      { path: '/project/.env.e2e', content: 'A=1' },
    ];

    expect(() => startCompare({ args: [], strict: true, files })).toThrow(TypeError);
  });
});
