// Lighthouse CI checks every assembled page against the build spec's quality
// bar, on Lighthouse's default mobile profile. Run it with
// `nx run workspace-plugin:lighthouse`, which assembles dist/site first.
const { existsSync, readdirSync } = require('node:fs');
const { join } = require('node:path');

const site = 'dist/site';

// The index, then every page folder the assembly wrote.
const pages = existsSync(site)
  ? readdirSync(site, { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isDirectory() &&
          existsSync(join(site, entry.name, 'index.html')),
      )
      .map((entry) => `/${entry.name}/`)
  : [];

// Judge the median of the runs, not the luckiest one.
const atLeast = (minScore) => [
  'error',
  { minScore, aggregationMethod: 'median-run' },
];
const atMost = (maxNumericValue) => [
  'error',
  { maxNumericValue, aggregationMethod: 'median-run' },
];

module.exports = {
  ci: {
    collect: {
      staticDistDir: site,
      url: ['/', ...pages],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': atLeast(0.95),
        'categories:accessibility': atLeast(1),
        'categories:best-practices': atLeast(0.95),
        'categories:seo': atLeast(0.95),
        'largest-contentful-paint': atMost(2000),
        'cumulative-layout-shift': atMost(0.05),
        // Lab runs can't measure INP; blocking time is its usual stand-in.
        'total-blocking-time': atMost(200),
        // Initial JS ≤ 120 kB gzip, measured as transferred script bytes.
        'resource-summary:script:size': atMost(120_000),
      },
    },
    // Reports stay on disk (CI keeps them as an artifact) instead of a
    // public upload.
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
};
