import type { EnvFile } from './envFile.js';

export type Problem =
  | { kind: 'keys'; files: string[]; rows: { key: string; present: boolean[] }[] }
  | { kind: 'duplicates'; file: string; keys: string[] }
  | { kind: 'order'; file: string; base: string; expected: string; found: string };

const keyProblem = (files: EnvFile[]): Problem[] => {
  const union = [...new Set(files.flatMap((file) => file.keys))];
  const sets = files.map((file) => new Set(file.keys));
  const rows = union
    .map((key) => ({ key, present: sets.map((set) => set.has(key)) }))
    .filter((row) => !row.present.every(Boolean));
  if (rows.length === 0) return [];
  return [{ kind: 'keys', files: files.map((file) => file.name), rows }];
};

const orderProblems = (base: EnvFile, others: EnvFile[]): Problem[] => {
  const baseKeys = new Set(base.keys);
  return others.flatMap((file): Problem[] => {
    const sameKeys =
      file.keys.length === base.keys.length && file.keys.every((key) => baseKeys.has(key));
    const at = file.keys.findIndex((key, i) => key !== base.keys[i]);
    if (!sameKeys || at === -1) return [];
    return [
      {
        kind: 'order',
        file: file.name,
        base: base.name,
        expected: base.keys[at],
        found: file.keys[at],
      },
    ];
  });
};

export const compare = (files: EnvFile[], strictOrder: boolean): Problem[] => {
  const [base, ...others] = files;
  return [
    ...keyProblem(files),
    ...files
      .filter((file) => file.duplicates.length > 0)
      .map((file): Problem => ({ kind: 'duplicates', file: file.name, keys: file.duplicates })),
    ...(strictOrder ? orderProblems(base, others) : []),
  ];
};
