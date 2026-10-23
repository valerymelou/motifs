import { Component } from '@angular/core';
import { SeriesFooter } from '@motifs/site';
import { ORDER_ADDRESS, pageFooter } from '../../content';

@Component({
  selector: 'mt-page-footer',
  imports: [SeriesFooter],
  templateUrl: './page-footer.html',
})
export class PageFooter {
  protected readonly copy = pageFooter;
  protected readonly email = ORDER_ADDRESS;
}
