import { Component, ElementRef, viewChild } from '@angular/core';
import { sections, siteHeader } from '../../content';

/** The dial's seven marks, one per section, round a 46-unit face. */
const CENTER = 23;
const RADIUS = 16;

/**
 * Chop's header: the wordmark, and a small dial whose hand follows the
 * scroll through the seven sections, the mark of the one in view lit
 * (site-header.css). The dial opens the sections menu, laid out round a
 * ring: a native popover, so it opens and closes without JavaScript.
 */
@Component({
  selector: 'mt-site-header',
  templateUrl: './site-header.html',
})
export class SiteHeader {
  protected readonly copy = siteHeader;
  protected readonly sections = sections;
  protected readonly marks = sections.map((section, i) => {
    const angle = ((i * 360) / sections.length - 90) * (Math.PI / 180);
    return {
      id: section.id,
      x: CENTER + RADIUS * Math.cos(angle),
      y: CENTER + RADIUS * Math.sin(angle),
    };
  });

  private readonly menu = viewChild.required<ElementRef<HTMLElement>>('menu');

  /** Closes the menu once a section is chosen; the link scrolls there. */
  protected close(): void {
    this.menu().nativeElement.hidePopover?.();
  }
}
