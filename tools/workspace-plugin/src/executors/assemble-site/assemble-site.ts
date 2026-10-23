import { findPage, SITE } from '@motifs/pages-manifest';
import { logger, type ExecutorContext, type PromiseExecutor } from '@nx/devkit';
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { AssembleSiteExecutorSchema } from './schema';

/**
 * Builds the deployable site: the index at the root, each landing page at
 * `/<slug>/`, plus `sitemap.xml`, `robots.txt` and `404.html`. The build
 * targets it copies from run first, through the target's `dependsOn`.
 */
const runExecutor: PromiseExecutor<AssembleSiteExecutorSchema> = async (
  {
    outputPath = 'dist/site',
    indexProject = 'motifs',
    pageTag = 'type:landing',
  },
  context,
) => {
  try {
    const site = join(context.root, outputPath);
    const pages = Object.entries(context.projectsConfigurations.projects)
      .filter(([, project]) => project.tags?.includes(pageTag))
      .map(([name]) => name)
      .sort();

    rmSync(site, { recursive: true, force: true });
    mkdirSync(site, { recursive: true });
    cpSync(browserOutput(context, indexProject), site, { recursive: true });
    for (const slug of pages) {
      if (!findPage(slug)) {
        throw new Error(
          `${slug} is tagged ${pageTag} but not in the pages manifest.`,
        );
      }
      cpSync(browserOutput(context, slug), join(site, slug), {
        recursive: true,
      });
    }

    const live = pages.filter((slug) => findPage(slug)?.status === 'live');
    writeFileSync(join(site, 'sitemap.xml'), sitemap(live));
    writeFileSync(join(site, 'robots.txt'), robots());
    writeFileSync(join(site, '404.html'), notFoundPage());

    logger.info(
      `Assembled ${outputPath}: the index and ${pages.length} page(s), ${live.length} in the sitemap.`,
    );
    return { success: true };
  } catch (error) {
    logger.error(error instanceof Error ? error.message : String(error));
    return { success: false };
  }
};

/** The folder holding a project's built browser files. */
function browserOutput(context: ExecutorContext, project: string): string {
  const options =
    context.projectsConfigurations.projects[project]?.targets?.['build']
      ?.options;
  const outputPath: unknown = options?.outputPath;
  // Angular's outputPath is a folder holding `browser/`, or an object naming
  // that folder.
  const folder =
    typeof outputPath === 'string'
      ? join(outputPath, 'browser')
      : isOutputPathObject(outputPath)
        ? join(outputPath.base, outputPath.browser ?? 'browser')
        : undefined;
  if (!folder) {
    throw new Error(`${project} has no build target with an outputPath.`);
  }
  const path = join(context.root, folder);
  if (!existsSync(join(path, 'index.html'))) {
    throw new Error(
      `No build of ${project} in ${folder}. Run nx build ${project}.`,
    );
  }
  return path;
}

function isOutputPathObject(
  value: unknown,
): value is { base: string; browser?: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { base?: unknown }).base === 'string'
  );
}

/** The sitemap: the index and every live page. */
export function sitemap(slugs: readonly string[]): string {
  const urls = [`${SITE.url}/`, ...slugs.map((slug) => `${SITE.url}/${slug}/`)];
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${url}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
}

function robots(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`;
}

/** A self-contained page, since it is served from any path. */
function notFoundPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Page not found · ${SITE.name}</title>
    <style>
      :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
      body { display: grid; min-height: 100vh; margin: 0; place-content: center; padding: 1rem; text-align: center; }
      h1 { font-size: 1.5rem; }
    </style>
  </head>
  <body>
    <main>
      <h1>Page not found</h1>
      <p>This page isn't part of ${SITE.name}, or not yet.</p>
      <p><a href="/">See all pages</a></p>
    </main>
  </body>
</html>
`;
}

export default runExecutor;
