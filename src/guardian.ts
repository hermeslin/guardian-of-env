import * as envs from './envs.js';
import EnvFilesNotEqualError from './errors/EnvFilesNotEqualError.js';
import { draw as tableDrawer } from './tableDrawer.js';

export interface ParsedArgs {
  args: string[];
  strict: boolean;
  files: envs.EnvFile[];
}

export interface CompareResult {
  same: boolean;
  messages: string[];
}

export const highlightFile = (fileName: string) => `\u001b[32m${fileName}\u001b[39m`;

export const parseArgs = (args: string[]): ParsedArgs => {
  const envList = envs.list(args);

  return {
    args,
    strict: true,
    files: envs.readFile(envList),
  };
};

export const startCompare = ({ args: envArgs, ...envFiles }: ParsedArgs): CompareResult => {
  try {
    envs.compare(envFiles);

    return {
      same: true,
      messages: ['.env files all the same!'],
    };
  } catch (error) {
    if (!(error instanceof EnvFilesNotEqualError)) throw error;

    const argFiles = envArgs.length > 0 ? envArgs : envs.defaultEnvFiles;
    return {
      same: false,
      messages: [`${highlightFile(argFiles.join(' '))} not the same`, tableDrawer(error.payload)],
    };
  }
};
