import { Component } from '@angular/core';
import { walk } from '../../content';
import { Photo } from '../../photos/photo';

/**
 * The slope's profile, in the land's viewBox (1700 × 1150): the ground
 * line from the farms down to the roastery.
 */
const SLOPE =
  'M0 330 C 180 300, 260 330, 380 390 S 640 540, 760 600 S 1000 740, 1120 790 S 1420 900, 1700 930';

/**
 * The ground: the slope, run on past both ends of the drawing (a ridge
 * to the left, the valley floor to the right) and down off the screen, so
 * no edge shows at the first or last station. The SVG lets it overflow.
 */
const GROUND = `M-900 300 L0 330 ${SLOPE.slice(SLOPE.indexOf('C'))} S 2100 960, 2700 970 L2700 1700 L-900 1700 Z`;

/**
 * Each station's point on that line, measured from the path in a browser.
 * The walk moves the land so each point lands under the bean in turn
 * (walk-section.css keeps the same points in its keyframes).
 */
const POINTS = [
  { x: 300, y: 353 },
  { x: 480, y: 444 },
  { x: 660, y: 547 },
  { x: 850, y: 648 },
  { x: 1010, y: 737 },
];

/** When each station shows, as a share of the pinned track. */
const SHOWN = [
  [0, 14],
  [14, 34],
  [34, 54],
  [54, 74],
  [74, 100],
] as const;

/**
 * Cherry to cup, the brief's signature moment. The section pins while one
 * bean walks down the slope's profile through five stations, changing at
 * each from cherry to roasted bean, and each station's photo plate opens
 * beside it. With reduced motion, or without scroll timelines, the walk is
 * five captioned figures under the profile, drawn once.
 */
@Component({
  selector: 'mt-walk-section',
  imports: [Photo],
  templateUrl: './walk-section.html',
})
export class WalkSection {
  protected readonly copy = walk;
  protected readonly slope = SLOPE;
  protected readonly ground = GROUND;
  protected readonly points = POINTS;
  protected readonly stations = walk.stations.map((station, i) => ({
    ...station,
    point: POINTS[i] ?? { x: 0, y: 0 },
    from: `${SHOWN[i]?.[0] ?? 0}%`,
    to: `${SHOWN[i]?.[1] ?? 100}%`,
  }));
}
