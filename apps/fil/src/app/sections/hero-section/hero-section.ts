import { Component } from '@angular/core';
import { hero } from '../../content';
import { Button } from '../../ui/button/button';

/**
 * The opening: the promise, and a request to Fil with its reply in a
 * terminal, whose last line starts the thread that runs down the page.
 */
@Component({
  selector: 'mt-hero-section',
  imports: [Button],
  templateUrl: './hero-section.html',
})
export class HeroSection {
  protected readonly copy = hero;
}
