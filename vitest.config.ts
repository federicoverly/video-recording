import { defineConfig, mergeConfig } from 'vite';
import type {} from 'vitest';
import viteConfig from './vite.config';

// https://vitejs.dev/config/, https://vitest.dev/config/
export default mergeConfig(
  viteConfig,
  defineConfig({
    root: 'packages',
    test: {
      coverage: {
        provider: 'c8',
        reporter: ['text-summary', 'lcov'],
        include: ['packages/**/*.{ts,tsx}'],
        exclude: [
          '**/*.d.ts',
          '**/*.spec.{ts,tsx}',
          '**/*.test.{ts,tsx}',
          '**/*.vite.config.ts',
          '**/*.vite-*.ts',
          '**/out/**',
          '*polyfill*.ts',
          '**/design-system/showcase/**',
          '**/mock-api/**',
          '**/testing/*',
          '**/utilities/testing/**'
        ],
        all: true
      },
      css: {
        include: [],
        modules: {
          classNameStrategy: 'non-scoped'
        }
      },
      exclude: ['**/node_modules/**', '**/{build,dist,out}/**', '**/.{idea,git,cache,temp}/**'],
      environment: 'jsdom',
      globals: true,
      open: false
    }
  })
);
