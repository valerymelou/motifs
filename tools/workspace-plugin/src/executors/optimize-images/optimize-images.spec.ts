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
import executor from './optimize-images';

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
      "'visit-courtyard': { width: 1600, height: 900, widths: [480, 1080] },",
    );
  });

  it('removes files from photos that are gone', async () => {
    mkdirSync(join(root, 'public/images'), { recursive: true });
    writeFileSync(join(root, 'public/images/old-480.webp'), '');

    await executor(options, contextFor(root));

    expect(existsSync(join(root, 'public/images/old-480.webp'))).toBe(false);
  });

  it('refuses a photo whose name is not lowercase words and hyphens', async () => {
    await photo(join(root, 'images-src/Hero Dip.png'), 600, 400);

    expect((await executor(options, contextFor(root))).success).toBe(false);
  });
});
