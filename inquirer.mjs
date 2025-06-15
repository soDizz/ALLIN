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
      test: 'vitest run',
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

  return {
    packageJson,
    tsconfig,
    tsupConfig,
    vitestConfig,
    readme,
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
    const { packageJson, tsconfig, tsupConfig, vitestConfig, readme } = getConfig(
      slug,
      description,
    );

    const componentDir = dirPath(slug);
    const srcPath = path.join(componentDir, 'src');

    // Create directories
    await fs.mkdir(componentDir, { recursive: true });
    await fs.mkdir(srcPath, { recursive: true });

    // Create files
    await fs.writeFile(
      path.join(componentDir, 'package.json'),
      JSON.stringify(packageJson, null, 2),
    );
    await fs.writeFile(path.join(componentDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));
    await fs.writeFile(path.join(componentDir, 'tsup.config.ts'), tsupConfig);
    await fs.writeFile(path.join(componentDir, 'vitest.config.js'), vitestConfig);
    await fs.writeFile(path.join(componentDir, 'README.md'), readme);

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
  console.log('2. src/ 디렉토리에 필요한 파일들을 추가하세요');
  console.log('3. npm run dev 로 개발 모드를 시작하세요');
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
