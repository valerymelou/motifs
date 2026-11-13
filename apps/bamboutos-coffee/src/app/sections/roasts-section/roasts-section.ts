import { Component } from '@angular/core';
import { brew, roasts } from '../../content';
import { Bag } from '../../shop/bag';
import { ROASTS } from '../../shop/catalogue';
import { CURVE, roastCurve } from '../../shop/roast-curve';
import { Badge } from '../../ui/badge/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs/tabs';

/**
 * The roasts, at the roastery: Ndop Tabs for light, medium and dark. Each
 * shows its bag with its label; its tasting notes as Badges; and its roast
 * curve, drawn to one scale for all three. Choosing a roast warms the
 * section's ground towards its brown (roasts-section.css).
 */
@Component({
  selector: 'mt-roasts-section',
  imports: [Badge, Bag, Tabs, TabsContent, TabsList, TabsTrigger],
  templateUrl: './roasts-section.html',
})
export class RoastsSection {
  protected readonly copy = roasts;
  protected readonly frame = CURVE;
  protected readonly roasts = ROASTS.map((roast) => ({
    ...roast,
    curve: roastCurve(roast.profile),
    summary: roasts.curve.summary(
      clock(roast.profile.firstCrack),
      clock(roast.profile.drop.time),
      roast.profile.drop.temp,
    ),
    brewName:
      brew.recipes.find((recipe) => recipe.id === roast.brew)?.name ?? '',
  }));
}

/** Minutes as a roaster's clock reads them: 10.75 is "10:45". */
export function clock(minutes: number): string {
  const whole = Math.floor(minutes);
  const seconds = Math.round((minutes - whole) * 60);
  return `${whole}:${String(seconds).padStart(2, '0')}`;
}
