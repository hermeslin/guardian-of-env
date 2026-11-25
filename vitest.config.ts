import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    globalSetup: ['test/build-cli.ts'],
    testTimeout: 20_000,
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      // test/cli.test.ts runs the entry point in a child process, which v8 coverage cannot see.
      exclude: ['src/main.*'],
      thresholds: { 100: true },
    },
  },
});
