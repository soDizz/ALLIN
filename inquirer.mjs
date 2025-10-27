import fs from 'node:fs/promises';
import path from 'node:path';
import inquirer from 'inquirer';

const questions = [
  {
    type: 'input',
    name: 'slug',
    message: '플러그인 이름을 입력해주세요. (띄어쓰기는 _ 로 대체됩니다.)',
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
    name: `@allin-plugin/${slug}`,
    description: description,
    version: '0.0.1',
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
      zod: 'catalog:utils',
      rxjs: 'catalog:utils',
      ky: 'catalog:utils',
    },
    devDependencies: {
      vitest: 'catalog:test',
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

  return {
    packageJson,
    tsconfig,
    tsupConfig,
    readme,
  };
};

const projectRoot = path.resolve();
const dirPath = slug => path.join(projectRoot, `packages/plugins/${slug}`);
const changeToPascal = slug => {
  if (!slug || typeof slug !== 'string') return '';
  return slug
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

const createDirectory = async (slug, description) => {
  try {
    const { packageJson, tsconfig, tsupConfig, readme } = getConfig(
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
    await fs.writeFile(
      path.join(componentDir, 'tsconfig.json'),
      JSON.stringify(tsconfig, null, 2),
    );
    await fs.writeFile(path.join(componentDir, 'tsup.config.ts'), tsupConfig);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const prettyLog = slug => {
  console.log('\n ✅ 플러그인이 성공적으로 생성되었습니다!');
  console.log(`📁 위치: ${dirPath(slug)}`);
  console.log(`📦 패키지 이름: @allin-plugin/${slug}`);
  console.log('\n🚀 다음 단계:');
  console.log(`1. cd ${dirPath(slug)}`);
  console.log('2. src/ 디렉토리에 필요한 파일들을 추가하세요');
  console.log('3. pnpm dev 로 개발 모드를 시작하세요');
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
