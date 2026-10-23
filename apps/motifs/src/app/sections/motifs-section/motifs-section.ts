import { Component, computed, signal } from '@angular/core';
import { Reveal, Stagger } from '@motifs/motion';
import { MOODS, PAGES, pagesByMood } from '@motifs/pages-manifest';
import { motifs } from '../../content';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '../../ui/toggle-group/toggle-group';
import { PageCard } from '../page-card/page-card';

@Component({
  selector: 'mt-motifs-section',
  imports: [PageCard, Reveal, Stagger, ToggleGroup, ToggleGroupItem],
  templateUrl: './motifs-section.html',
})
export class MotifsSection {
  protected readonly copy = motifs;
  protected readonly filters = MOODS.map((mood) => ({
    mood,
    count: String(pagesByMood(mood).length).padStart(2, '0'),
  }));

  /** The pressed mood, if any; none pressed shows every page. */
  protected readonly selected = signal<readonly string[]>([]);

  private readonly mood = computed(() =>
    MOODS.find((mood) => mood === this.selected()[0]),
  );

  protected readonly entries = computed(() => {
    const mood = this.mood();
    const pages = mood ? pagesByMood(mood) : PAGES;
    return pages.map((page) => ({
      page,
      number: String(PAGES.indexOf(page) + 1).padStart(2, '0'),
    }));
  });

  protected readonly summary = computed(() => {
    const mood = this.mood();
    return this.copy.showing(
      this.entries().length,
      mood && this.copy.moods[mood],
    );
  });
}
