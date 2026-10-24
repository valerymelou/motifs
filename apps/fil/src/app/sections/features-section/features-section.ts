import { Component } from '@angular/core';
import { features } from '../../content';

@Component({
  selector: 'mt-features-section',
  templateUrl: './features-section.html',
})
export class FeaturesSection {
  protected readonly copy = features;
}
