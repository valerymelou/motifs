import { Component, inject, signal, type WritableSignal } from '@angular/core';
import { NdIcon } from '@ndop/core';
import { shop } from '../../content';
import { Bag } from '../../shop/bag';
import { Cart, type CartLine } from '../../shop/cart';
import {
  fcfa,
  type Grind,
  GRINDS,
  type Roast,
  ROASTS,
  type Weight,
  WEIGHTS,
} from '../../shop/catalogue';
import { Button } from '../../ui/button/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from '../../ui/select/select';
import {
  Sheet,
  SheetCloseButton,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
} from '../../ui/sheet/sheet';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  Toaster,
  ToasterOutlet,
  ToastList,
  ToastRegion,
  ToastTitle,
} from '../../ui/toast/toast';

/** What a product card has chosen: its bag size and grind. */
interface Choice {
  readonly weight: WritableSignal<Weight>;
  /** As the Select holds it: a grind's id. */
  readonly grind: WritableSignal<string | null>;
}

/**
 * The shop, at the foot of the slope: the three roasts, each with a bag
 * size, a grind (Ndop Select) and Add to cart, which confirms with a Toast
 * that can undo it. The cart is an Ndop Sheet from the side, opened here
 * or from the header's cart button once this section has loaded.
 *
 * It sits in a `@defer (hydrate on viewport)` block (app.html): the
 * Select's and the Sheet's overlay code loads only when the shop scrolls
 * into view.
 */
@Component({
  selector: 'mt-shop-section',
  imports: [
    Bag,
    Button,
    NdIcon,
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectItemText,
    SelectTrigger,
    SelectValue,
    Sheet,
    SheetCloseButton,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetOverlay,
    SheetPortal,
    SheetTitle,
    Toast,
    ToastAction,
    ToastClose,
    ToastContent,
    ToastDescription,
    ToasterOutlet,
    ToastList,
    ToastRegion,
    ToastTitle,
  ],
  templateUrl: './shop-section.html',
})
export class ShopSection {
  protected readonly copy = shop;
  protected readonly roasts = ROASTS;
  protected readonly weights = WEIGHTS;
  protected readonly grinds = GRINDS;
  protected readonly fcfa = fcfa;
  protected readonly cart = inject(Cart);
  protected readonly toaster = inject(Toaster);

  /** Each card's choice, defaulting to a 250 g bag of whole beans. */
  protected readonly choices: Record<string, Choice> = Object.fromEntries(
    ROASTS.map((roast) => [
      roast.id,
      { weight: signal<Weight>('250g'), grind: signal<string | null>('whole') },
    ]),
  );

  /** Whether checkout was pressed: it ends at the design-study note. */
  protected readonly checkedOut = signal(false);

  constructor() {
    // The header's cart button can open the Sheet from now on.
    this.cart.ready.set(true);
  }

  protected choice(roast: Roast): Choice {
    const choice = this.choices[roast.id];
    if (!choice) {
      throw new Error(`No choice for "${roast.id}".`);
    }
    return choice;
  }

  protected add(roast: Roast): void {
    const choice = this.choice(roast);
    const item = {
      roast: roast.id,
      weight: choice.weight(),
      grind: (choice.grind() ?? 'whole') as Grind,
    };
    const key = this.cart.add(item);
    this.toaster.show({
      title: shop.added,
      description: this.cart.describe(item),
      type: 'success',
      action: { label: shop.undo, onClick: () => this.cart.undoAdd(key) },
    });
  }

  protected step(line: CartLine, by: number): void {
    this.cart.setQuantity(line.key, line.quantity + by);
  }

  protected setOpen(open: boolean): void {
    this.cart.open.set(open);
    if (!open) {
      this.checkedOut.set(false);
    }
  }
}
