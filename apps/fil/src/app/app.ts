import { Component } from '@angular/core';
import { CodeSection } from './sections/code-section/code-section';
import { HeroSection } from './sections/hero-section/hero-section';
import { PageFooter } from './sections/page-footer/page-footer';
import { SiteHeader } from './sections/site-header/site-header';

@Component({
  selector: 'mt-root',
  imports: [CodeSection, HeroSection, PageFooter, SiteHeader],
  templateUrl: './app.html',
})
export class App {}
