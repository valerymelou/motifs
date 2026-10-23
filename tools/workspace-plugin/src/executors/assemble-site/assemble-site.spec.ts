import type { ExecutorContext, ProjectConfiguration } from '@nx/devkit';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import executor, { sitemap } from './assemble-site';

function contextFor(
  root: string,
  projects: Record<string, ProjectConfiguration>,
): ExecutorContext {
  return {
    root,
    cwd: root,
    isVerbose: false,
    projectGraph: { nodes: {}, dependencies: {} },
    projectsConfigurations: { projects, version: 2 },
    nxJsonConfiguration: {},
  };
}

function app(
  name: string,
  outputPath: unknown,
  tags: string[] = [],
): ProjectConfiguration {
  return {
    name,
    root: `apps/${name}`,
    tags,
    targets: { build: { options: { outputPath } } },
  };
}

function fakeBuild(root: string, folder: string, html: string) {
  mkdirSync(join(root, folder), { recursive: true });
  writeFileSync(join(root, folder, 'index.html'), html);
}

describe('assemble-site executor', () => {
  let root: string;
  const read = (file: string) =>
    readFileSync(join(root, 'dist/site', file), 'utf-8');

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'motifs-site-'));
  });
  afterEach(() => rmSync(root, { recursive: true, force: true }));

  it('puts the index at the root and each page under its slug', async () => {
    fakeBuild(root, 'dist/apps/motifs/browser', 'index');
    fakeBuild(root, 'dist/apps/fil/fil', 'fil');
    const context = contextFor(root, {
      motifs: app('motifs', 'dist/apps/motifs'),
      fil: app('fil', { base: 'dist/apps/fil', browser: 'fil' }, [
        'type:landing',
      ]),
      'motifs-e2e': app('motifs-e2e', undefined),
    });

    const { success } = await executor({}, context);

    expect(success).toBe(true);
    expect(read('index.html')).toBe('index');
    expect(read('fil/index.html')).toBe('fil');
  });

  it('writes robots.txt, a 404 page and a sitemap without unlaunched pages', async () => {
    fakeBuild(root, 'dist/apps/motifs/browser', 'index');
    fakeBuild(root, 'dist/apps/fil/fil', 'fil');
    const context = contextFor(root, {
      motifs: app('motifs', 'dist/apps/motifs'),
      fil: app('fil', { base: 'dist/apps/fil', browser: 'fil' }, [
        'type:landing',
      ]),
    });

    await executor({}, context);

    expect(read('robots.txt')).toContain(
      'Sitemap: https://motifs.valerymelou.com/sitemap.xml',
    );
    expect(read('404.html')).toContain('<h1>Page not found</h1>');
    // Fil is still "soon" in the manifest.
    expect(read('sitemap.xml')).not.toContain('/fil/');
  });

  it('replaces whatever an earlier run left behind', async () => {
    fakeBuild(root, 'dist/apps/motifs/browser', 'index');
    fakeBuild(root, 'dist/site/old-page', 'stale');

    await executor(
      {},
      contextFor(root, { motifs: app('motifs', 'dist/apps/motifs') }),
    );

    expect(existsSync(join(root, 'dist/site/old-page'))).toBe(false);
  });

  it('fails when a page has not been built', async () => {
    fakeBuild(root, 'dist/apps/motifs/browser', 'index');
    const context = contextFor(root, {
      motifs: app('motifs', 'dist/apps/motifs'),
      fil: app('fil', { base: 'dist/apps/fil', browser: 'fil' }, [
        'type:landing',
      ]),
    });

    expect((await executor({}, context)).success).toBe(false);
  });

  it('fails for a tagged app that is not in the manifest', async () => {
    fakeBuild(root, 'dist/apps/motifs/browser', 'index');
    fakeBuild(root, 'dist/apps/nope/browser', 'nope');
    const context = contextFor(root, {
      motifs: app('motifs', 'dist/apps/motifs'),
      nope: app('nope', 'dist/apps/nope', ['type:landing']),
    });

    expect((await executor({}, context)).success).toBe(false);
  });
});

describe('sitemap', () => {
  it('lists the index and the given pages', () => {
    expect(sitemap(['fil'])).toContain(
      [
        '  <url><loc>https://motifs.valerymelou.com/</loc></url>',
        '  <url><loc>https://motifs.valerymelou.com/fil/</loc></url>',
      ].join('\n'),
    );
  });
});
