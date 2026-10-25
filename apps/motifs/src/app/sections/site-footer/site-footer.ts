import { Component } from '@angular/core';
import { NdIcon } from '@ndop/core';
import { SITE } from '@motifs/pages-manifest';
import { links, siteFooter } from '../../content';

@Component({
  selector: 'mt-site-footer',
  imports: [NdIcon],
  templateUrl: './site-footer.html',
})
export class SiteFooter {
  protected readonly copy = siteFooter;
  protected readonly links = links;
  protected readonly site = SITE;
}
