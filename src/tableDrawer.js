import { table } from 'table';

/**
 * Colorful lost key
 *
 * @param {string} key
 */
export const colorfulLostKey = (key) => `\u001b[31m${key}\u001b[39m`;

/**
 * Colorful saved key
 *
 * @param {string} key
 */
export const colorfulSavedKey = (key) => `\u001b[32m${key}\u001b[39m`;

/**
 * Draw table
 *
 * @param {Object} payload
 * @param {number} payload.fileNames
 * @param {number} payload.baseEnvKeys
 * @param {number} payload.envKeys
 */
export const draw = ({ fileNames, diffs }) => {
  const parametersMapping = [];
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
      // normal row
      value.forEach((key) => {
        parametersMapping.push([key, key]);
      });
    }
  });

  return table([fileNames, ...parametersMapping]);
};
