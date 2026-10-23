// Renders the index's Open Graph image (1200 × 630) from its own motif
// model, page accents and fonts, so the image can't drift from the page.
// Run it with `nx run motifs:og`, which writes public/og.png.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { motifOf, motifTile, threadOn } from '../src/app/motifs/motifs.ts';
import { PAGES } from '../../../libs/pages-manifest/src/lib/pages.ts';

const repo = process.cwd();
const { chromium } = createRequire(repo + '/package.json')('@playwright/test');
const font = (path: string) =>
  pathToFileURL(resolve(repo, 'node_modules', path)).href;

const bands = PAGES.map(
  (page, i) =>
    `<div class="band" style="--i:${i};background-color:${page.accent};background-image:${motifTile(motifOf(page.slug), threadOn(page.accent)).replaceAll('"', "'")}"></div>`,
).join('');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'OG Display'; src: url(${font('@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2')}); }
@font-face { font-family: 'OG Display'; font-style: italic; src: url(${font('@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2')}); }
@font-face { font-family: 'OG Text'; src: url(${font('@fontsource-variable/geist/files/geist-latin-wght-normal.woff2')}); font-weight: 100 900; }
@font-face { font-family: 'OG Label'; src: url(${font('@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2')}); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; }
body {
  position: relative; overflow: hidden; color: #F4EFE4;
  background:
    repeating-linear-gradient(0deg, rgb(244 239 228 / 3%) 0 1px, transparent 1px 4px),
    repeating-linear-gradient(90deg, rgb(244 239 228 / 2.5%) 0 1px, transparent 1px 4px),
    radial-gradient(120% 90% at 0% 0%, #1A2148 0%, #0E1328 55%, #0A0E1F 100%);
}
.cloth {
  position: absolute; top: -70px; right: -230px; width: 700px;
  display: grid; transform: rotate(-9deg); transform-origin: top right;
  box-shadow: -40px 40px 90px rgb(0 0 0 / 55%);
}
/* A stitched selvedge along the cloth's edge. */
.cloth::before {
  content: ''; position: absolute; inset: 0 auto 0 0; width: 14px; z-index: 1;
  background:
    repeating-linear-gradient(180deg, #F4EFE4 0 9px, transparent 9px 16px) 5px 0 / 3px 100% no-repeat,
    #0E1328;
}
.band { height: 54px; background-repeat: repeat-x; background-size: auto 100%; background-position: calc(var(--i) * -17px) 0; }
.copy { position: absolute; left: 72px; top: 64px; bottom: 60px; width: 700px; display: flex; flex-direction: column; }
.label { font: 500 15px/1 'OG Label'; letter-spacing: 0.24em; text-transform: uppercase; color: rgb(244 239 228 / 72%); }
h1 { margin-top: auto; font: 400 128px/0.86 'OG Display'; letter-spacing: -0.02em; }
h1 em { font-style: italic; }
p { margin-top: 30px; max-width: 590px; text-wrap: balance; font: 400 25px/1.4 'OG Text'; color: rgb(244 239 228 / 80%); }
.foot { margin-top: 40px; display: flex; gap: 28px; font: 500 15px/1 'OG Label'; letter-spacing: 0.16em; text-transform: uppercase; color: rgb(244 239 228 / 72%); }
.foot b { color: #F4EFE4; font-weight: 500; }
</style></head><body>
<div class="cloth">${bands}</div>
<div class="copy">
  <div class="label">An open-source series · 12 pages</div>
  <h1>Twelve motifs.<br><em>One cloth.</em></h1>
  <p>Landing pages for fictional brands, built with one component library: Ndop UI, on Angular.</p>
  <div class="foot"><b>motifs.valerymelou.com</b><span>MIT</span></div>
</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
// Opened from a file so the page may load the local font files.
const file = join(mkdtempSync(join(tmpdir(), 'motifs-og-')), 'og.html');
writeFileSync(file, html);
await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({
  path: resolve(process.argv[2] ?? 'og.png'),
  type: 'png',
});
await browser.close();
