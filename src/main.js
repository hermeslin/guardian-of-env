#!/usr/bin/env node
import * as envs from './envs';

const [, , ...args] = process.argv;

let isStrict = false;
let envArgs = args;

if (args.includes('--strict')) {
  isStrict = true;
  envArgs = args.filter(arg => (arg !== '--strict'));
}

const envList = envs.list(envArgs);
const envFiles = envs.readFile(envList);

try {
  envs.compare(envFiles, isStrict);
  console.log('.env files all the same!');
  process.exitCode = 0;
} catch (e) {
  const argFiles = (envArgs.length > 0) ? envArgs : envs.defaultEnvFiles();
  console.log(`${argFiles.join(', ')} not the same`);
  process.exitCode = 1;
}
