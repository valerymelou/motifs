import { Component } from '@angular/core';
import { SITE } from '@motifs/pages-manifest';
import { intro, siteFooter } from '../../content';

@Component({
  selector: 'mt-site-footer',
  templateUrl: './site-footer.html',
})
export class SiteFooter {
  protected readonly copy = siteFooter;
  protected readonly links = intro.links;
  protected readonly site = SITE;
}
