import { DOCUMENT } from '@angular/common';
import {
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
  type EnvironmentProviders,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { findPage, SITE } from '@motifs/pages-manifest';

/** The head tags one page needs, all from the manifest. */
export interface LandingMeta {
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly image: string;
}

/**
 * The meta for a page, or for the series index when `slug` is left out.
 *
 * @throws When no page has that slug, so a typo fails the prerender instead
 * of shipping a page with the wrong tags.
 */
export function landingMeta(slug?: string): LandingMeta {
  if (slug === undefined) {
    const url = `${SITE.url}/`;
    return {
      title: SITE.name,
      description: SITE.description,
      url,
      image: `${url}og.png`,
    };
  }
  const page = findPage(slug);
  if (!page) {
    throw new Error(`No page "${slug}" in the pages manifest.`);
  }
  const url = `${SITE.url}/${page.slug}/`;
  return {
    title: `${page.name} · ${SITE.name}`,
    description: page.tagline,
    url,
    image: `${url}og.png`,
  };
}

/**
 * Sets the title, description, canonical URL and Open Graph tags for a page
 * (or the index, without a slug) when the app starts, so they are in the
 * prerendered HTML.
 *
 * Each app ships its 1200×630 Open Graph image as `public/og.png`.
 */
export function provideLandingMeta(slug?: string): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => applyLandingMeta(landingMeta(slug))),
  ]);
}

function applyLandingMeta(meta: LandingMeta): void {
  inject(Title).setTitle(meta.title);

  const tags = inject(Meta);
  tags.updateTag({ name: 'description', content: meta.description });
  for (const [property, content] of [
    ['og:type', 'website'],
    ['og:site_name', SITE.name],
    ['og:title', meta.title],
    ['og:description', meta.description],
    ['og:url', meta.url],
    ['og:image', meta.image],
    ['og:image:width', '1200'],
    ['og:image:height', '630'],
  ]) {
    tags.updateTag({ property, content });
  }
  tags.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

  // Angular's Meta service manages <meta> only, so the canonical <link> is
  // written through the document.
  const document = inject(DOCUMENT);
  const canonical =
    document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]') ??
    document.head.appendChild(document.createElement('link'));
  canonical.rel = 'canonical';
  canonical.href = meta.url;
}
