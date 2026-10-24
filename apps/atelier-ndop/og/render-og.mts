// Renders Atelier Ndop's Open Graph image (1200 × 630): the og photo, with
// the hero's line set on its plain cotton in the page's own fonts.
// Run it with `nx run atelier-ndop:og`, which writes public/og.png. The photo
// lives in images-src, which stays out of git, so the PNG is committed.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import sharp from 'sharp';
import { hero } from '../src/app/content.ts';

const repo = process.cwd();
const { chromium } = createRequire(repo + '/package.json')('@playwright/test');
const file = (path: string) => pathToFileURL(resolve(repo, path)).href;
const font = (path: string) => file(join('node_modules', path));

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'OG Display'; src: url(${font('@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2')}); font-weight: 100 900; }
@font-face { font-family: 'OG Display'; font-style: italic; src: url(${font('@fontsource-variable/fraunces/files/fraunces-latin-opsz-italic.woff2')}); font-weight: 100 900; }
@font-face { font-family: 'OG Text'; src: url(${font('@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2')}); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; }
body {
  position: relative; overflow: hidden; color: #1B2140;
  background: #F3EEE2 url(${file('apps/atelier-ndop/images-src/og.jpeg')}) center / cover no-repeat;
}
.copy { position: absolute; left: 64px; top: 60px; bottom: 56px; width: 470px; display: flex; flex-direction: column; }
.label { font: 600 14px/1 'OG Text'; letter-spacing: 0.22em; text-transform: uppercase; color: #6B4A33; }
h1 { margin-top: auto; font: 500 84px/0.95 'OG Display'; letter-spacing: -0.02em; font-optical-sizing: auto; }
h1 em { display: block; font-weight: 400; color: #1E3170; }
p { margin-top: 26px; text-wrap: balance; font: 400 21px/1.45 'OG Text'; color: rgb(27 33 64 / 82%); }
.foot { margin-top: 34px; font: 600 14px/1 'OG Text'; letter-spacing: 0.16em; text-transform: uppercase; color: #6B4A33; }
</style></head><body>
<div class="copy">
  <div class="label">${hero.label}</div>
  <h1>${hero.title}<em>${hero.titleAir}</em></h1>
  <p>Hand-dyed ndop from an atelier in Foumban. A Motifs page, built with Ndop UI.</p>
  <div class="foot">motifs.valerymelou.com</div>
</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
// Opened from a file so the page may load the local photo and font files.
const out = join(mkdtempSync(join(tmpdir(), 'atelier-og-')), 'og.html');
writeFileSync(out, html);
await page.goto(pathToFileURL(out).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
// A photo makes a heavy PNG; a 256-colour palette brings it to about 500 kB,
// with no banding that the cloth's texture would show.
const shot = await page.screenshot({ type: 'png' });
await sharp(shot)
  .png({ palette: true, quality: 90, effort: 10 })
  .toFile(resolve(process.argv[2] ?? 'og.png'));
await browser.close();
