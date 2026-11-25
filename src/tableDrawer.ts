import type { ArrayChange } from 'diff';
import { table } from 'table';

export interface DrawPayload {
  fileNames: string[];
  diffs: ArrayChange<string>[];
}

export const colorfulLostKey = (key: string) => `\u001b[31m${key}\u001b[39m`;

export const colorfulSavedKey = (key: string) => `\u001b[32m${key}\u001b[39m`;

export const draw = ({ fileNames, diffs }: DrawPayload): string => {
  const parametersMapping: string[][] = [];
  diffs.forEach((part) => {
    const { added, removed, value } = part;
    if (added) {
      value.forEach((key) => {
        parametersMapping.push([colorfulSavedKey(key), '']);
      });
    } else if (removed) {
      value.forEach((key) => {
        parametersMapping.push([colorfulLostKey(key), key]);
      });
    } else {
      value.forEach((key) => {
        parametersMapping.push([key, key]);
      });
    }
  });

  return table([fileNames, ...parametersMapping]);
};
