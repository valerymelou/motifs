import { Component } from '@angular/core';
import { ClothHero } from './sections/cloth-hero/cloth-hero';
import { IdentitiesSection } from './sections/identities-section/identities-section';
import { MakingSection } from './sections/making-section/making-section';
import { MotifsSection } from './sections/motifs-section/motifs-section';
import { SiteFooter } from './sections/site-footer/site-footer';
import { SiteHeader } from './sections/site-header/site-header';

@Component({
  selector: 'mt-root',
  imports: [
    ClothHero,
    IdentitiesSection,
    MakingSection,
    MotifsSection,
    SiteFooter,
    SiteHeader,
  ],
  templateUrl: './app.html',
})
export class App {}
