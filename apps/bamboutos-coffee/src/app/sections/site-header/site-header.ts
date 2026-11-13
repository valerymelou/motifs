import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { altimeter, siteHeader, stops } from '../../content';
import { Cart } from '../../shop/cart';

/**
 * The header: the wordmark, the altimeter and the cart. The altimeter's
 * reading rolls down the slope as the sections pass, read from their view
 * timelines in CSS (site-header.css), so it costs no JavaScript; it is a
 * picture of where you are, hidden from screen readers, since each
 * section's heading says it. The Route button opens the route card, a
 * native popover listing every stop with its altitude.
 *
 * The cart button is a link to the shop, and stays one until the shop has
 * loaded (it waits in a deferred block); from then on it opens the cart's
 * Sheet instead, and shows how many bags are in it.
 */
@Component({
  selector: 'mt-site-header',
  templateUrl: './site-header.html',
})
export class SiteHeader {
  protected readonly copy = siteHeader;
  protected readonly stops = stops;
  protected readonly readings = altimeter;
  protected readonly cart = inject(Cart);

  private readonly route = viewChild.required<ElementRef<HTMLElement>>('route');

  /** Opens the cart once the shop has loaded; until then, follows the link. */
  protected openCart(event: Event): void {
    if (this.cart.ready()) {
      event.preventDefault();
      this.cart.open.set(true);
    }
  }

  /** Closes the route card once a stop is chosen; the link scrolls there. */
  protected close(): void {
    this.route().nativeElement.hidePopover?.();
  }
}
