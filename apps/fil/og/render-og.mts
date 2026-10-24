// Renders Fil's Open Graph image (1200 × 630) from the page's own copy,
// colours and fonts: the headline on squared paper, the hero's terminal,
// and the green thread stepping out of it to the stitch.
// Run it with `nx run fil:og`, which writes public/og.png.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { hero } from '../src/app/content.ts';

const repo = process.cwd();
const { chromium } = createRequire(repo + '/package.json')('@playwright/test');
const font = (path: string) =>
  pathToFileURL(resolve(repo, 'node_modules', path)).href;
const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'OG Sans'; src: url(${font('@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2')}); font-weight: 100 900; }
@font-face { font-family: 'OG Mono'; src: url(${font('@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2')}); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; }
body {
  position: relative; overflow: hidden; color: #0B0B0C; font-family: 'OG Sans';
  background-color: #FAFAF7;
  background-image: linear-gradient(#0B0B0C0b 1px, transparent 1px), linear-gradient(90deg, #0B0B0C0b 1px, transparent 1px);
  background-size: 16px 16px;
}
/* As on the page: the thread starts at the terminal and ends in the stitch. */
.thread { position: absolute; left: 64px; top: 529px; bottom: 50px; width: 3px; background: #22C55E; }
.stitch { position: absolute; left: 50px; bottom: 34px; width: 31px; height: 31px; background: #FAFAF7; }
.copy { position: absolute; left: 112px; top: 64px; width: 760px; }
.label { font: 500 15px/1 'OG Mono'; letter-spacing: 0.18em; text-transform: uppercase; color: #4B4F49; }
h1 { margin-top: 26px; font: 800 112px/0.86 'OG Sans'; letter-spacing: -0.055em; }
p { margin-top: 26px; max-width: 520px; font: 400 25px/1.4 'OG Sans'; color: #4B4F49; }
.terminal { position: absolute; left: 112px; right: 64px; bottom: 64px; padding: 22px 26px; border-radius: 8px; background: #0B0B0C; color: #E7E7E2; font: 500 17px/1.65 'OG Mono'; }
.terminal::before { content: ''; position: absolute; left: -48px; bottom: 34px; width: 48px; height: 3px; background: #22C55E; }
.terminal b { color: #22C55E; font-weight: 500; }
.terminal i { font-style: normal; color: #8A9088; }
.cursor { display: inline-block; width: 0.6em; height: 1.05em; margin-left: 0.4em; vertical-align: -0.2em; background: #22C55E; }
.foot { position: absolute; right: 64px; top: 64px; font: 600 15px/1 'OG Mono'; letter-spacing: 0.12em; text-transform: uppercase; color: #4B4F49; }
</style></head><body>
<div class="thread"></div>
<svg class="stitch" viewBox="0 0 48 48"><path fill="#22C55E" fill-rule="evenodd" d="M2 22h14v4H2Z M32 22h14v4H32Z M22 6h4v12h-4Z M22 30h4v12h-4Z"/></svg>
<div class="copy">
  <div class="label">${escape(hero.label)}</div>
  <h1>${escape(hero.title)}</h1>
  <p>${escape(hero.tagline)}</p>
</div>
<div class="foot">motifs.valerymelou.com</div>
<div class="terminal"><b>$</b> ${escape(hero.request[0].replace(/\s*\\$/, ''))}<br><i>${escape(hero.reply[0])}</i><br>${escape(hero.reply[2])}<span class="cursor"></span></div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
// Opened from a file so the page may load the local font files.
const out = join(mkdtempSync(join(tmpdir(), 'fil-og-')), 'og.html');
writeFileSync(out, html);
await page.goto(pathToFileURL(out).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({
  path: resolve(process.argv[2] ?? 'og.png'),
  type: 'png',
});
await browser.close();
