import { Component, input } from '@angular/core';
import { NdIcon } from '@ndop/core';
import { patternMaker } from '../../content';
import { Cloth } from '../../pattern/cloth';
import type { Pattern } from '../../pattern/pattern';
import { Button } from '../../ui/button/button';
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog/dialog';

/** "Order as a scarf": the cloth, its description and an email link. */
@Component({
  selector: 'mt-order-dialog',
  imports: [
    Button,
    Cloth,
    Dialog,
    DialogCloseButton,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
    NdIcon,
  ],
  templateUrl: './order-dialog.html',
  host: { class: 'block' },
})
export class OrderDialog {
  readonly pattern = input.required<Pattern>();
  readonly description = input.required<string>();
  /** The `mailto:` link, with the pattern in the message. */
  readonly link = input.required<string>();

  protected readonly copy = patternMaker;
}
