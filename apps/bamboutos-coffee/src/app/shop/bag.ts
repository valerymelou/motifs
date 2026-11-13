import { Component, input } from '@angular/core';
import { roasts } from '../content';
import { Photo } from '../photos/photo';

/**
 * A roast's bag: the photo of the blank kraft bag with its label laid over
 * it, so the label's words are real text (generated lettering comes out
 * garbled). The three bag photos share one framing, so one position fits
 * all; it is set in container units and scales with the photo (bag.css).
 */
@Component({
  selector: 'mt-bag',
  imports: [Photo],
  template: `
    <mt-photo [name]="photo()" alt="" ratio="1 / 1" [sizes]="sizes()" />
    <div class="bag-label" aria-hidden="true">
      <span class="bag-brand">Bamboutos Coffee</span>
      <span class="bag-roast">{{ name() }} roast</span>
      <span class="bag-origin">{{ copy.process }}</span>
      <span class="bag-origin">{{ copy.origin }}</span>
    </div>
  `,
})
export class Bag {
  readonly photo = input.required<string>();
  /** The roast's name: "Medium". */
  readonly name = input.required<string>();
  readonly sizes = input('100vw');

  protected readonly copy = roasts.bag;
}
