import { Component } from '@angular/core';
import { seriesFacts } from '@motifs/pages-manifest';
import { trailhead } from '../../content';

/**
 * The footer: the trailhead at the foot of the slope. A signpost whose
 * boards are the series links, and a benchmark plate carrying the byline
 * and the fictional-brand note: the series facts every Motifs page owes,
 * laid out this page's way (seriesFacts).
 */
@Component({
  selector: 'mt-trailhead-footer',
  templateUrl: './trailhead-footer.html',
})
export class TrailheadFooter {
  protected readonly copy = trailhead;
  protected readonly facts = seriesFacts(
    'bamboutos-coffee',
    'Bamboutos Coffee',
  );
}
