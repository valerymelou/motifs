# Atelier Ndop: page plan

- Status: Approved by Valery on 23 October 2026, with sharp as a dev dependency, a fictional order address on `example.com`, and fictional prices in FCFA.
- Direction: The Dye Pit, chosen on 23 October 2026 from the [art direction board](https://claude.ai/artifact/T4buopcZSVZW5qee79W2rM).
- Slug and path: `atelier-ndop`, `/atelier-ndop/`. Mood: immersive. Accent `#1E3170`.

## The idea

A small atelier in Foumban that hand-dyes ndop cloth and sells scarves and wall pieces. The page follows the cloth from strip to scarf, and tells, as the series' flagship, where Ndop UI's name comes from.

Its thread is a real fact of indigo: cloth comes out of the vat green and turns blue as it meets the air. The page opens on that moment, and its pattern maker ends on it.

## Sections, in order

| Section           | Component                  | What it holds                                                                                                                                                                        |
| ----------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Header            | `mt-site-header`           | Wordmark, anchors to Story, Pattern maker, Collection and Visit, "Foumban"                                                                                                           |
| Hero              | `mt-hero-section`          | The dye-pit photo, green fading to blue on load; "Dipped green. Blue in the air."; links to the pattern maker and the collection; a thin band of motifs that reveals under the photo |
| The story of ndop | `mt-story-section`         | Where the cloth comes from, how it's made and worn, what its motifs mean, and where Ndop UI's name comes from. Only checked facts; differing accounts told as such                   |
| Pattern maker     | `mt-pattern-maker-section` | The signature moment, below                                                                                                                                                          |
| The collection    | `mt-collection-section`    | Four pieces: two scarves, two wall pieces, each a Card with photo, motif, size and a price in FCFA marked as fictional                                                               |
| Process           | `mt-process-section`       | How the atelier makes a piece, in three steps: stitch, dye, unpick, each with its photo                                                                                              |
| Visit             | `mt-visit-section`         | The courtyard photo, the address off the Rue des Artisans in Foumban, hours, and a `mailto:` link                                                                                    |
| Footer            | `mt-page-footer`           | Atelier details, then the series footer with the fictional-brand note                                                                                                                |

The story section tells the history and meaning; the process section tells what this atelier does. They share no photos.

## Signature moment: the pattern maker

A live cloth the visitor designs, drawn as SVG from a typed pattern model, never drawn by hand per state.

**Model** (`pattern/pattern.ts`):

```ts
interface Pattern {
  rows: readonly MotifKind[]; // four rows, one motif each
  density: number; // motifs per row, 4 to 12
  depth: IndigoDepth; // 'pale' | 'medium' | 'deep' | 'night', the number of dips
  dyed: boolean; // false shows the stitched white cloth before dyeing
}
```

`MotifKind` is the sourced set: crocodile lozenge, diamond, moon, star, tarantula, lizard. Each motif is a path in a 48 × 48 tile with its meaning and source, the same data the tooltips show. A pure function turns a `Pattern` into the cloth's SVG, and another into a sentence describing it.

**Controls**, all Ndop:

| Control          | Ndop item                          | Does                                                                                            |
| ---------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| Motif per row    | Toggle Group (single), one per row | Picks that row's motif; arrow keys move between the six motifs                                  |
| Motif meaning    | Tooltip on each motif button       | Name, meaning and source, on hover and focus                                                    |
| Density          | Slider                             | Motifs per row, 4 to 12                                                                         |
| Depth of indigo  | Popover with four swatches         | Pale, medium, deep, night: "one dip" to "ten dips"                                              |
| Dye the cloth    | Switch, named by Label             | Off shows white cotton with raffia stitches; on shows it dyed, white motifs on indigo           |
| Order as a scarf | Button and Dialog                  | A summary of the pattern, a scarf preview, and a `mailto:` link with the pattern in the message |

**The moment:** turning the switch on crossfades the cloth from stitched white, through vat green, to the chosen indigo. That's an opacity crossfade of three layers, nothing else animated. Changing a row or the density redraws at once.

**Keyboard path:** Tab moves row to row, arrow keys pick within a row, then on to the slider, the depth swatches, the switch and the order button. A polite live region describes the cloth after each change, for example "Four rows: crocodile lozenges, moons, diamonds, stars; eight per row; deep indigo; dyed."

**Reduced motion:** no crossfade; the cloth switches state at once. The hero shows the blue photo only.

**Without JavaScript:** the prerendered page shows the default cloth, dyed, with its description. The controls are visible but inert, and the order link still works.

**Hydration:** the section hydrates with the page. On the index, clicks landing while a deferred block hydrated were sometimes lost, so no interactive section uses `@defer`. The story, process and visit sections may.

## Ndop items

`ndop add` per ADR-0002: `toggle-group` (with `toggle`), `tooltip`, `slider`, `popover`, `switch`, `label`, `dialog`, `button`, `card`. The `icons.ts` map keeps only the icons these items draw (the dialog's close `x`), not Ndop's default 65.

## Theme (`src/theme.css`)

| Token                           | Value                                                                            | Role                                                                                       |
| ------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `--background`                  | `oklch(0.950 0.017 88.0)` raw cotton `#F3EEE2`                                   | Page ground                                                                                |
| `--foreground`                  | `oklch(0.260 0.059 273.4)` indigo ink `#1B2140`                                  | Text                                                                                       |
| `--primary`                     | `oklch(0.337 0.112 267.4)` indigo `#1E3170`                                      | Buttons, links, the cloth                                                                  |
| `--primary-foreground`          | raw cotton                                                                       | Text on indigo                                                                             |
| `--secondary`                   | `oklch(0.280 0.099 267.7)` vat night `#142359`                                   | The pattern maker's ground, dark bands                                                     |
| `--accent`                      | `oklch(0.885 0.035 267)` pale indigo                                             | Ndop's hover and pressed surfaces                                                          |
| `--vat-green`                   | `oklch(0.487 0.056 168.8)` vat green `#3E6A5A`                                   | The green moment, sparingly; its own token, since Ndop's `--accent` colors pressed toggles |
| `--ring`                        | `oklch(0.58 0.11 75)` deep raffia                                                | Focus rings, deeper than the thread so focus shows on cotton                               |
| `--raffia`                      | `oklch(0.751 0.095 81.0)` raffia `#CDA866`                                       | Stitch lines                                                                               |
| `--muted`, `--muted-foreground` | cotton shade `oklch(0.915 0.02 82)`, laterite text `oklch(0.44 0.06 52)`         | Quiet surfaces and secondary text                                                          |
| `--laterite`                    | `oklch(0.513 0.077 52.3)` `#8A5A3C`                                              | Earth tones in the visit section                                                           |
| `--radius`                      | `0.25rem`                                                                        | Small, made by hand                                                                        |
| Motion                          | `--mt-reveal-duration: 1100ms`, `--mt-reveal-easing: cubic-bezier(0.2, 0, 0, 1)` | Slow, like dye taking                                                                      |

Every text pairing is checked for 4.5:1 in a unit test, as on the index.

**Fonts:** Fraunces for display, Hanken Grotesk for text, both SIL OFL and self-hosted. Fraunces uses the cut with weight and optical size (67 kB for latin regular), with italic only where the hero needs it. The four-axis cut that adds Softness and Wonky costs 121 kB regular and 150 kB italic, so it stays out.

**Texture:** a faint cotton weave from two repeating gradients, as on the index. The real texture is in the photographs.

## Copy

Warm, exact, from the workbench: short sentences, real measures (180 × 60 cm, eight dips, three days), no claims about the cloth's sacred meanings as selling points. Sample lines:

- Hero: "Dipped green. Blue in the air." / "Hand-dyed ndop from our atelier in Foumban."
- Pattern maker: "Choose a motif for each row. We stitch it, dye it, and unpick it by hand."
- Order: "Order as a scarf" → "We'll write back with a price and a date. Nothing is charged here."

The facts in the story section come only from the board's checked rows, with their sources listed in the app README.

## Assets

| Asset                                                                                   | Source                                                           | Where                  |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| `hero-dip` (16:9) and `hero-dip-mobile` (4:5)                                           | Nano Banana, reviewed by Valery                                  | Hero, green state      |
| `hero-dip-blue` (16:9, 4:5)                                                             | Nano Banana, an edit of `hero-dip`: same frame, cloth fully blue | Hero, blue state       |
| `story-strips`, `story-vat`                                                             | Nano Banana                                                      | Story                  |
| `story-stitch`, `story-unpick`                                                          | Nano Banana                                                      | Process, steps 1 and 3 |
| `hero-dip` (cropped)                                                                    | Reused                                                           | Process, step 2        |
| `piece-scarf-lozenge`, `piece-scarf-moon`, `piece-wall-leopards`, `piece-wall-diamonds` | Nano Banana                                                      | Collection             |
| `visit-courtyard`                                                                       | Nano Banana                                                      | Visit                  |
| `og` (1200 × 630)                                                                       | Nano Banana photo, with type set on it at build time             | Open Graph             |
| Fraunces, Hanken Grotesk                                                                | Fontsource, SIL OFL                                              | Type                   |
| Dialog close icon                                                                       | Lucide, ISC                                                      | Dialog                 |

Prompts for all but `hero-dip-blue` are on the board; I'm adding that one.

**Images on the page:** every photo is a plain `<img>` in a box of fixed proportions, with a responsive WebP `srcset` and `sizes`; the hero loads eagerly with `fetchpriority="high"` and is under 200 kB, the rest lazily. A static site has no image CDN, so the sizes are made at build time by a small script. (The plan first named `NgOptimizedImage` with AVIF too: the directive cost bundle bytes the page couldn't spare, and its preload of the hero would have fetched a second file beside an AVIF `<picture>`.) That script needs [sharp](https://sharp.pixelplumbing.com) (Apache-2.0) as a dev dependency, which the spec says needs your approval.

## Ndop gaps

None of the brief's items is missing from Ndop's catalog. Building the pattern maker found five gaps, now in the spec's gaps table with their workarounds:

- A tooltip on a toggle button: both set `data-state`, so the pressed style disappears. The copied toggle also styles `aria-pressed`.
- Dialog, popover and tooltip animate even with reduced motion. The copies add `motion-reduce:animate-none`.
- The slider, switch and toggle primitives import `@angular/forms` without a form, about 7 kB gzip.
- The outline toggle uses `--accent` for both hover and pressed. The copy hovers with `--muted`.
- `tw-animate-css` 1.4.0 ships an invalid selector: four harmless build warnings.

Swatches in a popover work as planned: a Toggle Group inside the Popover.

## Tests

- Unit: the pattern model to SVG and to its description; every motif has a meaning and a source; theme contrast.
- E2E: the whole keyboard path; the description updates; the dialog's `mailto:` carries the pattern; reduced motion has no crossfade; the page reads without JavaScript; axe on every state, including the open dialog.
- Lighthouse on `/atelier-ndop/` within the quality bar.

## Decisions

1. **sharp:** approved.
2. **Order address:** `atelier@example.com`, a domain reserved for examples, since the brand is fictional.
3. **Prices:** fictional prices in FCFA, with a note on the page that they are fictional.
