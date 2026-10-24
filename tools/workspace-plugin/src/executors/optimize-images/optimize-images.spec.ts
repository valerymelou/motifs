import type { ExecutorContext } from '@nx/devkit';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import executor, { cropRegion } from './optimize-images';

function contextFor(root: string): ExecutorContext {
  return {
    root,
    cwd: root,
    isVerbose: false,
    projectGraph: { nodes: {}, dependencies: {} },
    projectsConfigurations: { projects: {}, version: 2 },
    nxJsonConfiguration: {},
  };
}

async function photo(path: string, width: number, height: number) {
  await sharp({
    create: { width, height, channels: 3, background: '#1E3170' },
  })
    .png()
    .toFile(path);
}

describe('optimize-images executor', () => {
  let root: string;
  const options = {
    input: 'images-src',
    output: 'public/images',
    manifest: 'src/app/photos/manifest.ts',
    widths: [480, 1080, 1920],
  };

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'motifs-images-'));
    mkdirSync(join(root, 'images-src'));
  });
  afterEach(() => rmSync(root, { recursive: true, force: true }));

  it('makes WebP at each width up to the original', async () => {
    await photo(join(root, 'images-src/hero-dip.png'), 1200, 675);

    const { success } = await executor(options, contextFor(root));

    expect(success).toBe(true);
    expect(readdirSync(join(root, 'public/images')).sort()).toEqual([
      'hero-dip-1080.webp',
      'hero-dip-480.webp',
    ]);
    const { width } = await sharp(
      join(root, 'public/images/hero-dip-1080.webp'),
    ).metadata();
    expect(width).toBe(1080);
  });

  it('makes AVIF too when asked', async () => {
    await photo(join(root, 'images-src/hero-dip.png'), 600, 400);

    await executor({ ...options, formats: ['webp', 'avif'] }, contextFor(root));

    expect(existsSync(join(root, 'public/images/hero-dip-480.avif'))).toBe(
      true,
    );
  });

  it('keeps a photo smaller than every width at its own size', async () => {
    await photo(join(root, 'images-src/badge.png'), 300, 300);

    await executor(options, contextFor(root));

    expect(existsSync(join(root, 'public/images/badge-300.webp'))).toBe(true);
  });

  it('writes an empty list when there are no originals yet', async () => {
    rmSync(join(root, 'images-src'), { recursive: true });

    const { success } = await executor(options, contextFor(root));

    expect(success).toBe(true);
    expect(readFileSync(join(root, options.manifest), 'utf-8')).toContain(
      '> = {\n};',
    );
  });

  it('lists each photo with its size and widths', async () => {
    await photo(join(root, 'images-src/visit-courtyard.png'), 1600, 900);

    await executor(options, contextFor(root));

    expect(readFileSync(join(root, options.manifest), 'utf-8')).toContain(
      "'visit-courtyard': { widths: [480, 1080] },",
    );
  });

  it('removes files from photos that are gone', async () => {
    mkdirSync(join(root, 'public/images'), { recursive: true });
    writeFileSync(join(root, 'public/images/old-480.webp'), '');

    await executor(options, contextFor(root));

    expect(existsSync(join(root, 'public/images/old-480.webp'))).toBe(false);
  });

  it('leaves excluded originals alone', async () => {
    await photo(join(root, 'images-src/og.png'), 600, 400);

    await executor({ ...options, exclude: ['og'] }, contextFor(root));

    expect(readdirSync(join(root, 'public/images'))).toEqual([]);
    expect(readFileSync(join(root, options.manifest), 'utf-8')).not.toContain(
      "'og'",
    );
  });

  it('cuts a crop from an original, named and listed on its own', async () => {
    await photo(join(root, 'images-src/hero-dip.png'), 1600, 900);

    await executor(
      {
        ...options,
        crops: [{ name: 'hero-dip-square', from: 'hero-dip', aspect: 1 }],
      },
      contextFor(root),
    );

    const { width, height } = await sharp(
      join(root, 'public/images/hero-dip-square-480.webp'),
    ).metadata();
    expect([width, height]).toEqual([480, 480]);
    expect(readFileSync(join(root, options.manifest), 'utf-8')).toContain(
      "'hero-dip-square': { widths: [480] },",
    );
  });

  it('makes a crop at its own widths when it has them', async () => {
    await photo(join(root, 'images-src/hero-dip.png'), 1600, 900);

    await executor(
      {
        ...options,
        widths: [480, 768],
        crops: [
          {
            name: 'hero-dip-square',
            from: 'hero-dip',
            aspect: 1,
            widths: [480],
          },
        ],
      },
      contextFor(root),
    );

    expect(
      readdirSync(join(root, 'public/images')).filter((file) =>
        file.startsWith('hero-dip-square'),
      ),
    ).toEqual(['hero-dip-square-480.webp']);
  });

  it('softens a crop when asked, making a smaller file', async () => {
    const path = join(root, 'images-src/grain.png');
    const noise = Buffer.alloc(800 * 800 * 3);
    for (let i = 0; i < noise.length; i++) {
      noise[i] = (i * 7919) % 251;
    }
    await sharp(noise, { raw: { width: 800, height: 800, channels: 3 } })
      .png()
      .toFile(path);

    await executor(
      {
        ...options,
        crops: [
          { name: 'grain-plain', from: 'grain', aspect: 1 },
          { name: 'grain-soft', from: 'grain', aspect: 1, blur: 0.8 },
        ],
      },
      contextFor(root),
    );

    const size = (name: string) =>
      readFileSync(join(root, `public/images/${name}-480.webp`)).length;
    expect(size('grain-soft')).toBeLessThan(size('grain-plain'));
  });

  it('places a crop as object-position would', () => {
    expect(cropRegion(1600, 900, { aspect: 1, focusX: 0.25 })).toEqual({
      left: 175,
      top: 0,
      width: 900,
      height: 900,
    });
    expect(cropRegion(900, 1600, { aspect: 1 })).toEqual({
      left: 0,
      top: 350,
      width: 900,
      height: 900,
    });
  });

  it('refuses a photo whose name is not lowercase words and hyphens', async () => {
    await photo(join(root, 'images-src/Hero Dip.png'), 600, 400);

    expect((await executor(options, contextFor(root))).success).toBe(false);
  });
});
