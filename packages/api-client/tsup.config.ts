import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['server.ts'],
  clean: true,
  target: 'es2020',
  format: ['esm'],
});
