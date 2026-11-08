# Chop: page plan

- Status: Approved by Valery on 28 October 2026, with its five decisions and one addition: the components, the phone frames and the app screens are polished until they look like the real thing (see Fidelity). It replaces the plan approved on 27 October 2026 (The Circle), whose built page Valery found too much like every app landing page.
- Direction: The Year Wheel, chosen on 28 October 2026 from the [revisit board](https://claude.ai/artifact/SHft9EaM9TxB42nWxBWzpk). It is kept as a page of sections, with three of them pinned for the wheel's set pieces.
- Slug and path: `chop`, `/chop/`. Mood: playful. Accent `#2F7D5B`.

## The idea

Chop is a fictional mobile app from Bamenda for running a njangi, a rotating savings circle, with friends or colleagues. It keeps the book, never the money.

The page runs through one njangi year, Mami Ama's circle of ten in 2027. A giant wheel of twelve months is its motif, and the scroll turns it. The page is still a page of sections that you scroll through like any other. Three of them pin while their scene plays and then let go. The other four scroll freely, each laid out in its own way rather than as a label, a heading and a grid.

| #   | Section         | Kind   | What it does                                                                                                                                                                                           |
| --- | --------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | The year        | Pinned | The opening wheel. January holds the headline, and February to May hold how a njangi works. Then the wheel spins through the remaining turns to October, the last, and shrinks into the header's dial. |
| 2   | Your circle     | Free   | The calculator, drawn as a wheel: one wedge per member, each as long as what they have paid in by their turn, inside a dashed ring for the pot.                                                        |
| 3   | A month in Chop | Pinned | A smaller dial, one month from meeting to meeting. As its hand sweeps round, the app screen at its centre shows each feature on the day it happens.                                                    |
| 4   | The book        | Free   | Trust. The treasurer's exercise book: as it scrolls by, its biro marks are struck out and Chop's statuses are written over them. Below, Chop's four promises are set out as the rules of the book.     |
| 5   | Dues            | Free   | Pricing. Circle is one ring; Treasurer is ten small rings. A Toggle Group switches between monthly and yearly.                                                                                         |
| 6   | Questions       | Free   | The FAQ, an Accordion. Each question is signed by the member who asks it at the meeting.                                                                                                               |
| 7   | Full circle     | Pinned | The wheel comes back, every turn is marked and the ring closes. The store buttons sit inside it, and the footer runs round it.                                                                         |

Pinned, free, pinned, then three free, then pinned: the set pieces have room to breathe. You scroll at your own speed throughout, and nothing takes the scroll away from you. A pin is a sticky stage inside a taller track, so the page keeps scrolling while the stage holds still. Every anchor lands at the top of its section.

## Header and footer, this page's own

Chop's header and footer stop being shared. The series facts become data, beside `SITE` in `@motifs/pages-manifest` (plain TypeScript, so the e2e suites can import it too), and each page lays them out in its own world. `<mt-series-footer>` in `libs/site` keeps spelling the facts out itself, since importing them put Fil 56 bytes over its 120 kB budget; its unit test checks that it says what `seriesFacts()` says. So Fil and the atelier don't change:

```ts
export interface SeriesFacts {
  series: { label: string; href: string }; // "Motifs", "/"
  source: { label: string; href: string }; // "Source on GitHub", the page's folder
  ndop: { label: string; href: string }; // "Built with Ndop UI"
  note: string; // "Fictional brand, design study. Any likeness to a real business is unintended."
}

export function seriesFacts(slug: string, name: string): SeriesFacts;
```

The manifest's unit test covers `seriesFacts()`. Chop's e2e reads the same facts and checks that the page shows all four, with working links. Fil and the atelier keep `<mt-series-footer>` until they are revisited, which is separate work.

**Header: the dial.** The header is the wordmark "Chop" and a small dial in the corner.

- The dial's hand follows the page's scroll, and it has seven marks, one per section. The mark of the section in view lights up. This uses each section's view timeline, shared through `timeline-scope`, with no JavaScript.
- The dial is a button that opens the navigation in a popover: the seven sections laid out round the dial. In the DOM it is a plain list of links, in page order. `popover` and `popovertarget` are HTML, so the menu opens without JavaScript.
- On phones the header stays, and the dial is its only control.

**Footer: the closing ring.** The footer is the last part of "Full circle".

- The series facts sit at the ring's four quarters: Motifs at the top, the source on the right, Ndop UI at the bottom and the fictional-brand note on the left. They are set straight, never on a curved path, so they read easily.
- "Made in Bamenda" sits under the store buttons, inside the ring.
- On phones the four facts stack under the ring.

## 1 · The year (pinned)

The wheel's centre sits below the screen, so only its top arc shows, with the month names round the rim and a "This month" pointer at the top. The scroll turns it by one month per step, and it rests at each month that carries a card:

| Month    | Who chops | Card                                                                                                                       |
| -------- | --------- | -------------------------------------------------------------------------------------------------------------------------- |
| January  | Ama       | "Ten friends. One pot. Every turn comes." and the tagline. This is the page's `h1` and its largest paint, visible at rest. |
| February | Ngwa      | Agree the amount: 25,000 FCFA a month each.                                                                                |
| March    | Ebai      | Draw the order: at the first meeting, often by drawing; members can swap by agreement before money changes hands.          |
| April    | Lum       | Play every month: everyone pays in at every meeting, whoever's turn it is.                                                 |
| May      | Kum       | Chop the pot: each meeting's money goes to one member, until everyone has had a turn.                                      |
| Jun–Oct  | Bih … Yuh | No cards: the wheel spins through five turns in one run, and each member's initial on the rim turns green as they chop.    |
| October  | Yuh       | "Everyone has had the pot once." Then the wheel shrinks into the header's dial.                                            |

"Try the calculator" and "Get the app" are fixed on the stage, below the cards, and never fade. No card holds a link or a control, so focus can never land on something faded out.

Track length: about five screens on desktop and four on phones.

## 2 · Your circle (free): the calculator

**Model** (`circle/circle.ts`), unchanged, with its unit tests:

```ts
interface Circle {
  members: number; // 3 to 20
  contribution: number; // FCFA a month each, 5,000 to 100,000 in steps of 5,000
  start: number; // the first turn's month in 2027, 0 (January) to 11
}

interface Turn {
  month: string; // 'October 2027'; turns past December run into 2028
  member: string; // a fictional first name, from a fixed list of twenty
  paidIn: number; // what this member has paid in by their turn: contribution × turn
  takes: number; // the pot: contribution × members
}

function turns(circle: Circle): readonly Turn[];
function summary(circle: Circle): string;
```

**Controls**, all Ndop and as built in unit 2: Members (Slider, 3 to 20), Each pays a month (Slider, 5,000 to 100,000 FCFA), First turn (Select, January to December 2027), and Show as a table (Toggle).

**The wheel chart.** One wedge per turn, clockwise from the top in month order. Each wedge's length is what that member has paid in by their turn, and a dashed ring marks the pot.

- The first member's wedge is one payment long, and the last one reaches the ring. It is the same arithmetic fact as the bars, drawn as the page's motif.
- The wedge in focus is drawn in full green, and its tooltip shows the month, the member, what they have paid in and what they take.
- Changing a control redraws the chart at once, with no tween.
- As the section enters, the wedges grow out from the centre. This is the one entrance animation in the section.

It is built on Ndop's Chart: `ndChartContainer`, the tooltip, the legend and `ndChartPlot`. The plot keeps its keyboard (the arrow keys, Home and End step through the turns) and its hidden table. Its pointer picks a point by x alone, which doesn't fit a wheel, so `trackPointer` is off and each wedge sets the active turn on `pointerenter`. That is logged as an Ndop gap.

**Layout.** The controls are not boxed in a frame. They sit round the wheel: the members slider above it, the amount below, and the month and the table toggle beside it. On phones they stack under the wheel. The pot and the last turn are written in the wheel's centre.

**Without JavaScript**, the prerendered example (10 members, 25,000 FCFA, January 2027) shows as the table, as now. The calculator stays in `@defer (hydrate on viewport)`.

## 3 · A month in Chop (pinned)

A 30-day dial runs from one meeting to the next, with a phone-sized app screen at its centre, built from Ndop Card, Badge and Button. The screen is inert and `aria-hidden`; the visible text beside the dial carries the content. The hand sweeps the month, and at each day the screen changes and a caption appears:

| Day | Feature                    | On the screen                                                                    |
| --- | -------------------------- | -------------------------------------------------------------------------------- |
| 1   | The treasurer's book       | "March: Ebai took 250,000 FCFA", recorded in the book.                           |
| 9   | Swaps, agreed              | Bih and Tabe swap turns; the treasurer approves; the order changes for everyone. |
| 17  | Gifts for life's big days  | The group gives for Fru's wedding, apart from the pot.                           |
| 29  | A reminder before meetings | "Tomorrow: 25,000 FCFA. It's Lum's turn."                                        |
| 30  | Who has paid, at a glance  | Nine paid and one owing; Lum takes the pot.                                      |

The draw, the sixth feature, is already March's card in the opening wheel.

Track length: about four screens on desktop and three on phones.

## 4 · The book (free): trust

"Chop keeps the book, never the money." The treasurer's exercise book is drawn full width: ruled lines, a red margin, biro in Plus Jakarta Sans italic, as in unit 2's notebook.

- As the page scrolls past, row by row, each biro mark ("paid? ask!", "owes 10 000 ??") is struck through and Chop's status is written in over it as a Badge. The motion is a strike drawn and a wipe; nothing fades and rises.
- Below the book, the four promises are set out as the rules of the book, numbered in the margin: no money passes through Chop, the circle's book is the circle's, the same pot for everyone, leave with your book.

## 5 · Dues (free): pricing

There are two plans, and each is drawn as rings, not as a card grid:

- Circle is one ring of up to twenty seats. It is free.
- Treasurer is ten small rings in a cluster. It costs 1,500 FCFA a month or 15,000 FCFA a year.

The Toggle Group switches the period, and the new price rolls up into place. A Badge reads "Two months free" on yearly. Each plan has its Button. The note says the prices are fictional.

## 6 · Questions (free): the FAQ

There are six questions and answers, as now. Each question carries the initial and name of the member asking it ("Lum asks"). The Accordion is Ndop's, with the `motion-reduce` fix. The section stays in `@defer (hydrate on viewport)`.

## 7 · Full circle (pinned)

The wheel rises back into view at December.

- The ten members' initials turn green one after another, and the ring's stroke closes.
- Inside the ring: "Start the next circle on Chop.", the two store buttons (decision 9 of the first plan), and "Chop is a design study: there's no app to download."
- The footer facts sit round the ring.

Track length: about two and a half screens. The pin ends as the page ends.

## Fidelity

Every component, phone and app screen has to look like a real product, not a wireframe.

- **Ndop components, finished.** Buttons, Cards, Badges, Sliders, the Select, the Toggle Group and the Accordion keep Ndop's anatomy, with this page's finish: soft layered shadows, a pressed state, focus rings in the green, and hover states. They are touched only through classes and tokens in Chop's copies, never by forking an item's behaviour.
- **The phone.** It follows modern phone proportions (19.5:9), with a thin even bezel, a continuous corner radius, a camera island, side buttons drawn on the frame's edge, and a glass highlight. It is CSS and SVG only, with no photograph and no real device's name or logo.
- **The app screens.** Each is a screen of one consistent Chop app, at real phone scale:
  - a status bar (9:41, signal, Wi-Fi and battery glyphs) and a home indicator;
  - a large title and a navigation bar;
  - list rows with members' initials in avatars, amounts in tabular figures, and a four-tab bar (Circle, Book, Members, You);
  - Ndop Card, Badge and Button wherever the app would have them.

  Each screen is inert and `aria-hidden`, and the text beside it carries the content.

- **The wheel's cards** are Ndop Cards, with the card's header, title and description slots.

## Motion

All motion is CSS scroll-driven animation: `scroll()` and `view()` timelines, named timelines, and `timeline-scope` for the header dial. There is no JavaScript and no scroll hijacking.

- The wheel turns on the compositor. Its rotation, each card's counter-rotation and each card's fade are `transform` and `opacity` keyframes with their own `animation-range` on the track's timeline. No animated custom property drives them. The board's specimen used one, `--w`, which means recalculating style on every frame.
- The closing ring's stroke and the book's strikes are small SVG strokes; they are the only non-transform properties animated.
- Section styles are imported by `theme.css` and scoped by the component's tag, as now.

**Reduced motion, or no scroll timelines.** The layout is built as progressive enhancement. The base layout is a plain column:

- The tracks have their natural height.
- The opening wheel's cards are a list of months in order, with the wheel drawn once, still, above them.
- The month dial is a list of five days.
- The book shows Chop's statuses beside the biro marks.
- The closing ring is drawn closed.

The pinned and turning layout applies only under `@supports (animation-timeline: scroll())` and `prefers-reduced-motion: no-preference`. The text order is the same in both layouts.

## Ndop items

`slider`, `select`, `chart`, `accordion`, `toggle-group` (with `toggle`), `card`, `button`, `badge`, as now. No new items.

## Theme, fonts, copy

These are unchanged from unit 1:

- **Theme:** sand, card, ink and green, with `#2A7353` for green words. The opening and closing wheels sit on a deep green ground, `#1F3A2D`. Sand text on it is 10.2:1, and the pale green `#CFE6D9` for small labels is 9.4:1. The brief's green is only 2.5:1 on it, so on the dark ground it marks turns as a fill, never as text. Every pairing is checked by axe on the rendered page.
- **Fonts:** Plus Jakarta Sans, self-hosted, with tabular figures for every amount.
- **Copy:** reworded where a card or a day needs it. Every fact still comes from the first board's checked claims. The revisit needs no new claims, since A's agenda and C's exercise book are dropped.

## JS budget

The page stays within 120 kB, with the same `@defer (hydrate on viewport)` blocks as unit 2: the calculator, pricing and the FAQ. The wheel, the dial, the header menu and the book are CSS and HTML, so they add no script.

**Blocking time.** The first Lighthouse run of the redo measured a median of 355 ms total blocking time, over the 200 ms bar. Most of it was style and layout for sections far below the first screen, under the CPU throttling. The sections below the opening wheel now have `content-visibility: auto`, so the browser skips them until they come near. Each has a placeholder about its real height, and the pinned month's is its five-screen track, so anchors and the dial's timelines stay right. Locally, blocking time fell from 106–156 ms to 37–62 ms, and style and layout time from about 340 ms to 130 ms.

## Ndop gaps

- **Forms code in Slider and Select**, and **the Select's weight**: as logged in unit 2.
- **Chart pointer on a radial plot.** `ndChartPlot` picks the nearest point by x only. The wheel turns `trackPointer` off and sets the active turn per wedge. A future option could be `ndChartPlot` taking a hit-test function.
- **Reduced motion:** the Accordion and the Select take the `motion-reduce` fix, as on Fil.

## What happens to unit 2

Unit 2 is still uncommitted. It isn't committed as it stands, since most of its layout goes. The working tree is reworked into the new units, so history never holds a page that was thrown away.

| Kept from unit 2                                                                                                                                                                            | Replaced                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `content.ts` (reworded), the calculator's controls and logic, pricing's period logic, the Accordion and Select fixes, `withIncrementalHydration()` and the `@defer` blocks, the e2e harness | The hero and its phone, How, Features, Trust, the site header, the page footer, `motion.css` |

## Units

1. **Shell and the opening wheel.**
   - `seriesFacts()` in `libs/site`, with its test, and `expectSeriesFacts(page)`.
   - The dial header with its popover navigation.
   - Section 1 with its fallback column.
   - E2E: the plateaus, reduced motion, no JavaScript, anchors and axe.
2. **Your circle and A month in Chop.** The wheel chart and the month dial, with their tests.
3. **The book, Dues, Questions and Full circle**, with the closing-ring footer.
4. **Launch:** the README, the OG image (rendered from the opening wheel), the launch note and the manifest.

Each unit ends with Lighthouse, axe, a reduced-motion pass and a no-JS pass, and with commit messages and `git add` commands for Valery.

## Tests

- Unit:
  - `turns()`, `summary()` and `fcfa()`, as now.
  - The wedge geometry: angles and lengths at 3 and 20 members.
  - `seriesFacts()`.
- E2E:
  - Scroll each pinned track to each plateau and check that the right card or day is shown.
  - The header dial's marks follow the section in view, and the popover nav works by keyboard.
  - Every anchor lands at its section.
  - The calculator by keyboard, with the live-region summary and the table toggle.
  - The pricing toggle and the FAQ.
  - Reduced motion gives the column, and the page reads without JavaScript.
  - `expectSeriesFacts()`.
  - Axe on the page, an open FAQ item, the open Select, the table view and the open nav.
- Lighthouse on `/chop/` within the quality bar, and no long frames while scrolling a pinned track (checked in a trace).

## Decisions

1. **Direction:** the Year Wheel as a page of seven sections, three of them pinned (the opening wheel, the month dial, the closing ring) and four free.
2. **The calculator as a wheel**, built on Ndop's Chart with per-wedge pointer handling, rather than the bar chart.
3. **The header and footer are this page's own:** a dial with a popover nav, and the closing ring. The series facts come from `libs/site` as data, and an e2e helper checks them. Fil and the atelier follow when they're revisited.
4. **The brief's line.** The spec's "the classic app landing page, done well" becomes: "An app landing page that runs as a njangi's year: a wheel of months turns with the scroll, and the classic sections, from how it works to download, are its months." The spec doc is edited once this plan is approved.
5. **Unit 2** isn't committed as it stands. It is reworked into units 1 to 3 above.
