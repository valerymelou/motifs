# Chop: page plan

- Status: Approved by Valery on 27 October 2026, with the board's eight decisions as recommended, its facts confirmed, the name Chop kept after weighing Njangi, and decisions 9 and 10.
- Direction: The Circle, chosen on 27 October 2026 from the [art direction board](https://claude.ai/artifact/WqHa3QkCdTgcXQptxQpBjs), with B's notebook as one small moment in "How a njangi works".
- Slug and path: `chop`, `/chop/` (was `njangi`). Mood: playful. Accent `#2F7D5B`.

## The idea

A fictional mobile app from Bamenda for running a njangi, a rotating savings circle, with friends or colleagues. The brief's page was called Njangi, but a real savings-circle app already has that name, so the app is called _Chop_, after "chop njangi", to take the pot. The practice keeps its own name in the copy: "Run your njangi on Chop."

The page is a circle of members, the index's ring motif for this page. In the hero phone, the pot passes from member to member as you scroll, one turn a month. The calculator draws the same circle as a chart: each member's turn, what they've paid in by then, and the pot they take.

Chop keeps the book, never the money (decision 4). Members pay each other as they do now; Chop records who paid, whose turn it is, and reminds people.

## Sections, in order

| Section            | Component               | What it holds                                                                                                                                                                                    |
| ------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Header             | `mt-site-header`        | Wordmark, anchors to How it works, Calculator, Pricing and FAQ, a "Get the app" Button to the store buttons                                                                                      |
| Hero               | `mt-hero-section`       | "Ten friends. One pot. Every turn comes." and a line on running a njangi without the notebook; the phone, drawn from Ndop Cards, Badge and Button; links to the calculator and the store buttons |
| How a njangi works | `mt-how-section`        | Four steps (agree the amount, draw the order, pay in each month, one member chops the pot) and the notebook moment: the treasurer's exercise book beside the same month in Chop                  |
| Calculator         | `mt-calculator-section` | The signature moment, below                                                                                                                                                                      |
| Features           | `mt-features-section`   | Six features on Cards: reminders before each meeting, who has paid, the draw for the order, swapping turns, contributions for a member's wedding, birth or funeral, and the treasurer's record   |
| Trust              | `mt-trust-section`      | What Chop doesn't do: it never holds, moves or lends money, and only the circle's members see the circle's book. No licence claims, no mobile money provider named                               |
| Pricing            | `mt-pricing-section`    | A Toggle Group for monthly or yearly; two Cards: Circle (free, one circle) and Treasurer (several circles), in FCFA, marked fictional, with a Badge on the yearly saving                         |
| FAQ                | `mt-faq-section`        | An Accordion of six questions, answered with the checked facts                                                                                                                                   |
| Get the app        | `mt-get-app-section`    | Two store buttons, placeholder links (decision 9)                                                                                                                                                |
| Footer             | `mt-page-footer`        | Chop's details and "Made in Bamenda", then the series footer with the fictional-brand note                                                                                                       |

## Signature moment: the calculator

**Model** (`circle/circle.ts`), pure functions with unit tests:

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
// "10 members at 25,000 FCFA: each takes 250,000 FCFA once; the last turn is October 2027."
```

**Controls**, all Ndop:

| Control           | Ndop item                         | Does                                                |
| ----------------- | --------------------------------- | --------------------------------------------------- |
| Members           | Slider                            | 3 to 20; arrow keys by one, Page Up and Down by ten |
| Each pays a month | Slider                            | 5,000 to 100,000 FCFA, in steps of 5,000            |
| First turn        | Select                            | January to December 2027                            |
| Show as a table   | Toggle (in a Toggle Group of one) | Swaps the chart for the visible table               |

**The chart:** Ndop's bar Chart, one bar per turn, each the member's paid-in-by-then, against a dashed line at the pot. The bar the chart's arrow keys or pointer are on is drawn in full green with its tooltip (month, member, paid in, takes); at rest it's the first turn. The pot line and that bar are plain SVG in our template, since Ndop's Chart is drawn there. The first member's bar is one payment tall and the last reaches the line: the arithmetic fact, drawn.

**Number format:** amounts as "250,000 FCFA" in the copy, set in tabular figures, through one `fcfa(n)` formatter with its own test.

**Keyboard:** each slider by arrow keys and Page Up and Down; the Select by Ndop's own keys; the chart is one tab stop whose arrow keys step through the turns. **Screen readers:** after a change settles, a polite live region reads the summary once; Ndop's Chart reads each bar and keeps a hidden table. **Without JavaScript:** the prerendered example (10 members, 25,000 FCFA, January 2027) shows as the table.

## The hero phone

A phone frame drawn in CSS, its screen made of the page's own Ndop components, so it is real UI rather than a picture:

- A Card for "Mami Ama's circle", with a Badge "This month: Ebai".
- The ring of ten members' initials, the pot "250,000 FCFA this month" in its middle, and a marker on the member whose turn it is.
- A "Mark Lum as paid" Button that does nothing but look like the app (inert, `aria-hidden` with the rest of the screen); a caption below the phone says what it shows, for screen readers.

As the hero scrolls away, the marker turns one member per step, by `transform`, and the month under the ring rolls with it: ten stacked lines moved by `translateY` in steps. The letters stay upright because only the marker's orbit rotates, never the ring.

## The notebook moment

In "How a njangi works", two Cards side by side (stacked on phones). Before: the treasurer's exercise book, with ruled lines, a margin, ticks, a crossing-out and "paid? ask!", set in Plus Jakarta Sans italic in biro blue (no handwriting face, decision 7). After: the same month as Chop shows it, every member's status as a Badge. As the section enters, the notebook's rows rise into the app card's rows.

## Motion

All scroll-linked motion is CSS scroll-driven animation (`animation-timeline: view()`), as on the atelier and Fil: no JavaScript, transform and opacity only, behind `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`. Section styles are imported by `theme.css` and scoped by the component's tag, not `styleUrl`.

| Where           | Moves                                                                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header          | Sticky from 40rem; its surface slims and a soft shadow comes in over the first 8rem of scroll. On phones it scrolls away.                                   |
| Hero            | The label, line and links rise in; the phone settles up into place. The headline stays still: it is the largest paint. Then the marker turns as you scroll. |
| How it works    | Steps rise in one after another; the notebook's rows rise into the app card.                                                                                |
| Calculator      | Bars grow from the baseline as the section enters. A change in the controls redraws at once, with no tween, so the chart never lags the sliders.            |
| Features, trust | Cards rise in.                                                                                                                                              |
| Pricing         | A new price rolls up into its place when the period changes.                                                                                                |
| FAQ             | Ndop's own height animation, with the `motion-reduce` fix as on Fil.                                                                                        |
| Footer          | The ring turns once into place.                                                                                                                             |

With reduced motion, or without scroll timelines, the ring stays still on March, Ebai's turn, the bars are drawn in full, and nothing moves.

## Ndop items

`ndop add` per ADR-0002: `slider`, `select`, `chart`, `accordion`, `toggle-group` (with `toggle`), `card`, `button`, `badge`. `icons.ts` keeps only the icons these items draw. The brief allows Tabs or Toggle Group for the pricing period; Toggle Group is used, so the manifest's `ndopItems` swaps `tabs` for `toggle-group` at launch.

## Theme (`src/theme.css`)

| Token                           | Value                 | Role                                                       |
| ------------------------------- | --------------------- | ---------------------------------------------------------- |
| `--background`                  | sand `#F1E9DA`        | Page ground, with the ring as a faint 28px tile            |
| `--card`                        | `#FBF7EF`             | Cards, the phone's screen                                  |
| `--foreground`                  | ink `#1C2A22`         | Text, 12.4:1 on sand                                       |
| `--primary`                     | green `#2F7D5B`       | Buttons (white text, 5.0:1), bars, the ring and its marker |
| `--accent-text`                 | `#2A7353`             | Green words: 4.7:1 on sand, 5.4:1 on card                  |
| `--muted`, `--muted-foreground` | sand shade, `#5B6B60` | Quiet surfaces and secondary text, 4.7:1 on sand           |
| `--radius`                      | `1.25rem`             | Soft, like the app's screens                               |

**A correction to the board:** it said `#2F7D5B` passes 4.5:1 for text on sand. It doesn't: 4.1:1 on sand, 4.7:1 on the card. So the brief's green stays for fills and white-on-green buttons, and green words take `--accent-text`, the same hue a step darker.

Light only: the brief's look is warm sand, and the page has no theme switch. All values written in OKLCH in the file, and every text pairing is checked in the e2e axe run on the rendered page, as on Fil.

**The ring tile** is a small SVG data-URI tile, not a repeating gradient, after the scroll jank fixed on the index and the atelier.

**Fonts:** Plus Jakarta Sans alone, SIL OFL, self-hosted through Fontsource, with `font-variant-numeric: tabular-nums` on every amount. A fallback face sized like it (Arial or Liberation Sans, with `size-adjust` and ascent and descent overrides) is declared in `index.html`, as on Fil.

## Copy

Warm, plain and short, the way a friend explains a njangi: real amounts, no finance-speak, no superlatives. Sample lines:

- Hero: "Ten friends. One pot. Every turn comes." / "Run your njangi without the notebook."
- How it works: "Put the notebook down. Ebai has paid. Lum takes the pot on Sunday."
- Trust: "Chop keeps the book, never the money. You pay each other as you always have."
- FAQ: "Is an early turn better? With no interest, an early turn works like a loan and a late one like savings: the first member takes the whole pot after one payment, the last after paying in all of it."
- Pricing: "Prices are fictional: Chop is a design study."

Facts in the copy come only from the board's checked claims, with their sources in the app README. Lending at interest, bidding for turns, membership numbers and any real app's figures stay out. The member names are common first names, for fictional people; Bamenda appears only as the team's home.

## Assets

| Asset                       | Source                                                   | Where         |
| --------------------------- | -------------------------------------------------------- | ------------- |
| No photographs (decision 6) | —                                                        | —             |
| The ring, marker and tile   | Drawn in CSS and SVG for this page                       | Everywhere    |
| `og` (1200 × 630)           | Rendered from the page's own hero phone, as on the index | Open Graph    |
| Favicon                     | The ring motif from the index's motif set, in green      | Tab           |
| Store buttons               | Drawn with Ndop Button and Lucide icons                  | Get the app   |
| Plus Jakarta Sans           | Fontsource, SIL OFL                                      | Type          |
| Icons the items draw        | Lucide, ISC                                              | Select, FAQ … |

## JS budget

The default is 120 kB. Ndop's Slider and Select import `@angular/forms` for their forms bridge, about 7 kB, though no form uses them here. The first unit of work measures it. If the copies can drop that bridge as Fil's Textarea dropped `NdInput`, keeping `[(value)]`, the page keeps 120 kB; if not, it takes the atelier's 124 kB with the gap named in ADR-0004 (decision 8). Chart adds 3.6 kB gzip.

## Ndop gaps (expected)

- **Forms code in Slider and Select.** As above; logged with the atelier's entry in the spec's gaps table.
- **The pot line and the highlighted bar.** Expected to be plain SVG in our template; confirmed in the first unit of work.
- **Reduced motion.** The accordion, and the Select's list if it animates like the other overlays, take the same `motion-reduce` variants as on Fil.

## The rename

Moving from `njangi` to `chop` touches:

- `libs/pages-manifest/src/lib/pages.ts`: slug `chop`, name `Chop`, tagline "Run your njangi with friends, without the notebook.", `ndopItems` with `toggle-group` for `tabs`.
- `apps/motifs/src/app/motifs/motifs.ts` and `specimens.ts`: the `njangi` keys become `chop`. The index card's specimen keeps its own copy.
- The index's OG image, rerendered, since it shows the card names.
- `assemble-site.spec.ts` uses `njangi` as a sample app name; it changes to `chop` so the fixture matches the manifest.

The new apps are `apps/chop` and `apps/chop-e2e`, served on port 4303 in `.claude/launch.json`.

## Tests

- Unit: `turns()` and `summary()` at 3 and 20 members, the smallest and largest contribution, a start month that runs into 2028; `fcfa()`; the pricing period; the table toggle.
- E2E: both sliders and the Select by keyboard and their summary in the live region; the chart's arrow keys; "Show as a table"; the pricing toggle; the FAQ by keyboard; reduced motion; the page reads without JavaScript, with the prerendered table; axe on the page, an open FAQ item, the open Select and the table view.
- Lighthouse on `/chop/` within the quality bar.

## Decisions

1. **Direction:** The Circle (A), with B's notebook as one moment.
2. **Name:** Chop; slug `chop`.
3. **Facts:** all of the board's claims confirmed, FCFA (XAF) included.
4. **Money:** Chop keeps the book, never the money; no licence claims, no mobile money provider named.
5. **Prices:** fictional, in FCFA. Circle free for one circle; Treasurer 1,500 FCFA a month or 15,000 FCFA a year.
6. **Photographs:** none; the hero phone is built from Ndop components.
7. **Fonts:** Plus Jakarta Sans alone.
8. **JS budget:** 124 kB if the forms code can't be dropped.

Answered by Valery on 27 October 2026. New in this plan, and approved with it:

9. **Store buttons, not badges.** Apple's and Google's badges are their trademarks, for apps really in their stores. The page draws its own two buttons ("iPhone" and "Android", with Lucide icons), linking to `#get-app` with "Chop is a design study: there's no app to download."
10. **Green text:** `#2A7353` for green words, since the brief's green fails 4.5:1 on sand.
