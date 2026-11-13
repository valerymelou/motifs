import { Component } from '@angular/core';
import { plots } from '../../content';
import { Photo } from '../../photos/photo';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card/card';

/** Where each plot's marker sits on the map, in its viewBox (1000 × 625). */
const MARKERS = [
  { x: 560, y: 150 },
  { x: 700, y: 290 },
  { x: 520, y: 380 },
];

/**
 * The plots: a survey sheet of the upper slope. A contour map with the
 * three plots marked, each plot's card beside its marker, and two field
 * prints taped to the sheet. From 64rem the cards and prints sit on the
 * map; below that, the map comes first and the rest follows it.
 */
@Component({
  selector: 'mt-plots-section',
  imports: [Card, CardContent, CardHeader, CardTitle, Photo],
  templateUrl: './plots-section.html',
})
export class PlotsSection {
  protected readonly copy = plots;
  protected readonly markers = MARKERS;
  /**
   * The map's contour lines: rings round the summit, off the top right.
   * Unlabelled: the plots' cards give their altitudes.
   */
  protected readonly contours = Array.from({ length: 11 }, (_, i) => ({
    rx: 150 + i * 95,
    ry: 95 + i * 62,
  }));
}
