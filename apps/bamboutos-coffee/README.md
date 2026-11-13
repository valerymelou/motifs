# Bamboutos Coffee

Single-origin coffee from smallholders on the Bamboutos slopes.

Part of [Motifs](../../README.md), served at `/bamboutos-coffee/`. Mood: immersive.

## Brand idea

A fictional single-origin roaster that buys from smallholders on the slopes of the Bamboutos massif, in Cameroon's Western High Plateau. The art direction is The Slope, chosen from the [art direction board](https://claude.ai/artifact/MKeDY4xEHZMoatKKU16Z3W); the full plan is in [`docs/plans/bamboutos-coffee.md`](../../docs/plans/bamboutos-coffee.md).

The page is the mountain. It opens on the rim at dawn and walks down the slope to the roastery at the foot, where the shop is. An altimeter in the header counts the altitude down as you go, so every section lives at a height:

| Altitude        | Section       | Kind   | What it holds                                                                                                                                 |
| --------------- | ------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 2,600 m         | The rim       | Pinned | The dawn photo with the name across its sky. As you scroll, mist rises over it and the contour map takes over.                                |
| 2,000 m         | The plots     | Free   | A survey sheet: a contour map with three pinned smallholdings, each plot's card beside its pin, and two field prints taped on. No faces.      |
| 2,000 → 1,400 m | Cherry to cup | Pinned | One bean walks down the slope's profile through five stations, changing from cherry to roasted bean, and a photo plate opens at each.         |
| 1,400 m         | The roasts    | Free   | Ndop Tabs: each roast's bag with its label, tasting notes as Badges, and its roast curve with first crack and the drop.                       |
| 1,400 m         | Brew guide    | Free   | Ndop Accordion: three house recipes in grams, millilitres, degrees and minutes.                                                               |
| 1,400 m         | The shop      | Free   | A size, a grind (Ndop Select) and Add to cart, which confirms with a Toast that can undo it. The cart is an Ndop Sheet the header also opens. |
| The foot        | Trailhead     | Footer | A signpost whose boards are the series links, and a benchmark plate with the byline and the fictional-brand note.                             |

The header and footer are this page's own. The altimeter's Route button opens the stops as a native popover; the footer lays out the series facts from `seriesFacts()`.

The roaster, its farmers, prices, roast profiles, tasting notes and recipes are fictional, and the page says so. Nothing is sold or shipped.

## Ndop items

`tabs`, `select`, `sheet`, `toast`, `badge`, `accordion`, `button` and `card`, added with `ndop add` (ADR-0002). `card` is the one item beyond the brief, for the plots.

Restyled through tokens and the page's own classes:

- **Tabs:** a pill of three, the active roast in the brown.
- **Select:** a cream field, full width in each product card.
- **Sheet:** the cart in the card colour over the contour lines.
- **Toast:** in the brown, its Undo in the red.
- **Badges:** the tasting notes, brown on the roast's ground.

Edits to the copied files, each commented where it is made:

- **`accordion`, `select` and `sheet`.** They add `motion-reduce` variants, since Ndop's animations run even with reduced motion: the accordion's height, the Select's list, and the Sheet's overlay and slide.

`src/app/lib/icons.ts` registers only the five icons the page draws, written out in Ndop's node format: the chevron, the check, the close, minus and plus. The Ndop gaps are in the build spec's gaps table.

## Photos

The originals are in `images-src/`, which stays out of git. `nx run bamboutos-coffee:images` makes the WebP files in `public/images` and the typed list in `src/app/photos/manifest.ts`. It also cuts:

- `rim-dawn-tall`, an upright crop of the rim's phone twin;
- `plate-beds` and `plate-roast`, 4:3 station plates from the two 16:9 photos.

`nx run bamboutos-coffee:og` renders `public/og.png` from the rim's photo and the name.

Each photo is a plain `<img>` in a box of fixed proportions, with a WebP `srcset`. The rim loads first; the rest load lazily, their boxes skipped by `content-visibility` until they come near. The bags are blank in the photos, because generated lettering comes out garbled, so `mt-bag` lays each roast's label over its bag as real text.

## Theme and motion

Big Shoulders Display for display and Newsreader for text, both weight-only cuts:

- **Newsreader:** its optical-size cut is 132 kB against 58 kB, and would share the slow-4G bandwidth with the rim's photo.
- **Big Shoulders:** the headline's face, declared in `index.html` and copied to `fonts/` by the build. That way it starts loading with the page rather than after the deferred stylesheet.
- **Fallbacks:** faces sized like both are declared in `index.html`, measured against Arial Narrow and Times New Roman.

Colours: cream, volcanic brown and cherry red. The red carries white text and is dark enough for words on cream. It is only 2.4:1 on the brown, so on the brown, words are cream or tan. On the roasts' warmer grounds, red words take a darker red.

Motion is CSS scroll-driven animation, imported by `theme.css` and scoped by component tags, so it costs no JavaScript:

- **Shared timelines:** each section has a named view timeline, shared with the whole page through `timeline-scope`, so the header's altimeter can follow them.
- **The rim and the walk:** both are tall tracks whose stage is sticky. The walk moves one drawing of the slope by `transform` alone, so each station's point lands under the bean. Its rests and the altimeter's are the same percentages.
- **Smaller touches:** the plots' pins drop in, a roast's curve draws itself when its tab opens, and the roast's ground warms with the active tab.

With reduced motion, or without scroll timelines, the rim is one still screen and the walk is five captioned figures under the slope's profile, drawn once.

The roasts, the brew guide and the shop sit in `@defer (hydrate on viewport)` blocks. Their code, and the overlay code the Select and the Sheet share, loads only when they scroll into view. The header's cart button is a link to the shop until then.

## Sources

The page's facts, as the [art direction board](https://claude.ai/artifact/MKeDY4xEHZMoatKKU16Z3W) checked them:

- [ICO, Cameroon country coffee profile, 2016](https://www.ico.org/documents/cy2016-17/icc-120-5e-profile-cameroon.pdf):
  - Cameroon's arabica grows in the high West and North-West regions, and is mostly wet-processed;
  - the arabica season opens on 1 October;
  - most holdings are small, about two hectares for arabica;
  - Mount Bamboutos rises to 2,740 m.
- [Wikipedia, Bambouto massif](https://en.wikipedia.org/wiki/Bambouto_massif): a volcanic massif in the Western High Plateau, its peaks at 2,679 m. The two heights differ, so the page puts the rim at 2,600 m and names no summit height. Its soils are "acidic, low in phosphates, and relatively infertile", so the page never claims rich volcanic soil.
- [Wikipedia, Coffee production in Cameroon](https://en.wikipedia.org/wiki/Coffee_production_in_Cameroon): arabica in the western highlands.
- [Sweet Maria's](https://www.sweetmarias.com/cameroon-kouoptamo-cooperative-7899.html) and [Covoya](https://uk.covoyacoffee.com/cameroon-grassfields-coop-fully-washed.html), on washed lots from near the massif: fermentation for up to 36 hours, then seven to ten days on raised beds, to about 12% moisture. Sweet Maria's puts the harvest from October to January, and [Tridge](https://www.tridge.com/market-guides/CM-coffee-bean) from September to December, so the page says October to December.

No real cooperative, mill or exporter is named. The plots' altitudes and sizes, the farmers' first names, the roast profiles, the tasting notes, the recipes and the prices are the roaster's own, fictional.

## Asset credits

| Asset                                                   | Source                                                                                                                           | License                                  |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Photographs (`images-src/`, made into `public/images/`) | Generated for this series by Valery Melou with Nano Banana (Google), from the prompts on the art direction board, and reviewed   | Used under this repository's MIT license |
| `public/og.png`                                         | The rim's photo with the name set on it by `og/render-og.mts` (`nx run bamboutos-coffee:og`)                                     | MIT                                      |
| `public/favicon.svg`                                    | The seed motif from the index's motif set                                                                                        | MIT                                      |
| The slope, contour map, pins, bean, signpost and plate  | Drawn in SVG and CSS for this page                                                                                               | MIT                                      |
| Big Shoulders Display                                   | [The Big Shoulders Project Authors](https://github.com/xotypeco/big_shoulders), via `@fontsource-variable/big-shoulders-display` | SIL OFL                                  |
| Newsreader                                              | [The Newsreader Project Authors](https://github.com/productiontype/Newsreader), via `@fontsource-variable/newsreader`            | SIL OFL                                  |
| Chevron, check, close, minus and plus icons             | [Lucide](https://lucide.dev)                                                                                                     | ISC                                      |
