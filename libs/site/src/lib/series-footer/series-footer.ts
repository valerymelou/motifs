import { Component, computed, input } from '@angular/core';
import { findPage, SITE } from '@motifs/pages-manifest';

/**
 * The slim strip every page ends with: which series it belongs to, where its
 * source lives, and that the brand is fictional.
 *
 * It renders no landmark of its own, so place it inside the page's
 * `<footer>`.
 */
@Component({
  selector: 'mt-series-footer',
  templateUrl: './series-footer.html',
  styleUrl: './series-footer.css',
})
export class SeriesFooter {
  /** The page's slug in the pages manifest. */
  readonly slug = input.required<string>();

  protected readonly site = SITE;
  protected readonly page = computed(() => findPage(this.slug()));
  protected readonly sourceUrl = computed(
    () => `${SITE.repoUrl}/tree/main/apps/${this.slug()}`,
  );
}
