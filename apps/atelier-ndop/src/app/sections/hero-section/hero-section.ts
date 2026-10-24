import { Component } from '@angular/core';
import { hero } from '../../content';
import { motif, type MotifKind } from '../../pattern/motifs';
import { photoFallback, photoSrcset } from '../../photos/photo-files';
import { Button } from '../../ui/button/button';

/** The motifs along the band under the photo, repeated across it. */
const BAND: readonly MotifKind[] = ['lozenge', 'moon', 'diamond', 'star'];
const BAND_TILE = 32;
const BAND_MOTIF = 22;

let nextId = 0;

/** One state of the hero photo: the 16:9 frame and its square crop. */
function frame(name: string) {
  return {
    wide: photoSrcset(name),
    square: photoSrcset(`${name}-square`),
    fallback: photoFallback(`${name}-square`),
  };
}

/**
 * The page's opening: cloth lifted out of the pit, green, turning blue as it
 * meets the air. Two photos of the same frame crossfade in CSS, so the
 * moment plays from the prerendered HTML, before any JavaScript.
 */
@Component({
  selector: 'mt-hero-section',
  imports: [Button],
  templateUrl: './hero-section.html',
})
export class HeroSection {
  protected readonly copy = hero;
  // Phones get square crops made around the cloth: cropping the 16:9 frame
  // in CSS would fetch a file nearly twice as wide as the screen.
  protected readonly green = frame('hero-dip');
  protected readonly blue = frame('hero-dip-blue');
  protected readonly wide = '(min-width: 40rem)';
  // From 40rem the 16:10 box shows the 16:9 frame a little wider than the
  // screen; from 64rem it fills the screen.
  protected readonly wideSizes = '(min-width: 64rem) 100vw, 112vw';

  protected readonly bandId = `mt-hero-band-${nextId++}`;
  protected readonly bandWidth = BAND.length * BAND_TILE;
  protected readonly bandTile = BAND_TILE;
  protected readonly band = BAND.map((kind, i) => ({
    path: motif(kind).path,
    transform: `translate(${i * BAND_TILE + (BAND_TILE - BAND_MOTIF) / 2} ${(BAND_TILE - BAND_MOTIF) / 2}) scale(${BAND_MOTIF / 48})`,
  }));
}
