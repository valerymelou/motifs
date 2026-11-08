import { Component } from '@angular/core';
import { BookSection } from './sections/book-section/book-section';
import { CalculatorSection } from './sections/calculator-section/calculator-section';
import { FaqSection } from './sections/faq-section/faq-section';
import { FullCircle } from './sections/full-circle/full-circle';
import { MonthSection } from './sections/month-section/month-section';
import { PricingSection } from './sections/pricing-section/pricing-section';
import { SiteHeader } from './sections/site-header/site-header';
import { YearSection } from './sections/year-section/year-section';

/**
 * Chop's page: one njangi year in seven sections, three of them pinned
 * while their scene plays (the year, a month, full circle). The footer is
 * the last of them.
 */
@Component({
  selector: 'mt-root',
  imports: [
    BookSection,
    CalculatorSection,
    FaqSection,
    FullCircle,
    MonthSection,
    PricingSection,
    SiteHeader,
    YearSection,
  ],
  templateUrl: './app.html',
})
export class App {}
