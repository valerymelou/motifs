import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { NdIcon } from '@ndop/core';
import type { Page } from '@motifs/pages-manifest';
import { links, motifs } from '../../content';
import { motifOf, motifTile, threadOn } from '../../motifs/motifs';
import { Badge } from '../../ui/badge/badge';

/**
 * One page in the collection: its motif as a swatch of cloth, then its
 * name and voice. Live pages show their Open Graph image and link to the
 * page; the others say they are coming.
 */
@Component({
  selector: 'mt-page-card',
  imports: [NgOptimizedImage, Badge, NdIcon],
  templateUrl: './page-card.html',
  styleUrl: './page-card.css',
  host: { class: 'block h-full' },
})
export class PageCard {
  readonly page = input.required<Page>();
  /** The page's place in launch order, such as "01". */
  readonly number = input.required<string>();

  protected readonly copy = motifs;
  protected readonly links = links;
  protected readonly live = computed(() => this.page().status === 'live');
  protected readonly href = computed(() => `/${this.page().slug}/`);
  protected readonly image = computed(() => `/${this.page().slug}/og.png`);
  protected readonly tile = computed(() =>
    motifTile(motifOf(this.page().slug), threadOn(this.page().accent)),
  );
}
