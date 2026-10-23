import {
  readJson,
  readProjectConfiguration,
  type ProjectConfiguration,
  type Tree,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { landingPageGenerator } from './landing-page';

// Soya Nights' tagline has an apostrophe, which the templates must escape.
const slug = 'soya-nights';
const root = `apps/${slug}`;

describe('landing-page generator', () => {
  let tree: Tree;
  let project: ProjectConfiguration;

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    await landingPageGenerator(tree, { slug });
    project = readProjectConfiguration(tree, slug);
  }, 60_000);

  const read = (file: string) => tree.read(file, 'utf-8') ?? '';

  it('builds static, prerendered output served under /<slug>/', () => {
    const options = project.targets?.['build']?.options;

    expect(options).toMatchObject({
      outputPath: { base: `dist/apps/${slug}`, browser: slug },
      baseHref: `/${slug}/`,
      outputMode: 'static',
      styles: [`${root}/src/theme.css`],
    });
    expect(options).not.toHaveProperty('ssr');
    expect(tree.exists(`${root}/src/server.ts`)).toBe(false);
  });

  it('serves the build on its own port at the production path', () => {
    expect(project.targets?.['serve-static']?.options).toMatchObject({
      staticFilePath: `dist/apps/${slug}`,
      spa: false,
      port: 4309,
    });
    expect(read(`${root}-e2e/playwright.config.mts`)).toContain(
      "new URL('/soya-nights/', origin)",
    );
  });

  it('tags the app as a landing page with the mt prefix', () => {
    expect(project.tags).toEqual(['type:landing']);
    expect(project.prefix).toBe('mt');
  });

  it('sets the app up for Ndop UI with its own config', () => {
    expect(readJson(tree, `${root}/ndop.json`)).toMatchObject({
      tailwind: { css: 'src/theme.css' },
      aliases: { ui: 'src/app/ui' },
    });
    expect(readJson(tree, `${root}/.postcssrc.json`)).toEqual({
      plugins: { '@tailwindcss/postcss': {} },
    });
    expect(read(`${root}/src/theme.css`)).toContain(
      "@import '@ndop/core/styles.css';",
    );
    expect(read(`${root}/src/app/app.config.ts`)).toContain('provideNdop()');
  });

  it('writes the page meta, content and footer from the manifest', () => {
    expect(read(`${root}/src/app/app.config.server.ts`)).toContain(
      "provideLandingMeta('soya-nights')",
    );
    expect(read(`${root}/src/app/app.config.ts`)).not.toContain(
      'provideLandingMeta',
    );
    expect(read(`${root}/src/app/content.ts`)).toContain(
      `"Yaoundé's weekly night market of soya grills and plantains."`,
    );
    expect(read(`${root}/src/app/app.html`)).toContain(
      '<mt-series-footer slug="soya-nights" />',
    );
  });

  it('leaves the router out of a single-route page', () => {
    expect(tree.exists(`${root}/src/app/app.routes.ts`)).toBe(false);
    expect(read(`${root}/src/app/app.config.ts`)).not.toContain(
      'provideRouter',
    );
  });

  it('starts with a hero section and no Nx boilerplate', () => {
    expect(
      tree.exists(`${root}/src/app/sections/hero-section/hero-section.ts`),
    ).toBe(true);
    expect(tree.exists(`${root}/src/app/nx-welcome.ts`)).toBe(false);
    expect(tree.exists(`${root}/src/styles.css`)).toBe(false);
  });

  it('adds e2e tests with axe and an ESM-ready tsconfig', () => {
    expect(read(`${root}-e2e/src/a11y.spec.ts`)).toContain('AxeBuilder');
    expect(tree.exists(`${root}-e2e/src/example.spec.ts`)).toBe(false);
    expect(
      readJson(tree, `${root}-e2e/tsconfig.json`).compilerOptions,
    ).toMatchObject({
      module: 'esnext',
      types: ['node'],
    });
  });

  it('leaves the strict compiler options to the base tsconfig', () => {
    const { compilerOptions } = readJson(tree, `${root}/tsconfig.json`);

    expect(compilerOptions).not.toHaveProperty('strict');
  });

  it('adds Ndop, the CDK and Tailwind to the workspace', () => {
    const { dependencies, devDependencies } = readJson(tree, 'package.json');

    expect(dependencies).toMatchObject({
      '@ndop/core': '^1.1.0',
      '@angular/cdk': '~22.2.0',
      tailwindcss: '^4.3.3',
    });
    expect(devDependencies).toMatchObject({ '@ndop/cli': '^1.1.0' });
  });

  it('leaves out the Express server that Angular SSR adds', () => {
    const { dependencies = {}, devDependencies = {} } = readJson(
      tree,
      'package.json',
    );

    expect(dependencies).not.toHaveProperty('express');
    expect(devDependencies).not.toHaveProperty('@types/express');
  });

  it('refuses a slug that is not in the manifest', async () => {
    await expect(
      landingPageGenerator(createTreeWithEmptyWorkspace(), { slug: 'nope' }),
    ).rejects.toThrow('"nope" is not in libs/pages-manifest');
  });

  it('refuses to overwrite an existing app', async () => {
    await expect(landingPageGenerator(tree, { slug })).rejects.toThrow(
      `${root} already exists.`,
    );
  });
});
