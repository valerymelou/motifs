import { findPage, MOODS, PAGES, pagesByMood } from './pages';

describe('PAGES', () => {
  it('lists the twelve pages of the series', () => {
    expect(PAGES).toHaveLength(12);
  });

  it('gives every page a unique, URL-safe slug', () => {
    const slugs = PAGES.map((page) => page.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('gives every page a six-digit hex accent', () => {
    for (const page of PAGES) {
      expect(page.accent).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });

  it('lists each Ndop item at most once per page', () => {
    for (const page of PAGES) {
      expect(new Set(page.ndopItems).size).toBe(page.ndopItems.length);
    }
  });

  it('puts four pages in each mood', () => {
    for (const mood of MOODS) {
      expect(pagesByMood(mood)).toHaveLength(4);
    }
  });
});

describe('findPage', () => {
  it('finds a page by slug', () => {
    expect(findPage('fil')?.name).toBe('Fil');
  });

  it('returns undefined for an unknown slug', () => {
    expect(findPage('nope')).toBeUndefined();
  });
});
