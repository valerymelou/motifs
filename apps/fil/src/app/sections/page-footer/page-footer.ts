import { Component } from '@angular/core';
import { SeriesFooter } from '@motifs/site';
import { pageFooter } from '../../content';

@Component({
  selector: 'mt-page-footer',
  imports: [SeriesFooter],
  templateUrl: './page-footer.html',
})
export class PageFooter {
  protected readonly copy = pageFooter;
}
