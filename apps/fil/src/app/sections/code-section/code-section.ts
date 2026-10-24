import { Component } from '@angular/core';
import { CodeSample } from '../../code/code-sample';
import { code } from '../../content';

@Component({
  selector: 'mt-code-section',
  imports: [CodeSample],
  templateUrl: './code-section.html',
})
export class CodeSection {
  protected readonly copy = code;
}
