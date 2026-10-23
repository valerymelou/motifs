import { Component } from '@angular/core';
import { SITE } from '@motifs/pages-manifest';
import { making } from '../../content';

@Component({
  selector: 'mt-making-section',
  templateUrl: './making-section.html',
})
export class MakingSection {
  protected readonly copy = making;
  protected readonly commands = [
    `git clone ${SITE.repoUrl}.git`,
    'cd motifs && pnpm install',
    'pnpm nx serve motifs',
  ];
}
