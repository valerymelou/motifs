import { DOCUMENT } from '@angular/common';
import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { landingMeta, provideLandingMeta } from './landing-meta';

describe('landingMeta', () => {
  it('builds a page’s meta from the manifest', () => {
    expect(landingMeta('fil')).toEqual({
      title: 'Fil · Motifs',
      description:
        'Send SMS and WhatsApp messages across African networks with one API.',
      url: 'https://motifs.valerymelou.com/fil/',
      image: 'https://motifs.valerymelou.com/fil/og.png',
    });
  });

  it('builds the index’s meta without a slug', () => {
    expect(landingMeta()).toMatchObject({
      title: 'Motifs',
      url: 'https://motifs.valerymelou.com/',
    });
  });

  it('throws for an unknown slug', () => {
    expect(() => landingMeta('nope')).toThrow('No page "nope"');
  });
});

describe('provideLandingMeta', () => {
  async function start(slug?: string) {
    TestBed.configureTestingModule({ providers: [provideLandingMeta(slug)] });
    await TestBed.inject(ApplicationInitStatus).donePromise;
    return TestBed.inject(DOCUMENT);
  }

  const content = (document: Document, selector: string) =>
    document.head.querySelector(selector)?.getAttribute('content');

  afterEach(() => {
    document.head
      .querySelectorAll('meta, link[rel="canonical"]')
      .forEach((element) => element.remove());
  });

  it('writes the title, description and Open Graph tags', async () => {
    const document = await start('fil');

    expect(document.title).toBe('Fil · Motifs');
    expect(content(document, 'meta[name="description"]')).toContain('WhatsApp');
    expect(content(document, 'meta[property="og:url"]')).toBe(
      'https://motifs.valerymelou.com/fil/',
    );
    expect(content(document, 'meta[property="og:image"]')).toBe(
      'https://motifs.valerymelou.com/fil/og.png',
    );
    expect(content(document, 'meta[name="twitter:card"]')).toBe(
      'summary_large_image',
    );
  });

  it('writes one canonical link', async () => {
    const document = await start('fil');

    const links = document.head.querySelectorAll('link[rel="canonical"]');
    expect(links).toHaveLength(1);
    expect(links[0]?.getAttribute('href')).toBe(
      'https://motifs.valerymelou.com/fil/',
    );
  });
});
