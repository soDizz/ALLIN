import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  target: 'es2020',
  format: ['cjs', 'esm'],
  banner: { js: '"use client";' },
});
