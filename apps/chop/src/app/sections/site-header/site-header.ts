import { Component } from '@angular/core';
import { siteHeader } from '../../content';
import { Button } from '../../ui/button/button';

@Component({
  selector: 'mt-site-header',
  imports: [Button],
  templateUrl: './site-header.html',
})
export class SiteHeader {
  protected readonly copy = siteHeader;
}
