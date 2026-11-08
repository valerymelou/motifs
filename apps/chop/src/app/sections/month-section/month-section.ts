import { Component } from '@angular/core';
import { month } from '../../content';
import { Phone, StatusBar, TabBar } from '../../phone/phone';
import { Badge } from '../../ui/badge/badge';
import { Button } from '../../ui/button/button';
import { Card, CardContent } from '../../ui/card/card';

/**
 * When each day shows, as a share of the pinned track: the screen and the
 * caption fade in and out round the dial's rest on that day
 * (month-section.css keeps the same rests).
 */
const SHOWN = [
  [0, 16],
  [18, 36],
  [40, 58],
  [62, 80],
  [82, 100],
] as const;

/**
 * "A month in Chop": four weeks of Mami Ama's circle, from the March
 * meeting to the April one, on a dial that turns under a "Today" pointer.
 * At its centre, a phone shows the app on each day the dial rests on: the
 * book, a swap, a gift, the reminder and the next meeting, one feature a
 * day. The section pins while the scroll turns the dial. With reduced
 * motion, or without scroll timelines, the dial rests on the meeting and
 * the days are a list.
 */
@Component({
  selector: 'mt-month-section',
  imports: [Badge, Button, Card, CardContent, Phone, StatusBar, TabBar],
  templateUrl: './month-section.html',
})
export class MonthSection {
  protected readonly copy = month;
  protected readonly app = month.app;
  protected readonly ticks = Array.from({ length: month.length }, (_, i) => i);
  protected readonly marks = month.days
    .filter((day) => day.mark)
    .map((day) => ({ ...day, angle: (day.day * 360) / month.length }));
  protected readonly days = month.days.map((day, i) => ({
    ...day,
    from: `${SHOWN[i]?.[0] ?? 0}%`,
    to: `${SHOWN[i]?.[1] ?? 100}%`,
  }));
  /** Who has given for Fru's wedding, seven of the ten. */
  protected readonly givers = ['A', 'N', 'E', 'L', 'B', 'T', 'Y'];
  protected readonly owing = ['K', 'F', 'N'];
}
