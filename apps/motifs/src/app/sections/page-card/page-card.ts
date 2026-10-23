import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import type { Page } from '@motifs/pages-manifest';
import { pagesSection } from '../../content';
import { Badge } from '../../ui/badge/badge';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../ui/card/card';

/**
 * One page in the index grid. Live pages show their Open Graph image and link
 * to the page; the others show their accent color and a "coming soon" badge.
 */
@Component({
  selector: 'mt-page-card',
  imports: [
    NgOptimizedImage,
    Badge,
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  ],
  templateUrl: './page-card.html',
  host: { class: 'block h-full' },
})
export class PageCard {
  readonly page = input.required<Page>();

  protected readonly copy = pagesSection;
  protected readonly live = computed(() => this.page().status === 'live');
  protected readonly href = computed(() => `/${this.page().slug}/`);
  protected readonly image = computed(() => `/${this.page().slug}/og.png`);
}
