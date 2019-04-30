#!/usr/bin/env node
import * as envs from './envs';

const [, , ...args] = process.argv;
const envList = envs.list(args);
const envFiles = envs.readFile(envList);

try {
  envs.compare(envFiles);
  console.log('.env files all the same!');
  process.exitCode = 0;
} catch (e) {
  console.log(`${args.join(', ')} not the same`);
  process.exitCode = 1;
}
