import { Component } from '@angular/core';
import { siteHeader } from '../../content';
import { CommandPalette } from '../../palette/command-palette';

@Component({
  selector: 'mt-site-header',
  imports: [CommandPalette],
  templateUrl: './site-header.html',
})
export class SiteHeader {
  protected readonly copy = siteHeader;
}
