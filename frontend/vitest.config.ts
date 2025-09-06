import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: [
      'node_modules/**',
      'e2e/**',
      'dist/**'
    ],
    globals: true,
    setupFiles: []
  }
});
