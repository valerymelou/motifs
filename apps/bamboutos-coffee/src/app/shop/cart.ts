import { computed, Injectable, signal } from '@angular/core';
import {
  grindLabel,
  type Grind,
  roastById,
  type RoastId,
  type Weight,
  weightLabel,
} from './catalogue';

/** One line of the cart: a roast, a size and a grind, and how many bags. */
export interface CartLine {
  readonly key: string;
  readonly roast: RoastId;
  readonly weight: Weight;
  readonly grind: Grind;
  readonly quantity: number;
}

/** What goes in the cart: one bag of a roast, in a size and a grind. */
export interface CartItem {
  readonly roast: RoastId;
  readonly weight: Weight;
  readonly grind: Grind;
}

/**
 * The cart, in memory only: it holds no personal data and isn't stored, so
 * it empties on reload. The header shows its count and, once the shop has
 * loaded, opens its Sheet; the shop adds to it.
 */
@Injectable({ providedIn: 'root' })
export class Cart {
  private readonly items = signal<readonly CartLine[]>([]);

  readonly lines = this.items.asReadonly();
  /** How many bags, all lines together. */
  readonly count = computed(() =>
    this.items().reduce((sum, line) => sum + line.quantity, 0),
  );
  readonly total = computed(() =>
    this.items().reduce(
      (sum, line) => sum + this.price(line) * line.quantity,
      0,
    ),
  );

  /** Whether the cart's Sheet is open. */
  readonly open = signal(false);
  /** Whether the shop, which holds the Sheet, has loaded. */
  readonly ready = signal(false);

  /**
   * Adds one bag; the same roast, size and grind share a line.
   *
   * @returns The line's key, for {@link undoAdd}.
   */
  add(item: CartItem): string {
    const key = `${item.roast}-${item.weight}-${item.grind}`;
    this.items.update((lines) =>
      lines.some((line) => line.key === key)
        ? lines.map((line) =>
            line.key === key ? { ...line, quantity: line.quantity + 1 } : line,
          )
        : [...lines, { key, ...item, quantity: 1 }],
    );
    return key;
  }

  /** Takes back one bag added to a line, as the toast's Undo does. */
  undoAdd(key: string): void {
    this.setQuantity(key, (this.find(key)?.quantity ?? 0) - 1);
  }

  /** Sets a line's quantity; 0 or less removes the line. */
  setQuantity(key: string, quantity: number): void {
    this.items.update((lines) =>
      quantity > 0
        ? lines.map((line) => (line.key === key ? { ...line, quantity } : line))
        : lines.filter((line) => line.key !== key),
    );
  }

  /** One bag's price for a line. */
  price(line: CartItem): number {
    return roastById(line.roast).price[line.weight];
  }

  /** A line as the cart lists it: "Medium roast, 250 g, Filter". */
  describe(line: CartItem): string {
    return `${roastById(line.roast).name} roast, ${weightLabel(line.weight)}, ${grindLabel(line.grind)}`;
  }

  private find(key: string): CartLine | undefined {
    return this.items().find((line) => line.key === key);
  }
}
