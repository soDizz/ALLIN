import fs from 'node:fs/promises';
import path from 'node:path';
import inquirer from 'inquirer';

const questions = [
  {
    type: 'input',
    name: 'slug',
    message: 'MCP 서버 플러그인 이름을 입력해주세요. (띄어쓰기는 _ 로 대체됩니다.)',
    filter: input => {
      return input.toLowerCase().replace(/\s+/g, '_');
    },
  },
  {
    type: 'input',
    name: 'description',
    message: '플러그인 설명을 입력해주세요.',
    default: answers => `MCP server for ${answers.slug} with AI SDK`,
  },
];

const getConfig = (slug, description) => {
  const pascalCaseName = changeToPascal(slug);

  // package.json
  const packageJson = {
    name: `@mcp-server/${slug}`,
    description: description,
    version: '1.0.0',
    type: 'module',
    files: ['dist'],
    exports: {
      '.': {
        types: './dist/index.d.ts',
        import: './dist/index.js',
        require: './dist/index.cjs',
        default: './dist/index.cjs',
      },
    },
    scripts: {
      dev: 'tsup --watch',
      build: 'tsup',
      test: 'vitest',
    },
    dependencies: {
      '@agentic/ai-sdk': 'catalog:ai',
      '@agentic/core': 'catalog:ai',
      ai: 'catalog:ai',
      dotenv: 'catalog:utils',
      zod: 'catalog:utils',
      rxjs: 'catalog:utils',
      ky: 'catalog:utils',
    },
    devDependencies: {
      vitest: '^3.1.4',
    },
    keywords: [],
    author: '',
    license: 'ISC',
  };

  // tsconfig.json
  const tsconfig = {
    extends: '../../../tsconfig.json',
    compilerOptions: {
      baseUrl: '.',
    },
    include: ['src'],
  };

  // tsup.config.ts
  const tsupConfig = `import { defineConfig } from 'tsup';

export default defineConfig(options => ({
  entry: ['src/index.ts'],
  clean: true,
  target: 'es2022',
  format: ['cjs', 'esm'],
  dts: true,
  minify: !options.watch,
}));`;

  // vitest.config.js
  const vitestConfig = `export default {
  test: {
    // In test code, we use really call ${pascalCaseName} API, so it takes time to complete.
    testTimeout: 20000,
  },
};`;

  // src/index.ts
  const indexTs = `export { ${pascalCaseName}Client } from './${pascalCaseName}Client';`;

  // src/[Name]Client.ts
  const clientTs = `import { aiFunction, AIFunctionsProvider, assert } from '@agentic/core';
import {
  // Import your schemas here
} from './${slug}';
import z from 'zod';
import ky, { type KyInstance } from 'ky';

export type ${pascalCaseName}ClientConfig = {
  token: string;
  // Add other config properties as needed
};

export class ${pascalCaseName}Client extends AIFunctionsProvider {
  private api: KyInstance;
  private token: string;

  constructor({ token }: ${pascalCaseName}ClientConfig) {
    assert(token, '${slug} Token is required');

    super();
    this.api = ky.create({
      prefixUrl: 'https://api.${slug}.com/', // Update with actual API URL
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
    this.token = token;
  }

  @aiFunction({
    name: 'example_${slug}_function',
    description: 'Example function for ${slug} integration.',
    inputSchema: z.object({
      message: z.string().describe('Message to send'),
    }),
  })
  async exampleFunction({
    message,
  }: z.infer<typeof z.object({ message: z.string() })>): Promise<{ success: boolean; message: string }> {
    console.log('Example function called with:', message);
    
    // TODO: Implement your API call here
    // const response = await this.api.post('endpoint', {
    //   json: { message },
    // }).json();
    
    return {
      success: true,
      message: \`Processed: \${message}\`,
    };
  }
}`;

  // src/[slug].ts (schemas file)
  const schemasTs = `import { z } from 'zod';

//<--------------------------------------------------------------------->
// Schemas for ${pascalCaseName} API Objects
//<--------------------------------------------------------------------->

// Example schema - replace with actual API response schemas
export const ExampleResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.record(z.unknown()).optional(),
});

export type ExampleResponse = z.infer<typeof ExampleResponseSchema>;

// Input schemas for AI functions
export const ExampleInputSchema = z.object({
  message: z.string().describe('Message to process'),
});

export type ExampleInput = z.infer<typeof ExampleInputSchema>;`;

  // README.md
  const readme = `# @mcp-server/${slug}

This package provides a robust, type-safe ${pascalCaseName} client designed for integration with AI agents, built on top of \`@agentic/core\`. It offers a suite of methods for interacting with the ${pascalCaseName} API, all of which are exposed as AI-callable functions.

** It optimizes API response for less token usage. **
So, you can use it as a tool for AI agents without any additional processing.

## How to get ${pascalCaseName} API Token

1. Go to ${pascalCaseName} developer portal
2. Create a new app
3. Generate API token
4. Copy the token

## Features

- **AI-Ready:** All public methods are decorated with \`@aiFunction\`, making them instantly available to AI agents.
- **Type-Safe:** Leverages \`zod\` to validate API responses, ensuring data integrity and providing strong type safety.
- **Modern Asynchronous API:** Built with \`async/await\` and modern JavaScript features.

## Test Code (optional)

This package has a test code that tests the client. To run the test, you need to set the following environment variables. (\`.env\` file)

- \`${slug.toUpperCase()}_TOKEN\`

## Usage

\`\`\`typescript
import { ${pascalCaseName}Client } from '@mcp-server/${slug}';

const client = new ${pascalCaseName}Client({
  token: 'your-api-token',
});

// Use with AI agents
const result = await client.exampleFunction({
  message: 'Hello, world!',
});
\`\`\`
`;

  // Test file
  const testFile = `import { describe, it, expect, beforeEach } from 'vitest';
import { ${pascalCaseName}Client } from '../${pascalCaseName}Client';
import dotenv from 'dotenv';

dotenv.config();

/**
 * important:
 * ** To run this test, you need to set the following environment variables. (\`.env\` file)
 * - \`${slug.toUpperCase()}_TOKEN\`
 */
describe('${pascalCaseName}Client', () => {
  it('should be defined', () => {
    expect(${pascalCaseName}Client).toBeDefined();
  });

  it('if token is empty, it should throw an error', () => {
    expect(() => new ${pascalCaseName}Client({ token: '' })).toThrow();
  });

  describe('${pascalCaseName} API test', () => {
    let client: ${pascalCaseName}Client;

    beforeEach(() => {
      if (!process.env.${slug.toUpperCase()}_TOKEN) {
        throw new Error('${slug.toUpperCase()}_TOKEN must be set');
      }

      client = new ${pascalCaseName}Client({
        token: process.env.${slug.toUpperCase()}_TOKEN,
      });
    });

    it('should be able to call example function', async () => {
      const response = await client.exampleFunction({
        message: 'test message',
      });
      expect(response.success).toBe(true);
    });
  });
});`;

  return {
    packageJson,
    tsconfig,
    tsupConfig,
    vitestConfig,
    indexTs,
    clientTs,
    schemasTs,
    readme,
    testFile,
  };
};

const projectRoot = path.resolve();
const dirPath = slug => path.join(projectRoot, `packages/mcp_server/${slug}`);
const changeToPascal = slug => {
  if (!slug || typeof slug !== 'string') return '';
  return slug
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

const createDirectory = async (slug, description) => {
  try {
    const {
      packageJson,
      tsconfig,
      tsupConfig,
      vitestConfig,
      indexTs,
      clientTs,
      schemasTs,
      readme,
      testFile,
    } = getConfig(slug, description);

    const componentDir = dirPath(slug);
    const srcPath = path.join(componentDir, 'src');
    const testPath = path.join(srcPath, 'test');
    const pascalFileName = changeToPascal(slug);

    // Create directories
    await fs.mkdir(componentDir, { recursive: true });
    await fs.mkdir(srcPath, { recursive: true });
    await fs.mkdir(testPath, { recursive: true });

    // Create files
    await fs.writeFile(
      path.join(componentDir, 'package.json'),
      JSON.stringify(packageJson, null, 2),
    );
    await fs.writeFile(path.join(componentDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));
    await fs.writeFile(path.join(componentDir, 'tsup.config.ts'), tsupConfig);
    await fs.writeFile(path.join(componentDir, 'vitest.config.js'), vitestConfig);
    await fs.writeFile(path.join(componentDir, 'README.md'), readme);

    // Source files
    await fs.writeFile(path.join(srcPath, 'index.ts'), indexTs);
    await fs.writeFile(path.join(srcPath, `${pascalFileName}Client.ts`), clientTs);
    await fs.writeFile(path.join(srcPath, `${slug}.ts`), schemasTs);

    // Test file
    await fs.writeFile(path.join(testPath, `${pascalFileName}Client.test.ts`), testFile);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const prettyLog = slug => {
  console.log('\n ✅ MCP 서버 플러그인이 성공적으로 생성되었습니다!');
  console.log(`📁 위치: ${dirPath(slug)}`);
  console.log(`📦 패키지 이름: @mcp-server/${slug}`);
  console.log('\n🚀 다음 단계:');
  console.log(`1. cd ${dirPath(slug)}`);
  console.log(`2. API 스키마를 src/${slug}.ts 파일에 정의하세요`);
  console.log(`3. src/${changeToPascal(slug)}Client.ts 파일에 실제 API 호출 로직을 구현하세요`);
  console.log('4. npm run dev 로 개발 모드를 시작하세요');
};

async function createProject() {
  try {
    const answers = await inquirer.prompt(questions);
    const { slug, description } = answers;

    const success = await createDirectory(slug, description);

    if (success) {
      prettyLog(slug);
    }
  } catch (error) {
    console.error(error);
  }
}

createProject();
