import { Component, computed, input } from '@angular/core';
import { SITE } from '@motifs/pages-manifest';

/**
 * The slim strip every page ends with: which series it belongs to, where its
 * source lives, and that the brand is fictional.
 *
 * It renders no landmark of its own, so place it inside the page's
 * `<footer>`.
 *
 * The page passes its own name rather than having it looked up by slug, so
 * the browser bundle doesn't carry every page's entry in the manifest. The
 * landing-page generator writes both from the manifest.
 */
@Component({
  selector: 'mt-series-footer',
  templateUrl: './series-footer.html',
  styleUrl: './series-footer.css',
})
export class SeriesFooter {
  /** The page's slug in the pages manifest, which names its source folder. */
  readonly slug = input.required<string>();
  /** The page's name, as the pages manifest writes it. */
  readonly name = input.required<string>();

  protected readonly site = SITE;
  protected readonly sourceUrl = computed(
    () => `${SITE.repoUrl}/tree/master/apps/${this.slug()}`,
  );
}
