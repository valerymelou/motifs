import { Component } from '@angular/core';
import { MEMBERS } from '../../circle/circle';
import { year } from '../../content';
import { Button } from '../../ui/button/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card/card';

/**
 * When, as a share of the pinned track, each member's seat turns green:
 * once at each of January to May's rests, then one by one through the run
 * from June to October (year-section.css keeps the same timings).
 */
const CHOPPED_AT = [3, 15, 27, 39, 51, 59.8, 64.6, 69.4, 74.2, 79];

/**
 * Where each card shows, as a share of the track: from fading in to faded
 * out, round its month's rest. January's is the page's headline, shown at
 * rest; October's holds until the wheel shrinks into the header's dial.
 */
const SHOWN: Record<number, readonly [number, number]> = {
  0: [0, 10],
  1: [8, 22],
  2: [20, 34],
  3: [32, 46],
  4: [44, 58],
  9: [76, 90],
};

/**
 * The opening: a wheel of twelve months whose top arc fills the screen.
 * The section pins while the scroll turns it, one month a step: January's
 * card holds the headline, February to May how a njangi works, then the
 * wheel runs through June to October, the last turn, and shrinks into the
 * header's dial. With reduced motion, or without scroll timelines, the
 * wheel stays on January and the cards are a column (year-section.css).
 */
@Component({
  selector: 'mt-year-section',
  imports: [Button, Card, CardDescription, CardHeader, CardTitle],
  templateUrl: './year-section.html',
})
export class YearSection {
  protected readonly copy = year;
  protected readonly seats = MEMBERS.slice(0, 10).map((name, i) => ({
    name,
    initial: name[0],
    month: i,
    choppedAt: `${CHOPPED_AT[i]}%`,
  }));
  protected readonly cards = year.cards.map((card) => {
    const [from, to] = SHOWN[card.month] ?? [0, 0];
    return { ...card, from: `${from}%`, to: `${to}%` };
  });
}
