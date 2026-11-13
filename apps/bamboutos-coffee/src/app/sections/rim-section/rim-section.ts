import { Component } from '@angular/core';
import { rim } from '../../content';
import { photoFallback, photoSrcset } from '../../photos/photo-files';
import { Button } from '../../ui/button/button';

/**
 * The rim: the page's opener, the slope at dawn with the name across the
 * sky. It pins for about two screens while mist rises over the scene and
 * the contour map takes over (rim-section.css).
 *
 * The scene is `rim-dawn`, or on phones an upright crop of its twin,
 * `rim-dawn-tall`; a scrim keeps the cream words legible on the pale sky.
 */
@Component({
  selector: 'mt-rim-section',
  imports: [Button],
  templateUrl: './rim-section.html',
})
export class RimSection {
  protected readonly copy = rim;
  protected readonly photos = {
    wide: photoSrcset('rim-dawn'),
    tall: photoSrcset('rim-dawn-tall'),
    fallback: photoFallback('rim-dawn-tall'),
  };
}
