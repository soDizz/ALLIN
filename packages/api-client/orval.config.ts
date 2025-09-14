import { defineConfig } from 'orval';

export default defineConfig({
  allin: {
    input: './allin-backend-spec.json',
    output: {
      target: './src/generated/endpoint.ts',
      client: 'axios',
      mode: 'single',
      biome: true,
      override: {
        mutator: {
          path: './src/mutator/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
  'allin-zod': {
    input: './allin-backend-spec.json',
    output: {
      target: './src/generated/schemas.zod.ts',
      client: 'zod',
      mode: 'single',
      biome: true,
    },
  },
});
