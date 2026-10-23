import { Component } from '@angular/core';
import { SeriesFooter } from '@motifs/site';
import { HeroSection } from './sections/hero-section/hero-section';
import { PatternMakerSection } from './sections/pattern-maker-section/pattern-maker-section';

@Component({
  selector: 'mt-root',
  imports: [HeroSection, PatternMakerSection, SeriesFooter],
  templateUrl: './app.html',
})
export class App {}
