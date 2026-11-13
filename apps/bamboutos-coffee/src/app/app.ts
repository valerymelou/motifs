import { Component } from '@angular/core';
import { BrewSection } from './sections/brew-section/brew-section';
import { PlotsSection } from './sections/plots-section/plots-section';
import { RimSection } from './sections/rim-section/rim-section';
import { RoastsSection } from './sections/roasts-section/roasts-section';
import { ShopSection } from './sections/shop-section/shop-section';
import { SiteHeader } from './sections/site-header/site-header';
import { TrailheadFooter } from './sections/trailhead-footer/trailhead-footer';
import { WalkSection } from './sections/walk-section/walk-section';

/**
 * Bamboutos Coffee's page: the walk down the mountain, from the rim to the
 * trailhead, where the footer is.
 */
@Component({
  selector: 'mt-root',
  imports: [
    BrewSection,
    PlotsSection,
    RimSection,
    RoastsSection,
    ShopSection,
    SiteHeader,
    TrailheadFooter,
    WalkSection,
  ],
  templateUrl: './app.html',
})
export class App {}
