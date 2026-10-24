import { Component } from '@angular/core';
import { story } from '../../content';
import { Photo } from '../../photos/photo';

/**
 * Where ndop comes from, how it's made and worn, and what its motifs mean,
 * in four numbered chapters beside two photos that move with the scroll.
 */
@Component({
  selector: 'mt-story-section',
  imports: [Photo],
  templateUrl: './story-section.html',
})
export class StorySection {
  protected readonly copy = story;
  protected readonly made = story.chapters.slice(0, 2);
  protected readonly lived = story.chapters.slice(2);
}
