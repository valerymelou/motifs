import { Component } from '@angular/core';
import { changelog } from '../../content';
import { Badge } from '../../ui/badge/badge';

@Component({
  selector: 'mt-changelog-section',
  imports: [Badge],
  templateUrl: './changelog-section.html',
})
export class ChangelogSection {
  protected readonly copy = changelog;
  protected readonly variants = {
    New: 'default',
    Improved: 'secondary',
    Fixed: 'outline',
  } as const;
}
