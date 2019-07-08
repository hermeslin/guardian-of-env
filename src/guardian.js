import * as envs from './envs';
import EnvFilesNotEqualError from './errors/EnvFilesNotEqualError';
import { draw as tableDrawer } from './tableDrawer';

/**
 * highlight file name
 *
 * @param {string} fileName file name
 */
export const highlightFile = fileName => `\u001b[32m${fileName}\u001b[39m`;

/**
 * parse process args
 *
 * @param {array} args process args
 */
export const parseArgs = (args) => {
  const strictCommand = '--strict';

  const isStrict = args.includes(strictCommand);
  const envArgs = args.filter(arg => arg !== strictCommand);
  const envList = envs.list(envArgs);

  return {
    args: envArgs,
    strict: isStrict,
    files: envs.readFile(envList),
  };
};

/**
 * start compare enf files
 *
 * @param {Object} parseArgs
 * @param {array} parseArgs.args
 * @param {boolean} parseArgs.strict
 * @param {array} parseArgs.files
 */
export const startCompare = ({ args: envArgs, ...envFiles }) => {
  try {
    envs.compare(envFiles);

    return {
      same: true,
      messages: [
        '.env files all the same!',
      ],
    };
  } catch (error) {
    const argFiles = (envArgs.length > 0) ? envArgs : envs.defaultEnvFiles;

    switch (error.constructor) {
      case EnvFilesNotEqualError:
        return {
          same: false,
          messages: [
            `${highlightFile(argFiles.join(' '))} not the same`,
            tableDrawer(error.payload),
          ],
        };
      default:
        throw error;
    }
  }
};
