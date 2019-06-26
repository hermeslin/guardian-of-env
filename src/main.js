#!/usr/bin/env node
import * as envs from './envs';

const [, , ...args] = process.argv;

const isStrict = args.includes('--strict');
const envArgs = args.filter(arg => arg !== '--strict');
const envList = envs.list(envArgs);
const envFiles = {
  strict: isStrict,
  files: envs.readFile(envList),
};

const highlightFile = fileName => `\u001b[32m${fileName}\u001b[39m`;

try {
  envs.compare(envFiles);

  console.log('.env files all the same!');

  process.exitCode = 0;
} catch (error) {
  const argFiles = (envArgs.length > 0) ? envArgs : envs.defaultEnvFiles;

  console.log(`${highlightFile(argFiles.join(' '))} not the same`);

  process.exitCode = 1;
}
