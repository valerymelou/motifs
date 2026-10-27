import { Component } from '@angular/core';
import { CalculatorSection } from './sections/calculator-section/calculator-section';
import { HeroSection } from './sections/hero-section/hero-section';
import { PageFooter } from './sections/page-footer/page-footer';
import { SiteHeader } from './sections/site-header/site-header';

@Component({
  selector: 'mt-root',
  imports: [CalculatorSection, HeroSection, PageFooter, SiteHeader],
  templateUrl: './app.html',
})
export class App {}
