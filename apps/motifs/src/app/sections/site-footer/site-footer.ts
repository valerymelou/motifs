import { Component } from '@angular/core';
import { SITE } from '@motifs/pages-manifest';
import { siteFooter } from '../../content';

@Component({
  selector: 'mt-site-footer',
  templateUrl: './site-footer.html',
})
export class SiteFooter {
  protected readonly copy = siteFooter;
  protected readonly site = SITE;
}
