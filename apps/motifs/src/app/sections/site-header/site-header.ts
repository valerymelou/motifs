import { Component } from '@angular/core';
import { PAGES, SITE } from '@motifs/pages-manifest';
import { header } from '../../content';

@Component({
  selector: 'mt-site-header',
  templateUrl: './site-header.html',
})
export class SiteHeader {
  protected readonly copy = header;
  protected readonly site = SITE;
  protected readonly count = header.count(
    PAGES.filter((page) => page.status === 'live').length,
    PAGES.length,
  );
}
