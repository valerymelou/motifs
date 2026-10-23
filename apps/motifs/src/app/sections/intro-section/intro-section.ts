import { Component } from '@angular/core';
import { SITE } from '@motifs/pages-manifest';
import { intro } from '../../content';

@Component({
  selector: 'mt-intro-section',
  templateUrl: './intro-section.html',
})
export class IntroSection {
  protected readonly intro = intro;
  protected readonly site = SITE;
}
