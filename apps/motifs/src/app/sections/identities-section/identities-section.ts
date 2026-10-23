import { Component, computed, inject, linkedSignal } from '@angular/core';
import { ScrollProgress } from '@motifs/motion';
import { PAGES, type Page } from '@motifs/pages-manifest';
import { identities } from '../../content';
import { motifOf, motifTile, threadOn } from '../../motifs/motifs';
import { specimenOf } from '../../specimens';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '../../ui/toggle-group/toggle-group';
import { SpecimenCard } from '../specimen-card/specimen-card';

/**
 * One Ndop card passed from page to page. Scrolling through the section
 * steps through the pages; the picker jumps to one, which is also the path
 * for keyboards and for reduced motion, where scrolling doesn't step.
 */
@Component({
  selector: 'mt-identities-section',
  imports: [SpecimenCard, ToggleGroup, ToggleGroupItem],
  templateUrl: './identities-section.html',
  hostDirectives: [{ directive: ScrollProgress, inputs: ['mtScrollProgress'] }],
  host: { class: 'block h-[320svh] motion-reduce:h-auto' },
})
export class IdentitiesSection {
  protected readonly copy = identities;
  protected readonly entries = PAGES.map((page, index) => ({
    page,
    number: String(index + 1).padStart(2, '0'),
    tile: motifTile(motifOf(page.slug), threadOn(page.accent)),
  }));

  private readonly progress = inject(ScrollProgress).progress;
  private readonly step = computed(() =>
    Math.min(PAGES.length - 1, Math.floor(this.progress() * PAGES.length)),
  );

  /** The picked page; scrolling to another step picks that one instead. */
  protected readonly picked = linkedSignal<readonly string[]>(() => [
    this.pageAt(this.step()).slug,
  ]);

  protected readonly page = computed(
    () =>
      PAGES.find((page) => page.slug === this.picked()[0]) ??
      this.pageAt(this.step()),
  );
  protected readonly specimen = computed(() => specimenOf(this.page().slug));

  private pageAt(index: number): Page {
    const page = PAGES[index] ?? PAGES[0];
    if (!page) {
      throw new Error('The pages manifest is empty.');
    }
    return page;
  }
}
