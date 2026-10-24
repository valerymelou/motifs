import { Component } from '@angular/core';
import { ChangelogSection } from './sections/changelog-section/changelog-section';
import { CodeSection } from './sections/code-section/code-section';
import { CoverageSection } from './sections/coverage-section/coverage-section';
import { FaqSection } from './sections/faq-section/faq-section';
import { FeaturesSection } from './sections/features-section/features-section';
import { HeroSection } from './sections/hero-section/hero-section';
import { PageFooter } from './sections/page-footer/page-footer';
import { PricingSection } from './sections/pricing-section/pricing-section';
import { SiteHeader } from './sections/site-header/site-header';

@Component({
  selector: 'mt-root',
  imports: [
    ChangelogSection,
    CodeSection,
    CoverageSection,
    FaqSection,
    FeaturesSection,
    HeroSection,
    PageFooter,
    PricingSection,
    SiteHeader,
  ],
  templateUrl: './app.html',
})
export class App {}
