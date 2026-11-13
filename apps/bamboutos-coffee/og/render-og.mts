// Renders Bamboutos Coffee's Open Graph image (1200 × 630) from the page's
// own opener: the dawn photo of the slope, the name across its sky in the
// page's display face, the tagline, and the altimeter reading the rim.
// Run it with `nx run bamboutos-coffee:og`, which writes public/og.png. The
// photo lives in images-src, which stays out of git, so the PNG is
// committed.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { altimeter, rim } from '../src/app/content.ts';

const repo = process.cwd();
const { chromium } = createRequire(repo + '/package.json')('@playwright/test');
const file = (path: string) => pathToFileURL(resolve(repo, path)).href;
const font = (path: string) => file(join('node_modules', path));
const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const [top] = altimeter;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'OG Display'; src: url(${font('@fontsource-variable/big-shoulders-display/files/big-shoulders-display-latin-wght-normal.woff2')}); font-weight: 100 900; }
@font-face { font-family: 'OG Text'; src: url(${font('@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2')}); font-weight: 200 800; }
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; }
body { position: relative; overflow: hidden; color: #F4EAD9; background: #3B2416 url(${file('apps/bamboutos-coffee/images-src/rim-dawn.jpeg')}) 60% 62% / cover no-repeat; }
/* As on the page: the brown comes down over the pale sky from the top and the left. */
.scrim { position: absolute; inset: 0; background: linear-gradient(180deg, #25170ed1 0%, #25170e8c 40%, #25170e00 72%), linear-gradient(90deg, #25170e73 0%, #25170e00 62%); }
.copy { position: absolute; left: 64px; top: 56px; width: 760px; }
h1 { font: 900 168px/0.82 'OG Display'; text-transform: uppercase; letter-spacing: 0.005em; }
h1 span { display: block; font-size: 78px; color: #E7C9A8; }
p { margin-top: 26px; max-width: 520px; font: 400 27px/1.35 'OG Text'; }
.alt { position: absolute; right: 56px; top: 56px; display: grid; justify-items: end; gap: 4px; padding: 12px 18px; border-radius: 12px; background: #3B2416; box-shadow: 0 16px 30px -18px #000c; }
.alt small { font: 700 13px/1 'OG Display'; letter-spacing: 0.18em; text-transform: uppercase; color: #E7C9A8; }
.alt b { font: 800 40px/1 'OG Display'; letter-spacing: 0.02em; }
.site { position: absolute; left: 64px; bottom: 44px; font: 700 18px/1 'OG Display'; letter-spacing: 0.16em; text-transform: uppercase; }
</style></head><body>
<div class="scrim"></div>
<div class="copy">
  <h1>${escape(rim.name[0] ?? '')}<span>${escape(rim.name[1] ?? '')}</span></h1>
  <p>${escape(rim.tagline)}</p>
</div>
<div class="alt"><small>Altitude</small><b>${escape(top?.altitude ?? '')}</b></div>
<div class="site">motifs.valerymelou.com</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
// Opened from a file so the page may load the local fonts and photo.
const out = join(mkdtempSync(join(tmpdir(), 'bamboutos-og-')), 'og.html');
writeFileSync(out, html);
await page.goto(pathToFileURL(out).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({
  path: resolve(process.argv[2] ?? 'og.png'),
  type: 'png',
});
await browser.close();
