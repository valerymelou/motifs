export interface OptimizeImagesExecutorSchema {
  input: string;
  output: string;
  manifest: string;
  widths?: number[];
  formats?: ('webp' | 'avif')[];
  avifQuality?: number;
  webpQuality?: number;
  exclude?: string[];
  crops?: Crop[];
}

/** A photo of other proportions cut from an original. */
export interface Crop {
  /** The cropped photo's own name. */
  name: string;
  /** The original's name, without its extension. */
  from: string;
  /** Width divided by height, such as 1 for a square. */
  aspect: number;
  /** Where the crop sits across the original, from 0 (left) to 1 (right). */
  focusX?: number;
  /** Where it sits down the original, from 0 (top) to 1 (bottom). */
  focusY?: number;
  /** Widths for this crop alone, such as fewer to keep it under a budget. */
  widths?: number[];
  /**
   * A Gaussian blur's sigma at the original's scale, applied before
   * resizing. Below a pixel it drops grain a phone screen can't show and
   * cuts the file by about a third.
   */
  blur?: number;
}
