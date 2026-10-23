import { Component, computed, input } from '@angular/core';
import { motif } from './motifs';
import { depthOf, layoutCloth, type Pattern } from './pattern';

/**
 * A cloth drawn from a pattern: the stitched white cotton underneath, and the
 * dyed cloth over it. Dyeing fades the dyed cloth in vat green, then indigo,
 * as real indigo turns from green to blue in the air.
 */
@Component({
  selector: 'mt-cloth',
  templateUrl: './cloth.html',
  styleUrl: './cloth.css',
  host: { class: 'block' },
})
export class Cloth {
  readonly pattern = input.required<Pattern>();
  /** The cloth's accessible name. */
  readonly label = input.required<string>();

  protected readonly layout = computed(() => layoutCloth(this.pattern()));
  protected readonly viewBox = computed(
    () => `0 0 ${this.layout().width} ${this.layout().height}`,
  );
  protected readonly placements = computed(() =>
    this.layout().placements.map((placement) => ({
      transform: placement.transform,
      motif: motif(placement.kind),
    })),
  );
  protected readonly indigo = computed(
    () => depthOf(this.pattern().depth).color,
  );
  protected readonly dyed = computed(() => this.pattern().dyed);
}
