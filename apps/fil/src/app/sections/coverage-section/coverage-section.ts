import { Component } from '@angular/core';
import { coverage } from '../../content';

/** Where Fil reaches, by region; the thread knots once at each region. */
@Component({
  selector: 'mt-coverage-section',
  templateUrl: './coverage-section.html',
})
export class CoverageSection {
  protected readonly copy = coverage;
}
