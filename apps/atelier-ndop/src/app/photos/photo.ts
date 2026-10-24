import { booleanAttribute, Component, computed, input } from '@angular/core';
import { photoFallback, photoSrcset } from './photo-files';

/**
 * One of the page's photos in a box of fixed proportions, so nothing moves
 * as it loads. Until the photo exists, the box shows its name instead.
 *
 * A plain `<img>` rather than `NgOptimizedImage`: the images target already
 * makes every width, and the prerendered HTML lets the browser find the hero
 * early, so the directive's code would only add to the bundle.
 */
@Component({
  selector: 'mt-photo',
  templateUrl: './photo.html',
  host: { class: 'block' },
})
export class Photo {
  /** The photo's file name in images-src, without its extension. */
  readonly name = input.required<string>();
  readonly alt = input.required<string>();
  /** The box's proportions, as CSS writes them: `16 / 9`. */
  readonly ratio = input.required<string>();
  /** How wide the photo shows, for the browser to pick a file. */
  readonly sizes = input('100vw');
  /** Where the crop centres, as `object-position` writes it. */
  readonly focus = input('50% 50%');
  /** For the page's largest paint: load it first instead of lazily. */
  readonly priority = input(false, { transform: booleanAttribute });

  protected readonly fallback = computed(() => photoFallback(this.name()));
  protected readonly srcset = computed(() => photoSrcset(this.name()));
}
