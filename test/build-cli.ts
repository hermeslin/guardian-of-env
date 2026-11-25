import { execFileSync } from 'node:child_process';

export default function setup() {
  execFileSync('npm', ['run', 'build', '--silent'], { stdio: 'inherit' });
}
