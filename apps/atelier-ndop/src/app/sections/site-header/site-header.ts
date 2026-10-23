import { Component } from '@angular/core';
import { siteHeader } from '../../content';

@Component({
  selector: 'mt-site-header',
  templateUrl: './site-header.html',
})
export class SiteHeader {
  protected readonly copy = siteHeader;
}
