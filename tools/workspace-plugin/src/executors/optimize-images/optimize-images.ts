import { logger, type PromiseExecutor } from '@nx/devkit';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, extname, join } from 'node:path';
import sharp from 'sharp';
import type { Crop, OptimizeImagesExecutorSchema } from './schema';

const ORIGINALS = /\.(png|jpe?g|webp)$/i;
const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * One photo's entry in the generated list: the widths made, all the page
 * needs to write a srcset. It ships in the page's JavaScript, so it holds
 * nothing more.
 */
export interface PhotoEntry {
  readonly widths: readonly number[];
}

/**
 * Turns each original photo into WebP (and AVIF, if asked) at the given
 * widths, named `<name>-<width>.<format>`, and writes a typed list of them
 * that the app's photo component reads. Crops make named photos of other
 * proportions from an original, for screens where CSS would otherwise crop
 * a much larger file. Never enlarges a photo.
 */
const runExecutor: PromiseExecutor<OptimizeImagesExecutorSchema> = async (
  {
    input,
    output,
    manifest,
    widths = [480, 768, 1080, 1440, 1920],
    formats = ['webp'],
    avifQuality = 50,
    webpQuality = 65,
    exclude = [],
    crops = [],
  },
  context,
) => {
  try {
    const source = join(context.root, input);
    const target = join(context.root, output);
    // The originals stay out of git, so a fresh checkout has none yet.
    const files = existsSync(source)
      ? readdirSync(source)
          .filter((file) => ORIGINALS.test(file))
          .sort()
      : [];
    const byName = new Map(
      files.map((file) => [basename(file, extname(file)), join(source, file)]),
    );

    const jobs: Job[] = [];
    for (const [name, path] of byName) {
      if (!exclude.includes(name)) {
        jobs.push({ name, path });
      }
    }
    for (const crop of crops) {
      const path = byName.get(crop.from);
      if (path) {
        jobs.push({ name: crop.name, path, crop });
      }
    }

    rmSync(target, { recursive: true, force: true });
    mkdirSync(target, { recursive: true });

    const photos: Record<string, PhotoEntry> = {};
    for (const job of jobs.sort((a, b) => a.name.localeCompare(b.name))) {
      const { name, path } = job;
      if (!NAME.test(name)) {
        throw new Error(
          `${name}: name photos in lowercase words joined by hyphens.`,
        );
      }
      const original = await sharp(path).metadata();
      const region = job.crop
        ? cropRegion(original.width ?? 0, original.height ?? 0, job.crop)
        : undefined;
      const width = region?.width ?? original.width ?? 0;
      const sizes = (job.crop?.widths ?? widths).filter(
        (size) => size <= width,
      );
      const made = sizes.length > 0 ? sizes : [width];

      for (const size of made) {
        const cropped = region ? sharp(path).extract(region) : sharp(path);
        const softened = job.crop?.blur ? cropped.blur(job.crop.blur) : cropped;
        const resized = softened.resize({ width: size });
        for (const format of formats) {
          const encoded =
            format === 'avif'
              ? resized.clone().avif({ quality: avifQuality })
              : // The slowest effort saves about a tenth on grainy photos.
                resized.clone().webp({ quality: webpQuality, effort: 6 });
          await encoded.toFile(join(target, `${name}-${size}.${format}`));
        }
      }
      photos[name] = { widths: made };

      const largest = Math.max(...made);
      const weights = formats
        .map(
          (format) =>
            `${format} ${kb(statSync(join(target, `${name}-${largest}.${format}`)).size)}`,
        )
        .join(', ');
      logger.info(
        `${name}: ${made.join(', ')} px; at ${largest} px: ${weights}.`,
      );
    }

    mkdirSync(dirname(join(context.root, manifest)), { recursive: true });
    writeFileSync(join(context.root, manifest), manifestSource(photos));
    logger.info(`Optimized ${jobs.length} photo(s) into ${output}.`);
    return { success: true };
  } catch (error) {
    logger.error(error instanceof Error ? error.message : String(error));
    return { success: false };
  }
};

interface Job {
  readonly name: string;
  readonly path: string;
  readonly crop?: Crop;
}

/**
 * The largest region of the given proportions that fits the original,
 * placed the way CSS's `object-position` places a cover crop: a focus of 0
 * keeps the left (or top) edge, 1 the right (or bottom), 0.5 the middle.
 */
export function cropRegion(
  width: number,
  height: number,
  { aspect, focusX = 0.5, focusY = 0.5 }: Crop,
): { left: number; top: number; width: number; height: number } {
  const cropWidth = Math.min(width, Math.round(height * aspect));
  const cropHeight = Math.min(height, Math.round(cropWidth / aspect));
  return {
    left: Math.round((width - cropWidth) * focusX),
    top: Math.round((height - cropHeight) * focusY),
    width: cropWidth,
    height: cropHeight,
  };
}

/** The generated list, as TypeScript the app imports. */
export function manifestSource(photos: Record<string, PhotoEntry>): string {
  const entries = Object.entries(photos).map(
    ([name, photo]) => `  '${name}': { widths: [${photo.widths.join(', ')}] },`,
  );
  return [
    '// Generated by the optimize-images executor from the original photos.',
    "// Do not edit: run the app's images target instead.",
    '',
    'export const PHOTOS: Readonly<',
    '  Record<string, { widths: readonly number[] }>',
    '> = {',
    ...entries,
    '};',
    '',
  ].join('\n');
}

function kb(bytes: number): string {
  return `${Math.round(bytes / 1024)} kB`;
}

export default runExecutor;
