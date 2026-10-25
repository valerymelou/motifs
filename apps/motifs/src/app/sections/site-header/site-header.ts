import { Component } from '@angular/core';
import { NdIcon } from '@ndop/core';
import { PAGES, SITE } from '@motifs/pages-manifest';
import { header, links } from '../../content';

@Component({
  selector: 'mt-site-header',
  imports: [NdIcon],
  templateUrl: './site-header.html',
})
export class SiteHeader {
  protected readonly copy = header;
  protected readonly links = links;
  protected readonly site = SITE;
  protected readonly count = header.count(
    PAGES.filter((page) => page.status === 'live').length,
    PAGES.length,
  );
}
