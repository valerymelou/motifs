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
