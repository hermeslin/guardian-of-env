import { execFileSync } from 'node:child_process';

// test/cli.test.ts runs the built CLI, so build it once before any test file runs.
export default function setup() {
  execFileSync('npm', ['run', 'build', '--silent'], { stdio: 'inherit' });
}
