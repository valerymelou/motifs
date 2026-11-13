import { Component, ElementRef, viewChild } from '@angular/core';
import { altimeter, siteHeader, stops } from '../../content';

/**
 * The header: the wordmark, the altimeter and the cart. The altimeter's
 * reading rolls down the slope as the sections pass, read from their view
 * timelines in CSS (site-header.css), so it costs no JavaScript; it is a
 * picture of where you are, hidden from screen readers, since each
 * section's heading says it. The Route button opens the route card, a
 * native popover listing every stop with its altitude.
 */
@Component({
  selector: 'mt-site-header',
  templateUrl: './site-header.html',
})
export class SiteHeader {
  protected readonly copy = siteHeader;
  protected readonly stops = stops;
  protected readonly readings = altimeter;

  private readonly route = viewChild.required<ElementRef<HTMLElement>>('route');

  /** Closes the route card once a stop is chosen; the link scrolls there. */
  protected close(): void {
    this.route().nativeElement.hidePopover?.();
  }
}
