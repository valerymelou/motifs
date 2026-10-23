import { Component } from '@angular/core';
import { PAGES, SITE } from '@motifs/pages-manifest';
import { hero } from '../../content';
import { motifOf, motifTile, threadOn } from '../../motifs/motifs';
import { Button } from '../../ui/button/button';

/**
 * The series as one cloth: a band of motifs per page, in its accent. Each
 * band links to its page in the collection, so the cloth has a keyboard
 * path and names every page.
 */
@Component({
  selector: 'mt-cloth-hero',
  imports: [Button],
  templateUrl: './cloth-hero.html',
  styleUrl: './cloth-hero.css',
})
export class ClothHero {
  protected readonly copy = hero;
  protected readonly site = SITE;
  protected readonly bands = PAGES.map((page, index) => ({
    slug: page.slug,
    name: page.name,
    accent: page.accent,
    number: String(index + 1).padStart(2, '0'),
    tile: motifTile(motifOf(page.slug), threadOn(page.accent)),
  }));
}
