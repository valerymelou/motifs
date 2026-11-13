# Chop

Run your njangi with friends, without the notebook.

Part of [Motifs](../../README.md), served at `/chop/`. Mood: playful.

## Brand idea

A fictional mobile app from Bamenda for running a njangi, a rotating savings circle, with friends or colleagues. _Chop_ comes from "chop njangi", to take the pot; the practice keeps its own name in the copy. The brief named the page Njangi, but a real savings-circle app already has that name. Chop keeps the book, never the money: members pay each other as they always have, and the app records who paid, whose turn it is, and reminds people.

The art direction is the Year Wheel, chosen from the [revisit board](https://claude.ai/artifact/SHft9EaM9TxB42nWxBWzpk) after a first, more conventional page was set aside. The full plan is in [`docs/plans/chop.md`](../../docs/plans/chop.md).

The page runs through one njangi year, Mami Ama's circle of ten in 2027, in seven sections you scroll straight through. Three of them pin while their scene plays, then let go:

1. **The year (pinned).** A wheel of twelve months fills the screen, its top arc under a "This month" pointer. The scroll turns it a month at a time: January's card holds the headline, February to May how a njangi works. Then it runs through June to October, each member's seat turning green as they chop, and shrinks into the header's dial.
2. **Your circle.** The calculator, drawn as a wheel: one wedge per turn, each as long as what that member has paid in by then, inside a dashed ring for the pot. The controls sit round it.
3. **A month in Chop (pinned).** A 28-day dial from the March meeting to the April one turns round a phone. On five days, the phone shows that day's screen: the book, a swap, a gift for a wedding, the reminder on the lock screen, and who has paid.
4. **The book.** The treasurer's exercise book. As each row scrolls past, its biro mark is struck through and Chop's status is written over it. Below, Chop's four promises, as the rules of the book.
5. **Dues.** Circle is drawn as one ring of twenty seats, Treasurer as ten small rings.
6. **Questions.** Each question is signed by the member who asks it.
7. **Full circle (pinned).** The page's footer. The wheel comes back at December, every turn is marked and the ring closes round the store buttons. The series facts sit at its four quarters.

The header is the wordmark and a dial: its hand follows the scroll, the mark of the section in view lights, and it opens the sections menu, laid out round a ring. The menu is a native popover, so it works without JavaScript.

The app, its prices and its store buttons are fictional, and the page says so.

## Ndop items

`slider`, `select`, `chart`, `accordion`, `toggle-group` (with `toggle`), `card`, `button` and `badge`, added with `ndop add` (ADR-0002).

Restyled through tokens and the page's own classes: thicker slider tracks, the Select as a rounded field, the Toggle Group as a pill switch, layered shadows and pressed states on Buttons, and Cards with the app's radius.

Edits to the copied files, each commented where it is made:

- **`accordion` and `select`.** They add `motion-reduce` variants, since Ndop's animations run even with reduced motion. The accordion repeats its `data-[state]` variants, which outweigh the animation's own.

Worked around in the page, not in the copies:

- **The wheel chart.** `ndChartPlot` picks the point nearest the pointer by x alone, which doesn't fit a wheel. The calculator turns `trackPointer` off and each wedge sets the active turn on `pointerenter`; the plot's arrow keys, Home and End still step through the turns.
- **Forms code.** Slider, Select and Toggle Group import `@angular/forms` without a form. The calculator, Dues and Questions sit in `@defer (hydrate on viewport)` blocks, so that code and the Select's overlay load only when they come into view.

`src/app/lib/icons.ts` registers only the icons the page draws, inlined from Lucide: the chevron, the check and the phone on the store buttons. The Ndop gaps are in the build spec's gaps table.

## The phone

`src/app/phone/` draws a phone in CSS: modern proportions, a thin bezel, a camera island, side buttons and a glass highlight, with no real device's name or look. Its screen is laid out at a real phone's size, 390 by 844, and scaled as one, so the app inside is drawn at true scale: a status bar, a large title, 44-pixel rows and a four-tab bar, built from the page's own Ndop Cards, Badges and Buttons. The phone is inert and hidden from screen readers; the figure's caption says what it shows.

## Theme and motion

Plus Jakarta Sans alone, with tabular figures for every amount. A fallback face sized like it is declared in `index.html`, so the headline takes the same room before and after the web font loads.

Colours: warm sand, card, ink and the brief's green `#2F7D5B`, with a deep green `#1F3A2D` behind the two wheels. The brief's green is too light for text on sand (4.1:1), so green words take `#2A7353`.

Motion is CSS scroll-driven animation, imported by `theme.css` and scoped by component tags, so it costs no JavaScript:

- Each section has a named view timeline, shared with the whole page through `timeline-scope`, so the header's dial can follow all seven.
- The pinned sections are tall tracks whose stage is sticky. The wheels turn on the compositor: every moving part is a `transform` or `opacity` keyframe with its own `animation-range`, never an animated custom property.
- The calculator's wedges grow out as it enters; the book's strikes draw and its statuses wipe in.

With reduced motion, or without scroll timelines, the layout falls back to plain columns: the wheel rests on January above a list of the month cards, the month dial rests on the meeting above a list of the days, and the closing ring is drawn closed.

The sections below the opening wheel have `content-visibility: auto`, with a placeholder about their height, so the first load lays out only what's on screen.

## Sources

The page's facts, as the [art direction board](https://claude.ai/artifact/WqHa3QkCdTgcXQptxQpBjs) checked them:

- [IMTFI, UC Irvine, 2015](https://blog.imtfi.uci.edu/2015/09/njangi-sociality-new-money-technologies.html):
  - a njangi is a rotating savings and credit association, called njangi by English-speaking Cameroonians and tontine by French-speaking ones;
  - paying in is "playing" njangi and taking the pot is "chopping" it;
  - groups also give at members' weddings, births, baptisms and funerals.
- [Wikipedia, Rotating savings and credit association](https://en.wikipedia.org/wiki/Rotating_savings_and_credit_association):
  - members pay the same amount at each meeting, and each meeting's money goes to one member until all have had a turn;
  - the order is agreed before the first payment, often by drawing, and members can swap by agreement.
- [Wikipedia, Central African CFA franc](https://en.wikipedia.org/wiki/Central_African_CFA_franc): Cameroon's currency, FCFA (XAF).

That an early turn works like a loan and a late one like savings follows from the rules above. Lending at interest, bidding for turns and how many people belong to njangis are left out on purpose. The member names are common first names, for fictional people; Bamenda appears only as the team's home.

## Asset credits

| Asset                         | Source                                                                                                                             | License |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `public/og.png`               | Rendered from the page's copy and font by `og/render-og.mts` (`nx run chop:og`)                                                    | MIT     |
| `public/favicon.svg`          | The ring motif from the index's motif set                                                                                          | MIT     |
| The wheels, dials and phone   | Drawn in CSS and SVG for this page                                                                                                 | MIT     |
| Plus Jakarta Sans             | [The Plus Jakarta Sans Project Authors](https://github.com/tokotype/PlusJakartaSans), via `@fontsource-variable/plus-jakarta-sans` | SIL OFL |
| Chevron, check, phone icons   | [Lucide](https://lucide.dev)                                                                                                       | ISC     |
| Tab bar and lock screen icons | [Lucide](https://lucide.dev), inlined in the drawn screens                                                                         | ISC     |
