// Renders Chop's Open Graph image (1200 × 630) from the page's own copy,
// colours and font: the opening wheel at rest on January, its twelve months
// and ten seats round the rim, the headline's card under the "This month"
// pointer, and the pot at the wheel's centre.
// Run it with `nx run chop:og`, which writes public/og.png.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { MEMBERS } from '../src/app/circle/circle.ts';
import { year } from '../src/app/content.ts';

const repo = process.cwd();
const { chromium } = createRequire(repo + '/package.json')('@playwright/test');
const font = (path: string) =>
  pathToFileURL(resolve(repo, 'node_modules', path)).href;
const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// The wheel's radius and centre, its top arc showing as on the page.
const R = 560;
const TOP = 96;
const [january] = year.cards;

const months = year.months
  .map(
    (month, i) =>
      `<span class="month" style="--i:${i}">${escape(month)}</span><span class="spoke" style="--i:${i}"></span>`,
  )
  .join('');
const seats = MEMBERS.slice(0, 10)
  .map(
    (name, i) =>
      `<span class="seat${i === 0 ? ' chopped' : ''}" style="--i:${i}">${escape(name[0] ?? '')}</span>`,
  )
  .join('');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'OG Sans'; src: url(${font('@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2')}); font-weight: 200 800; }
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; }
body { position: relative; overflow: hidden; background: #1F3A2D; color: #D4EADD; font-family: 'OG Sans'; }
.wheel { position: absolute; left: 600px; top: ${TOP + R}px; width: 0; height: 0; }
.disc { position: absolute; left: -${R}px; top: -${R}px; width: ${R * 2}px; height: ${R * 2}px; border-radius: 50%;
  background: #F1E9DA repeating-radial-gradient(circle, transparent 0 58px, #1C2A220d 58px 60px);
  box-shadow: 0 0 0 12px #F1E9DA1f, 0 0 0 28px #F1E9DA0d; }
.spoke { position: absolute; left: -1px; top: 0; width: 2px; height: ${R - 72}px; background: #1C2A2212; transform-origin: 50% 0; transform: rotate(calc(var(--i) * 30deg + 180deg)); }
.month { position: absolute; left: -32px; top: 0; width: 64px; text-align: center; font: 800 15px/1 'OG Sans'; letter-spacing: 0.12em; text-transform: uppercase; color: #2A7353;
  transform: rotate(calc(var(--i) * 30deg)) translateY(-${R - 24}px); }
.seat { position: absolute; left: -17px; top: -17px; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center;
  background: #FBF7EF; color: #1C2A22; box-shadow: inset 0 0 0 2px #2F7D5B; font: 800 13px/1 'OG Sans';
  transform: rotate(calc(var(--i) * 30deg)) translateY(-${R - 64}px); }
.seat.chopped { background: #2F7D5B; color: #fff; }
.hub { position: absolute; left: -130px; top: -130px; width: 260px; height: 260px; border-radius: 50%; background: #1F3A2D; display: grid; align-content: start; justify-items: center; gap: 6px; padding-top: 38px; text-align: center; }
.hub small { font: 700 12px/1.3 'OG Sans'; letter-spacing: 0.14em; text-transform: uppercase; }
.hub b { font: 800 30px/1 'OG Sans'; letter-spacing: -0.03em; color: #F1E9DA; }
.pointer { position: absolute; left: 600px; top: ${TOP - 40}px; transform: translateX(-50%); display: grid; justify-items: center; gap: 6px; font: 700 12px/1 'OG Sans'; letter-spacing: 0.14em; text-transform: uppercase; }
.pointer::after { content: ''; border: 9px solid transparent; border-top: 11px solid #F1E9DA; border-bottom: 0; }
.card { position: absolute; left: 600px; top: 322px; width: 620px; transform: translate(-50%, -50%); padding: 30px 34px 32px; border-radius: 30px;
  background: #FBF7EF; color: #1C2A22; box-shadow: 0 1px 0 #1C2A220d, 0 30px 50px -30px #0b1a12cc; }
.tag { font: 800 14px/1 'OG Sans'; letter-spacing: 0.14em; text-transform: uppercase; color: #2A7353; }
h1 { margin-top: 14px; font: 800 58px/0.98 'OG Sans'; letter-spacing: -0.045em; }
p { margin-top: 14px; font: 500 20px/1.45 'OG Sans'; color: #536358; }
.word { position: absolute; left: 40px; top: 32px; padding: 10px 18px; border-radius: 999px; background: #FBF7EF; color: #1C2A22; font: 800 26px/1 'OG Sans'; letter-spacing: -0.045em; }
.site { position: absolute; right: 44px; top: 44px; font: 700 14px/1 'OG Sans'; letter-spacing: 0.12em; text-transform: uppercase; }
</style></head><body>
<div class="wheel">
  <div class="disc"></div>
  ${months}
  ${seats}
  <div class="hub"><small>${escape(year.pot.label)}</small><b>${escape(year.pot.amount)}</b></div>
</div>
<div class="pointer">${escape(year.pointer)}</div>
<div class="word">Chop</div>
<div class="site">motifs.valerymelou.com</div>
<div class="card">
  <div class="tag">${escape(january?.tag ?? '')}</div>
  <h1>${escape(january?.title ?? '')}</h1>
  <p>${escape(january?.text ?? '')}</p>
</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
// Opened from a file so the page may load the local font file.
const out = join(mkdtempSync(join(tmpdir(), 'chop-og-')), 'og.html');
writeFileSync(out, html);
await page.goto(pathToFileURL(out).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({
  path: resolve(process.argv[2] ?? 'og.png'),
  type: 'png',
});
await browser.close();
