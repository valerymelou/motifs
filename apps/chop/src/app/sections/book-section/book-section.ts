import { Component } from '@angular/core';
import { book } from '../../content';
import { Badge } from '../../ui/badge/badge';

/**
 * "The book": trust. The treasurer's exercise book for March; as it
 * scrolls past, each biro mark is struck through and Chop's status is
 * written in over it (book-section.css). Below, Chop's four promises,
 * set out as the rules of the book.
 */
@Component({
  selector: 'mt-book-section',
  imports: [Badge],
  templateUrl: './book-section.html',
})
export class BookSection {
  protected readonly copy = book;
  protected readonly numerals = ['i.', 'ii.', 'iii.', 'iv.'];
}
