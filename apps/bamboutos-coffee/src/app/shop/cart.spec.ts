import { TestBed } from '@angular/core/testing';
import { Cart } from './cart';
import { fcfa } from './catalogue';

describe('Cart', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = TestBed.inject(Cart);
  });

  it('starts empty and closed', () => {
    expect(cart.lines()).toEqual([]);
    expect(cart.count()).toBe(0);
    expect(cart.total()).toBe(0);
    expect(cart.open()).toBe(false);
  });

  it('merges bags of the same roast, size and grind into one line', () => {
    cart.add({ roast: 'medium', weight: '250g', grind: 'filter' });
    cart.add({ roast: 'medium', weight: '250g', grind: 'filter' });
    cart.add({ roast: 'medium', weight: '250g', grind: 'whole' });

    expect(cart.lines().map((line) => line.quantity)).toEqual([2, 1]);
    expect(cart.count()).toBe(3);
  });

  it('totals each line at its size’s price', () => {
    cart.add({ roast: 'light', weight: '1kg', grind: 'whole' });
    cart.add({ roast: 'dark', weight: '250g', grind: 'espresso' });
    cart.add({ roast: 'dark', weight: '250g', grind: 'espresso' });

    expect(cart.total()).toBe(17_000 + 2 * 4_500);
  });

  it('takes back one bag on undo, and the line once it is empty', () => {
    const key = cart.add({ roast: 'light', weight: '250g', grind: 'filter' });
    cart.add({ roast: 'light', weight: '250g', grind: 'filter' });

    cart.undoAdd(key);
    expect(cart.count()).toBe(1);
    cart.undoAdd(key);
    expect(cart.lines()).toEqual([]);
  });

  it('removes a line set to zero', () => {
    const key = cart.add({ roast: 'medium', weight: '1kg', grind: 'press' });
    cart.setQuantity(key, 3);
    expect(cart.count()).toBe(3);

    cart.setQuantity(key, 0);
    expect(cart.lines()).toEqual([]);
  });

  it('describes a line as the cart lists it', () => {
    expect(
      cart.describe({ roast: 'medium', weight: '250g', grind: 'press' }),
    ).toBe('Medium roast, 250 g, French press');
  });
});

describe('fcfa', () => {
  it('groups thousands and keeps the unit on the same line', () => {
    expect(fcfa(4_500)).toBe('4,500 FCFA');
    expect(fcfa(17_000)).toBe('17,000 FCFA');
  });
});
