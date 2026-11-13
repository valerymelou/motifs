import { Component } from '@angular/core';
import { RimSection } from './sections/rim-section/rim-section';
import { SiteHeader } from './sections/site-header/site-header';
import { TrailheadFooter } from './sections/trailhead-footer/trailhead-footer';

/**
 * Bamboutos Coffee's page: the walk down the mountain, from the rim to the
 * trailhead, where the footer is.
 */
@Component({
  selector: 'mt-root',
  imports: [RimSection, SiteHeader, TrailheadFooter],
  templateUrl: './app.html',
})
export class App {}
