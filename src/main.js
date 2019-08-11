#!/usr/bin/env node
import { parseArgs, startCompare } from './guardian';

const [, , ...args] = process.argv;
const envFiles = parseArgs(args);
const compareResult = startCompare(envFiles);

compareResult.messages.forEach((message) => console.log(message));

process.exitCode = (compareResult.same) ? 0 : 1;
