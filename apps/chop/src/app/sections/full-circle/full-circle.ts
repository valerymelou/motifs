import { Component } from '@angular/core';
import { seriesFacts } from '@motifs/pages-manifest';
import { NdIcon } from '@ndop/core';
import { MEMBERS } from '../../circle/circle';
import { fullCircle } from '../../content';
import { Button } from '../../ui/button/button';

/** When, as a share of the pinned track, each member's seat is marked. */
const MARKED_AT = [16, 20, 24, 28, 32, 36, 40, 44, 48, 52];

/**
 * "Full circle", the page's end and its footer. The wheel rises back at
 * December, every member's turn is marked and the ring closes; inside it,
 * the store buttons, and round it the series facts, which every page of
 * Motifs carries in its own way (seriesFacts). The section pins while
 * this plays, until the page ends. With reduced motion, or without scroll
 * timelines, the ring is drawn closed and the facts sit under it.
 */
@Component({
  selector: 'mt-full-circle',
  imports: [Button, NdIcon],
  templateUrl: './full-circle.html',
})
export class FullCircle {
  protected readonly copy = fullCircle;
  protected readonly facts = seriesFacts('chop', 'Chop');
  protected readonly seats = MEMBERS.slice(0, 10).map((name, i) => ({
    name,
    initial: name[0],
    i,
    at: `${MARKED_AT[i]}%`,
  }));
}
