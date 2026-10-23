import { Component, computed, input } from '@angular/core';
import type { Page } from '@motifs/pages-manifest';
import { motifOf, motifTile, threadOn } from '../../motifs/motifs';
import type { Specimen } from '../../specimens';
import { cn } from '../../lib/utils';
import { Badge } from '../../ui/badge/badge';
import { buttonVariants } from '../../ui/button/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../ui/card/card';

const FONTS = {
  serif: 'var(--font-serif)',
  sans: 'var(--font-sans)',
  mono: 'var(--font-mono)',
} as const;

/**
 * The same Ndop card, restyled by one page's theme through Ndop's tokens
 * alone: no markup or component changes between pages.
 */
@Component({
  selector: 'mt-specimen-card',
  imports: [Badge, Card, CardDescription, CardFooter, CardHeader, CardTitle],
  templateUrl: './specimen-card.html',
  host: {
    class: 'block',
    '[style.--card]': 'theme().background',
    '[style.--card-foreground]': 'theme().foreground',
    '[style.--foreground]': 'theme().foreground',
    '[style.--muted-foreground]': 'theme().foreground',
    '[style.--primary]': 'theme().primary',
    '[style.--primary-foreground]': 'theme().primaryForeground',
    '[style.--border]': 'border()',
    '[style.--radius]': 'theme().radius',
    '[style.font-family]': 'font()',
  },
})
export class SpecimenCard {
  readonly page = input.required<Page>();
  readonly specimen = input.required<Specimen>();

  protected readonly theme = computed(() => this.specimen().theme);
  protected readonly font = computed(() => FONTS[this.theme().font]);
  protected readonly border = computed(
    () => `color-mix(in oklch, ${this.theme().foreground} 24%, transparent)`,
  );
  protected readonly tile = computed(() =>
    motifTile(motifOf(this.page().slug), threadOn(this.page().accent)),
  );
  // The specimen's button is a picture of one: it only shows the style.
  // Its colors switch at once between themes, like the badge's: fading them
  // would pass through shades that fail contrast.
  protected readonly buttonClass = cn(buttonVariants(), 'transition-none');
}
