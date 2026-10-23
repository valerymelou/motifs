export interface OptimizeImagesExecutorSchema {
  input: string;
  output: string;
  manifest: string;
  widths?: number[];
  formats?: ('webp' | 'avif')[];
  avifQuality?: number;
  webpQuality?: number;
}
