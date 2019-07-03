import { table } from 'table';

/**
 * Colorful lost key
 *
 * @param {string} key
 */
export const colorfulLostKey = key => `\u001b[31m${key}\u001b[39m`;

/**
 * Draw table
 *
 * @param {Object} payload
 * @param {number} payload.fileNames
 * @param {number} payload.baseEnvKeys
 * @param {number} payload.envKeys
 */
export const draw = ({ fileNames, baseEnvKeys, envKeys }) => {
  const parametersMapping = baseEnvKeys.map((key) => {
    if (!envKeys.includes(key)) {
      const lostKey = colorfulLostKey(key);

      return [key, lostKey];
    }

    return [key, key];
  });

  return table([fileNames, ...parametersMapping]);
};
