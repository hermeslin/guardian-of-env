import { styleText } from 'node:util';
import { table } from 'table';
import type { Problem } from './compare.js';

const green = (name: string): string => styleText('green', name);

const render = (problem: Problem): string => {
  switch (problem.kind) {
    case 'keys':
      return (
        'Not every file has the same keys:\n' +
        table([
          problem.files.map(green),
          ...problem.rows.map((row) => row.present.map((has) => (has ? row.key : ''))),
        ])
      );
    case 'duplicates':
      return `${green(problem.file)} has duplicate keys: ${problem.keys.join(', ')}\n`;
    case 'order':
      return `${green(problem.file)} has the keys of ${green(problem.base)} in another order: expected ${problem.expected}, found ${problem.found}\n`;
  }
};

export const report = (problems: Problem[]): string => problems.map(render).join('');
