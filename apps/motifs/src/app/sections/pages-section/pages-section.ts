import { Component, computed, signal } from '@angular/core';
import { MOODS, PAGES, pagesByMood } from '@motifs/pages-manifest';
import { pagesSection } from '../../content';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '../../ui/toggle-group/toggle-group';
import { PageCard } from '../page-card/page-card';

@Component({
  selector: 'mt-pages-section',
  imports: [ToggleGroup, ToggleGroupItem, PageCard],
  templateUrl: './pages-section.html',
})
export class PagesSection {
  protected readonly copy = pagesSection;
  protected readonly moods = MOODS;

  /** The pressed mood, if any; none pressed shows every page. */
  protected readonly selected = signal<readonly string[]>([]);

  private readonly mood = computed(() =>
    MOODS.find((mood) => mood === this.selected()[0]),
  );

  protected readonly pages = computed(() => {
    const mood = this.mood();
    return mood ? pagesByMood(mood) : PAGES;
  });

  protected readonly summary = computed(() => {
    const mood = this.mood();
    return this.copy.showing(
      this.pages().length,
      mood && this.copy.moods[mood],
    );
  });
}
