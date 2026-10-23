import { Component } from '@angular/core';
import { IntroSection } from './sections/intro-section/intro-section';
import { PagesSection } from './sections/pages-section/pages-section';
import { SiteFooter } from './sections/site-footer/site-footer';

@Component({
  selector: 'mt-root',
  imports: [IntroSection, PagesSection, SiteFooter],
  templateUrl: './app.html',
})
export class App {}
