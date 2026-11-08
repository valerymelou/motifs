import { Component } from '@angular/core';
import { NdIcon } from '@ndop/core';
import { faq } from '../../content';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '../../ui/accordion/accordion';

/**
 * "Questions": six questions from the meeting, each signed by the member
 * who asks it, answered with the facts checked on the board.
 */
@Component({
  selector: 'mt-faq-section',
  imports: [
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionItem,
    AccordionTrigger,
    NdIcon,
  ],
  templateUrl: './faq-section.html',
})
export class FaqSection {
  protected readonly copy = faq;
}
