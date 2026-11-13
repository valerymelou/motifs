# Bamboutos Coffee: page plan

- Status: Approved by Valery on 13 November 2026, with its nine decisions.
- Direction: The Slope (A), chosen on 13 November 2026 from the [art direction board](https://claude.ai/artifact/MKeDY4xEHZMoatKKU16Z3W), with photographs of the coffee and the slope and no faces (the board's revised decision 4).
- Slug and path: `bamboutos-coffee`, `/bamboutos-coffee/`. Mood: immersive. Accent `#B4322A`.

## The idea

Bamboutos Coffee is a fictional single-origin roaster that buys from smallholders on the Bamboutos slopes.

The page is the mountain. It starts on the rim at dawn and walks down the slope to the roastery at the foot, where the shop is. An altimeter in the header counts the altitude down as you go, so every section lives at a height:

| Altitude        | Section       | Kind   | What it holds                                                                                                                                       |
| --------------- | ------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2,600 m         | The rim       | Pinned | The opener: the slope at dawn, the name set into the skyline, the tagline. As you scroll, mist rises over the photo and the contour map takes over. |
| 2,000 m         | The plots     | Free   | Three fictional smallholdings, shown through their plots, never their faces, on a contour map of the upper slope.                                   |
| 2,000 → 1,400 m | Cherry to cup | Pinned | The brief's signature moment. One bean walks down the slope's profile through five stations, and a photo plate opens at each.                       |
| 1,400 m         | The roasts    | Free   | Ndop Tabs for light, medium and dark: each roast's bag, its tasting notes as Badges, and its roast curve.                                           |
| 1,400 m         | Brew guide    | Free   | Ndop Accordion: three house recipes, in grams, millilitres, degrees and minutes.                                                                    |
| 1,400 m         | The shop      | Free   | The three bags with a weight, a grind (Ndop Select) and Add to cart. The cart is Ndop's Sheet and "Added to cart" its Toast.                        |
| The foot        | Trailhead     | Footer | A signpost whose boards are the series links, and a benchmark plate with the fictional-brand note.                                                  |

The brief orders the sections hero, cherry to cup, roasts, brew guide, shop, farmers. Here the farmers come second, because their plots are high on the slope, above the washing station. Everything else keeps the brief's order.

As on Chop, every section scrolls straight through. Two of them pin while their scene plays, then let go, and every link in the menu lands at the top of its section.

## Header and footer, this page's own

**The header** is a single bar across the top:

- **Left:** the wordmark, "Bamboutos" in the condensed display face with "Coffee" in cherry red.
- **Right:** the altimeter, which shows the current altitude and the place ("1,620 m · the washing station"), and the cart button with its count.
- **The altitude** rolls from one figure to the next as each section passes. It's read from each section's view timeline, shared through `timeline-scope`, as Chop's dial did, so it needs no JavaScript.
- **The menu:** the altimeter is a button that opens the route card, a popover listing the seven stops with their altitudes. It is a plain list of links, so it opens without JavaScript.
- **The cart button** is a link to the shop until the shop has hydrated. After that, it opens the cart Sheet.

**The footer** is the trailhead at the foot of the slope:

- **The signpost:** a post with four boards pointing different ways, drawn in CSS: "All pages · Motifs", "Source on GitHub", "Built with Ndop UI" and "Back up to the rim". The first three are the series links.
- **The benchmark plate** beside it carries `seriesFacts('bamboutos-coffee', 'Bamboutos Coffee')`: the byline and the fictional-brand note. The footer is the page's `<footer>` landmark.
- **The e2e suite** checks all four series facts and their links, as Chop's does.

## The rim (pinned)

`rim-dawn` fills the screen. On phones it's `rim-dawn-phone`, an upright twin generated with it. The name is set huge in Big Shoulders Display, cream, across the sky above the ridge line, with the tagline and two links under it: "Walk down the slope" and "Shop the roasts".

The section pins for about two screens:

- the photo eases back, and a band of mist, a gradient layer, rises from the valley;
- the contour lines of the map fade in over it;
- the altimeter starts counting at 2,600 m.

The photo is the page's largest paint. It loads first with `fetchpriority="high"` and stays under 200 kB on phones. The atelier's treatment applies: sized WebP files, a phone crop, and a fallback face sized like the display face so the name doesn't reflow.

## The plots (free)

A contour map of the upper slope, drawn in SVG, with three plot markers on it. Each opens onto a plot card, an Ndop Card with:

- the plot's altitude and size, between 1.5 and 2.1 ha;
- what grows beside the coffee: beans, plantain, bananas;
- the variety, Java, if you confirm the board's retail sources;
- the weeks of the harvest.

The farmers are fictional and named by first name only. `plot-rows` and `green-beans` stand for them: rows under banana trees, beans in someone's hands. No face appears anywhere on the page.

## Cherry to cup (pinned)

The signature moment, as specimen A shows. The slope's profile is one long SVG, moved by `transform` alone so that each station's point on the ground lands under the bean. The bean stays in place on screen and changes at each station: cherry, ripe cherry, parchment, green bean, roasted bean.

| Station | Altitude | Photo plate                                     | Caption                                                     |
| ------- | -------- | ----------------------------------------------- | ----------------------------------------------------------- |
| 1       | 2,000 m  | `cherries-branch`                               | Grown high, on small plots.                                 |
| 2       | 1,850 m  | `picking-hands`                                 | Only the red cherries: picked by hand, October to December. |
| 3       | 1,620 m  | `float-tank`                                    | Floated, pulped, fermented up to 36 hours, washed.          |
| 4       | 1,480 m  | `parchment-beds` (`parchment-detail` on phones) | Seven to ten days on raised beds, to about 12% moisture.    |
| 5       | 1,400 m  | `roast-cooling`                                 | Roasted the week you order.                                 |

Each photo plate is framed like a survey photograph, with the altitude and the station written on its mount. It opens beside the bean as the walk rests on its station and closes as the walk moves on. On phones the plate sits above the caption, and the slope runs behind both.

The header's altimeter steps down with the stations. Its rests and the slope's rests are the same keyframe percentages, so the two can't drift apart.

Track length: about six screens on desktop and five on phones.

**With reduced motion, or without scroll timelines**, the walk becomes the brief's five captioned figures: each station's photo, its altitude and its caption, in a column, with the slope's profile drawn once above them.

## The roasts (free)

Ndop Tabs: Light, Medium, Dark. Each panel shows:

- **The bag's photo,** with its label laid over it in CSS: the roast, the origin and the weight, as real text.
- **Tasting notes** as Badges. Medium, for example: red currant, cocoa, brown sugar.
- **The roast curve:** bean temperature over time in a small SVG, with first crack marked and the roast's drop point. It's a detail only a roaster's page would have, drawn to one scale.
- **What it brews best,** linking to the brew guide's recipe.

Choosing a tab warms the section's ground towards that roast's brown, using the page's own CSS on the selected tab's state rather than a change to Ndop.

## Brew guide (free)

Ndop Accordion, one recipe per method, each with its dose, water, temperature, grind and time:

| Method       | Recipe                                                 |
| ------------ | ------------------------------------------------------ |
| Pour-over    | 15 g to 250 ml at 93 °C, medium-fine, about 3 minutes. |
| French press | 30 g to 500 ml at 94 °C, coarse, 4 minutes.            |
| Moka pot     | Basket filled level, fine, hot water to the valve.     |

`cup-pourover` heads the section. These are house recipes, not facts about Cameroon, so they need no sources.

## The shop (free)

Three products: light, medium and dark. Each has:

- its bag photo;
- the weight, 250 g or 1 kg, as Buttons in a group;
- the grind, an Ndop Select: whole bean, espresso, filter or French press;
- Add to cart, which shows a Toast ("Added to cart: Medium roast, 250 g, filter") with an Undo action.

The cart is an Ndop Sheet from the side. It lists lines with their quantities, a running total in FCFA, and a Checkout button that ends at the note "Bamboutos Coffee is a design study: nothing is sold or shipped." Prices are fictional and marked so.

The cart lives in a signal service. It holds no personal data and isn't stored, so it empties on reload. The shop, its Sheet and its Toast live in a `@defer (hydrate on viewport)` block.

## Fidelity

As on Chop, everything has to look like the real thing:

- **Photos:** the fourteen from the board. Each is a fixed-proportion box with a WebP `srcset`, loaded lazily below the rim. Boxes below the first screen use `content-visibility: auto`.
- **Ndop items:** finished for this page. Pressed and focus states, layered shadows, and the Sheet and Toast in the page's cream and brown.
- **Grain:** a small noise tile over the dark grounds, drawn once, so scrolling stays smooth.

## Motion

Everything that moves with the scroll is CSS scroll-driven animation, as on Chop. It uses `transform` and `opacity` keyframes on named view timelines, with no JavaScript, and sits behind `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`.

The brief names `mtScrollProgress` from `@motifs/motion` for the gauge. That directive sets a custom property from JavaScript on every scroll frame. The same effect in CSS runs on the compositor and costs no script, so the page doesn't use it.

Beyond the two pins:

- the contour lines drift slowly behind the free sections;
- the plot markers drop onto the map as it enters;
- the roast curve draws itself when its tab opens;
- the Sheet slides and the Toast rises, with Ndop's motion, taking the `motion-reduce` fix if they ignore reduced motion.

## Theme

| Token          | Value                    | Role                                                              |
| -------------- | ------------------------ | ----------------------------------------------------------------- |
| `--background` | cream `#F4EAD9`          | The contour map's ground and the free sections                    |
| `--foreground` | volcanic brown `#3B2416` | Text, 12.2:1 on cream                                             |
| `--primary`    | cherry red `#B4322A`     | Buttons (white text 6.1:1), marks, and red words on cream (5.1:1) |
| `--soil`       | `#3B2416`                | The slope, the dark grounds, the header bar                       |
| `--tan`        | `#E7C9A8`                | Small labels on the brown, 9.2:1                                  |

Cherry red is only 2.4:1 on the brown, so on dark grounds the words are cream or tan and the red is a fill. Light only, as the brief's look is cream and brown.

**Fonts:**

- **Big Shoulders Display** for display, and **Newsreader** for the body, a warm serif.
- **The weight-only cuts.** Newsreader's cut with the optical size axis is 132 kB, against 58 kB for the weight-only one. On the atelier, a cut that size shared the slow-4G bandwidth with the hero photo and kept LCP over 2 s, so the page takes the weight-only cut.
- **Source:** both SIL OFL, self-hosted through `@fontsource-variable/big-shoulders-display` and `@fontsource-variable/newsreader`. These are new dependencies, approved with the plan.
- **Fallbacks:** faces sized like each are declared in `index.html`, measured in Chromium against Arial Narrow and Times New Roman, as on Fil and Chop.

- **Big Shoulders Display** for display, and **Newsreader** for the body. Newsreader is a warm serif with an optical size axis, which lets it hold up both large and small.
- **Source:** both SIL OFL, self-hosted through `@fontsource-variable/big-shoulders-display` and `@fontsource-variable/newsreader`. These are new dependencies, so they need your approval.
- **Fallbacks:** faces sized like each are declared in `index.html`, as on Fil and Chop.

## Copy

Plain and warm, about the coffee rather than about the brand. Sample lines:

- The rim: "Single-origin coffee from smallholders on the Bamboutos slopes."
- Cherry to cup: "Only the red cherries." / "Seven to ten days in the sun."
- The shop: "Roasted the week you order."
- The footer: "Bamboutos Coffee is a design study: nothing is sold or shipped."

Facts in the copy come only from the board's claims that you confirm, with their sources in the app's README:

- **Left out on purpose:**
  - "rich volcanic soil", since the massif's soils are poor;
  - an exact height for the mountain;
  - production figures;
  - any real cooperative, mill or exporter.
- **Fictional and marked so:**
  - the farms' altitudes;
  - the roast profiles;
  - the tasting notes;
  - the prices.

## Assets

| Asset                               | Source                                                                  | Where                    |
| ----------------------------------- | ----------------------------------------------------------------------- | ------------------------ |
| The fourteen photos                 | Generated by Valery with Nano Banana from the board's prompts, reviewed | Throughout               |
| WebP sizes and phone crops          | The `optimize-images` target, as on the atelier                         | `public/images`          |
| `og` (1200 × 630)                   | Rendered from `rim-dawn` with the name set on it                        | Open Graph               |
| The slope, contours, bean, signpost | Drawn in SVG and CSS for this page                                      | Throughout               |
| Favicon                             | The seed, the page's motif from the index's set                         | Tab                      |
| Big Shoulders Display, Newsreader   | Fontsource, SIL OFL                                                     | Type                     |
| Icons the items draw                | Lucide, ISC                                                             | Select, Accordion, Sheet |

## JS budget

The default 120 kB. Tabs, Select, Sheet and Toast make this the heaviest brief yet: Select and Sheet both bring the CDK's overlay, which was Chop's largest cost. So:

- **The shop:** in a `@defer (hydrate on viewport)` block, with its cart Sheet and its Toast host inside it.
- **The roasts and the brew guide:** deferred the same way.
- **The header's cart button:** a plain link to the shop until the shop has hydrated.

Unit 1 measures it. If the page still goes over, the Ndop gap it hits is logged and the budget question comes back to you, as ADR-0004 lets a page do.

## Ndop gaps to expect

- **Forms code in Select:** the same gap as on Chop and the atelier.
- **Toast and Sheet with reduced motion:** the `motion-reduce` fix, if they animate regardless.
- **The Toast's Undo:** whether Ndop's Toast takes an action, and pauses its timer on hover and focus. If not, logged as a gap.

## Units

1. **Shell and the rim.** Scaffold `apps/bamboutos-coffee` and `apps/bamboutos-coffee-e2e` on port 4304. Then:
   - the theme and fonts;
   - the altimeter header with its route card;
   - the rim, with its photos if they've arrived, or a drawn stand-in until they do;
   - the trailhead footer with the series facts;
   - the first measures of LCP and JS.
2. **The plots and cherry to cup.** The contour map and plot cards, the pinned walk with its five plates, and its five-figure fallback.
3. **The roasts, brew guide and shop.** Tabs with the roast curves, the Accordion, the cart service, the Select, the Sheet and the Toast.
4. **Launch.** The README with sources and credits, the OG image, the launch note and GIF, and setting the page live.

Each unit ends with Lighthouse, axe, a reduced-motion pass and a no-JS pass, and with commit messages and `git add` commands for you. Photos are needed by unit 1 for the rim and by unit 2 for the plates. If you generate them now, they'll be ready in time.

## Tests

- **Unit:**
  - the cart service: add, merge lines, remove, totals;
  - the FCFA formatter;
  - the roast curve's scale;
  - the altitude list.
- **End to end:**
  - every anchor lands at its section, and the route card opens and works by keyboard;
  - the walk shows each station's plate at its rest, with motion;
  - reduced motion gives the five figures;
  - the roast Tabs by keyboard;
  - the grind Select, Add to cart, the Toast, then the cart Sheet: lines, totals, Escape, focus returned;
  - the page reads without JavaScript;
  - the series facts in the footer;
  - axe on the page, an open Sheet, the open Select and an open Accordion item.
- **Lighthouse** on `/bamboutos-coffee/` within the quality bar.

## Decisions

1. **Direction:** The Slope.
2. **Facts:**
   - the six agreed claims go in;
   - the holding size (one source, the ICO) and the varieties (retail sources) go in only if you confirm them;
   - "rich volcanic soil" stays out.
3. **The altitude falls** from 2,600 m on the rim to 1,400 m at the roastery, rather than rising as the brief has it.
4. **Photos:** the fourteen from the board, no faces, credited as AI-generated.
5. **Prices:** fictional, in FCFA. Per bag: light 5,000 FCFA for 250 g or 17,000 FCFA for 1 kg; medium and dark 4,500 FCFA for 250 g or 15,000 FCFA for 1 kg.
6. **The header and footer** are this page's own: the altimeter and the trailhead.
7. **Fonts:** Big Shoulders Display and Newsreader, as new dependencies.
8. **Section order:** the farmers come second, high on the slope, instead of last.
9. **No `mtScrollProgress`:** CSS scroll timelines do the gauge's work.
