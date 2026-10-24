import { computed, Directive, input } from '@angular/core';
import { cn } from '../../lib/utils';

/**
 * Scrolls a wide table sideways instead of the page. Wrap the
 * `table[ndTable]` in it.
 *
 * @example
 * ```html
 * <div ndTableContainer><table ndTable>…</table></div>
 * ```
 */
@Directive({
  selector: '[ndTableContainer]',
  host: { 'data-slot': 'table-container', '[class]': 'classes()' },
})
export class TableContainer {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('relative w-full overflow-x-auto', this.class()),
  );
}

/**
 * A styled native table. Its parts style the table's own elements, so the
 * table keeps all of its semantics.
 *
 * @example
 * ```html
 * <table ndTable>
 *   <caption ndTableCaption>Recent invoices</caption>
 *   <thead ndTableHeader><tr ndTableRow><th ndTableHead>Invoice</th></tr></thead>
 *   <tbody ndTableBody><tr ndTableRow><td ndTableCell>INV001</td></tr></tbody>
 * </table>
 * ```
 */
@Directive({
  selector: 'table[ndTable]',
  host: { 'data-slot': 'table', '[class]': 'classes()' },
})
export class Table {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('w-full caption-bottom text-sm', this.class()),
  );
}

/**
 * A table's header rows.
 *
 * @example
 * ```html
 * <thead ndTableHeader>…</thead>
 * ```
 */
@Directive({
  selector: 'thead[ndTableHeader]',
  host: { 'data-slot': 'table-header', '[class]': 'classes()' },
})
export class TableHeader {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('[&_tr]:border-b', this.class()),
  );
}

/**
 * A table's body rows.
 *
 * @example
 * ```html
 * <tbody ndTableBody>…</tbody>
 * ```
 */
@Directive({
  selector: 'tbody[ndTableBody]',
  host: { 'data-slot': 'table-body', '[class]': 'classes()' },
})
export class TableBody {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('[&_tr:last-child]:border-0', this.class()),
  );
}

/**
 * A table's footer rows, such as totals.
 *
 * @example
 * ```html
 * <tfoot ndTableFooter>…</tfoot>
 * ```
 */
@Directive({
  selector: 'tfoot[ndTableFooter]',
  host: { 'data-slot': 'table-footer', '[class]': 'classes()' },
})
export class TableFooter {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', this.class()),
  );
}

/**
 * A table row; `data-state="selected"` highlights it.
 *
 * @example
 * ```html
 * <tr ndTableRow>…</tr>
 * ```
 */
@Directive({
  selector: 'tr[ndTableRow]',
  host: { 'data-slot': 'table-row', '[class]': 'classes()' },
})
export class TableRow {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted',
      this.class(),
    ),
  );
}

/**
 * A header cell. Add `scope="col"` or `scope="row"` as fits.
 *
 * @example
 * ```html
 * <th ndTableHead scope="col">Status</th>
 * ```
 */
@Directive({
  selector: 'th[ndTableHead]',
  host: { 'data-slot': 'table-head', '[class]': 'classes()' },
})
export class TableHead {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'h-10 px-2 text-start align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]',
      this.class(),
    ),
  );
}

/**
 * A data cell.
 *
 * @example
 * ```html
 * <td ndTableCell>INV001</td>
 * ```
 */
@Directive({
  selector: 'td[ndTableCell]',
  host: { 'data-slot': 'table-cell', '[class]': 'classes()' },
})
export class TableCell {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn(
      'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]',
      this.class(),
    ),
  );
}

/**
 * A table's caption, which names it; shown under the table.
 *
 * @example
 * ```html
 * <caption ndTableCaption>Recent invoices</caption>
 * ```
 */
@Directive({
  selector: 'caption[ndTableCaption]',
  host: { 'data-slot': 'table-caption', '[class]': 'classes()' },
})
export class TableCaption {
  /** Extra classes, merged last so they win. */
  readonly class = input('');

  protected readonly classes = computed(() =>
    cn('mt-4 text-sm text-muted-foreground', this.class()),
  );
}
