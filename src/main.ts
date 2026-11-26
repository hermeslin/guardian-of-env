#!/usr/bin/env node
import { run } from './cli.js';

const { exitCode, stdout, stderr } = run(process.argv.slice(2), process.cwd());
process.stdout.write(stdout);
process.stderr.write(stderr);
process.exitCode = exitCode;
