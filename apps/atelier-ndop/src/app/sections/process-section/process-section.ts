import { Component } from '@angular/core';
import { process } from '../../content';
import { Photo } from '../../photos/photo';

@Component({
  selector: 'mt-process-section',
  imports: [Photo],
  templateUrl: './process-section.html',
})
export class ProcessSection {
  protected readonly copy = process;
}
