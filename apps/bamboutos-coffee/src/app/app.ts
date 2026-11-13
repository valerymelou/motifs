import { Component } from '@angular/core';
import { PlotsSection } from './sections/plots-section/plots-section';
import { RimSection } from './sections/rim-section/rim-section';
import { SiteHeader } from './sections/site-header/site-header';
import { TrailheadFooter } from './sections/trailhead-footer/trailhead-footer';
import { WalkSection } from './sections/walk-section/walk-section';

/**
 * Bamboutos Coffee's page: the walk down the mountain, from the rim to the
 * trailhead, where the footer is.
 */
@Component({
  selector: 'mt-root',
  imports: [PlotsSection, RimSection, SiteHeader, TrailheadFooter, WalkSection],
  templateUrl: './app.html',
})
export class App {}
