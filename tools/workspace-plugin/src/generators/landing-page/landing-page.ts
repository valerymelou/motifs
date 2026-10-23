import { findPage, PAGES } from '@motifs/pages-manifest';
import { applicationGenerator } from '@nx/angular/generators';
import {
  addDependenciesToPackageJson,
  formatFiles,
  generateFiles,
  getPackageManagerCommand,
  installPackagesTask,
  readProjectConfiguration,
  runTasksInSerial,
  updateJson,
  updateProjectConfiguration,
  type GeneratorCallback,
  type Tree,
} from '@nx/devkit';
import { execSync } from 'node:child_process';
import * as path from 'node:path';
import type { LandingPageGeneratorSchema } from './schema';

// Each page serves on its own port, so e2e suites can run side by side.
const FIRST_PORT = 4301;

// Versions from ADR-0001.
const DEPENDENCIES = {
  '@angular/cdk': '~22.2.0',
  '@ndop/core': '^1.1.0',
  '@ndop/primitives': '^1.1.0',
  '@tailwindcss/postcss': '^4.3.3',
  tailwindcss: '^4.3.3',
};
const DEV_DEPENDENCIES = { '@ndop/cli': '^1.1.0' };

// Already in the base tsconfig, where every project inherits them.
const BASE_COMPILER_OPTIONS = [
  'strict',
  'noImplicitOverride',
  'noPropertyAccessFromIndexSignature',
  'noImplicitReturns',
  'noFallthroughCasesInSwitch',
];

/**
 * Creates `apps/<slug>` and `apps/<slug>-e2e` for a page in the pages
 * manifest: a static, prerendered Angular app served under `/<slug>/`, set
 * up for Ndop UI as ADR-0002 describes, with a theme file, a sections folder,
 * a content file, a README and e2e tests with axe.
 */
export async function landingPageGenerator(
  tree: Tree,
  { slug }: LandingPageGeneratorSchema,
): Promise<GeneratorCallback> {
  const page = findPage(slug);
  if (!page) {
    throw new Error(
      `"${slug}" is not in libs/pages-manifest. Add the page there first.`,
    );
  }
  const root = `apps/${slug}`;
  if (tree.exists(root)) {
    throw new Error(`${root} already exists.`);
  }
  const port = FIRST_PORT + PAGES.indexOf(page);

  const installApp = await applicationGenerator(tree, {
    directory: root,
    name: slug,
    prefix: 'mt',
    style: 'css',
    ssr: true,
    e2eTestRunner: 'playwright',
    unitTestRunner: 'vitest-angular',
    linter: 'eslint',
    tags: 'type:landing',
    port,
    skipFormat: true,
  });

  configureStaticBuild(tree, slug, port);
  removeBoilerplate(tree, root);
  const substitutions = { ...page, port, json: JSON.stringify };
  generateFiles(tree, path.join(__dirname, 'files/app'), root, substitutions);
  generateFiles(
    tree,
    path.join(__dirname, 'files/e2e'),
    `${root}-e2e`,
    substitutions,
  );
  updateJson(tree, `${root}/tsconfig.json`, (tsconfig) => {
    for (const option of BASE_COMPILER_OPTIONS) {
      delete tsconfig.compilerOptions[option];
    }
    return tsconfig;
  });
  // The generated e2e tsconfig compiles to CommonJS, which rejects the
  // ESM Playwright config's import.meta.
  updateJson(tree, `${root}-e2e/tsconfig.json`, (tsconfig) => {
    tsconfig.compilerOptions.module = 'esnext';
    tsconfig.compilerOptions.types = ['node'];
    return tsconfig;
  });

  const installDependencies = addDependenciesToPackageJson(
    tree,
    DEPENDENCIES,
    DEV_DEPENDENCIES,
  );
  await formatFiles(tree);

  return runTasksInSerial(
    installApp,
    installDependencies,
    () => installPackagesTask(tree),
    () => addNdopBaseItems(tree.root, root),
  );
}

/** Static prerendered output under `/<slug>/`, as the site serves it. */
function configureStaticBuild(tree: Tree, slug: string, port: number): void {
  const project = readProjectConfiguration(tree, slug);
  const build = project.targets?.['build'];
  const serveStatic = project.targets?.['serve-static'];
  if (!build?.options || !serveStatic?.options) {
    throw new Error(`The generated ${slug} project has no build targets.`);
  }

  // The browser folder is named after the slug, so serving
  // dist/apps/<slug> answers at /<slug>/, the path it has in production.
  build.options.outputPath = { base: `dist/apps/${slug}`, browser: slug };
  build.options.baseHref = `/${slug}/`;
  build.options.outputMode = 'static';
  build.options.styles = [`apps/${slug}/src/theme.css`];
  delete build.options.ssr;

  serveStatic.options.staticFilePath = `dist/apps/${slug}`;
  serveStatic.options.spa = false;
  serveStatic.options.port = port;

  updateProjectConfiguration(tree, slug, project);
}

function removeBoilerplate(tree: Tree, root: string): void {
  for (const file of [
    'src/server.ts',
    'src/styles.css',
    'src/app/app.css',
    'src/app/nx-welcome.ts',
  ]) {
    tree.delete(`${root}/${file}`);
  }
  tree.delete(`${root}-e2e/src/example.spec.ts`);
}

/** Installs the default theme and Ndop's helper files into the app. */
function addNdopBaseItems(workspaceRoot: string, root: string): void {
  const { exec } = getPackageManagerCommand();
  execSync(`${exec} ndop add default utils icons --cwd ${root} --yes`, {
    cwd: workspaceRoot,
    stdio: 'inherit',
  });
}

export default landingPageGenerator;
