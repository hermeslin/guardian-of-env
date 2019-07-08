#!/usr/bin/env node
import * as guardian from './guardian';

const [, , ...args] = process.argv;
const envFiles = guardian.parseArgs(args);
const compareResult = guardian.startCompare(envFiles);

compareResult.messages.forEach((message) => {
  console.log(message);
});

process.exitCode = (compareResult.same) ? 0 : 1;
