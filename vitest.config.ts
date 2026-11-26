import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    globalSetup: ['test/build-cli.ts'],
    testTimeout: 20_000,
    env: { FORCE_COLOR: '0' },
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: ['src/main.*'],
      thresholds: { 100: true },
    },
  },
});
