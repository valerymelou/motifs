import { Component } from '@angular/core';
import { rim } from '../../content';
import { Button } from '../../ui/button/button';

/**
 * The rim: the page's opener, the slope at dawn with the name across the
 * sky. It pins for about two screens while mist rises over the scene and
 * the contour map takes over (rim-section.css).
 *
 * Until the photos are generated, the scene is a drawn stand-in: a dawn
 * sky and four ridges. `rim-dawn` and its phone twin replace it.
 */
@Component({
  selector: 'mt-rim-section',
  imports: [Button],
  templateUrl: './rim-section.html',
})
export class RimSection {
  protected readonly copy = rim;
}
