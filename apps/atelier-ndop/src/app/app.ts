import { Component } from '@angular/core';
import { CollectionSection } from './sections/collection-section/collection-section';
import { HeroSection } from './sections/hero-section/hero-section';
import { PageFooter } from './sections/page-footer/page-footer';
import { PatternMakerSection } from './sections/pattern-maker-section/pattern-maker-section';
import { ProcessSection } from './sections/process-section/process-section';
import { SiteHeader } from './sections/site-header/site-header';
import { VisitSection } from './sections/visit-section/visit-section';

@Component({
  selector: 'mt-root',
  imports: [
    CollectionSection,
    HeroSection,
    PageFooter,
    PatternMakerSection,
    ProcessSection,
    SiteHeader,
    VisitSection,
  ],
  templateUrl: './app.html',
})
export class App {}
