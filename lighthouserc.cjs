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

// Initial JS ≤ 120 kB gzip, measured as transferred script bytes. A page may
// carry a higher budget, up to 125 kB, when an Ndop gap in the spec's gaps
// table accounts for the excess. Each one names its gap (ADR-0004), and the
// budget comes back down when Ndop fixes it.
const DEFAULT_SCRIPT_BUDGET = 120_000;
const SCRIPT_BUDGETS = {
  // Ndop's slider, switch and toggle primitives import @angular/forms
  // without a form, about 7 kB gzip; the page is ~114 kB without it.
  'atelier-ndop': 124_000,
};

const assertionsFor = (scriptBudget) => ({
  'categories:performance': atLeast(0.95),
  'categories:accessibility': atLeast(1),
  'categories:best-practices': atLeast(0.95),
  'categories:seo': atLeast(0.95),
  'largest-contentful-paint': atMost(2000),
  'cumulative-layout-shift': atMost(0.05),
  // Lab runs can't measure INP; blocking time is its usual stand-in.
  'total-blocking-time': atMost(200),
  'resource-summary:script:size': atMost(scriptBudget),
});

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = {
  ci: {
    collect: {
      staticDistDir: site,
      url: ['/', ...pages],
      numberOfRuns: 3,
      settings: {
        // Apply the slow-4G and CPU throttling for real instead of simulating
        // it. Served from localhost, the JS arrives before the first paint,
        // so the simulation counts it against LCP although a phone paints
        // the prerendered page long before its JS downloads.
        throttlingMethod: 'devtools',
      },
    },
    assert: {
      // One set of assertions per URL, so each page meets its own budget.
      assertMatrix: [
        {
          matchingUrlPattern: '^https?://[^/]+/$',
          assertions: assertionsFor(DEFAULT_SCRIPT_BUDGET),
        },
        ...pages.map((path) => ({
          matchingUrlPattern: `${escape(path)}$`,
          assertions: assertionsFor(
            SCRIPT_BUDGETS[path.slice(1, -1)] ?? DEFAULT_SCRIPT_BUDGET,
          ),
        })),
      ],
    },
    // Reports stay on disk (CI keeps them as an artifact) instead of a
    // public upload.
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
};
