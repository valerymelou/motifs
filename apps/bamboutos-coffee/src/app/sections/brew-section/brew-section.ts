import { Component } from '@angular/core';
import { NdIcon } from '@ndop/core';
import { brew } from '../../content';
import { Photo } from '../../photos/photo';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '../../ui/accordion/accordion';

/**
 * The brew guide: the house recipes in an Ndop Accordion, each with its
 * dose, water, temperature, grind and time, then its steps. Each roast's
 * "Best brewed" link lands on its recipe. The recipes are the roaster's
 * own, not facts about Cameroon.
 */
@Component({
  selector: 'mt-brew-section',
  imports: [
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionItem,
    AccordionTrigger,
    NdIcon,
    Photo,
  ],
  templateUrl: './brew-section.html',
})
export class BrewSection {
  protected readonly copy = brew;
  protected readonly facts = [
    'dose',
    'water',
    'temperature',
    'grind',
    'time',
  ] as const;
}
