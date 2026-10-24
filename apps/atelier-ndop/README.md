# Atelier Ndop

Indigo cloth, dyed by hand, one motif at a time.

Part of [Motifs](../../README.md), served at `/atelier-ndop/`. Mood: immersive.

## Brand idea

A small, fictional atelier off the Rue des Artisans in Foumban that hand-dyes ndop cloth and sells scarves and wall pieces. The art direction is "The Dye Pit", chosen from the [art direction board](https://claude.ai/artifact/T4buopcZSVZW5qee79W2rM); the full plan is in [`docs/plans/atelier-ndop.md`](../../docs/plans/atelier-ndop.md).

The page's thread is a fact of indigo: cloth comes out of the vat green and turns blue as the air reaches it. The hero opens on that moment, with two photos of one dip crossfading from green to blue, and the pattern maker ends on it.

- **Story.** Where ndop comes from, how it is made and worn, and what its motifs mean, from the board's claims that its sources agree on. It ends on the series' own link to the cloth: Ndop UI is named after it. Claims where sources differ, or that rest on a single or weak source, are left out.
- **Pattern maker.** The signature moment: a cloth the visitor designs row by row, drawn as SVG from a typed model (`pattern/`), then stitched, dyed and ordered as a scarf by email.
- **Collection, process, visit.** Four pieces with fictional prices, the three steps of the work, and the courtyard.

Prices and the order address (`atelier@example.com`) are fictional, and the page says so.

## Ndop items

`toggle-group` (with `toggle`), `tooltip`, `slider`, `popover`, `switch`, `label`, `dialog`, `button` and `card`, added with `ndop add` (ADR-0002). Restyled through tokens first:

- The page's tokens in `src/theme.css`: raw cotton ground, indigo ink, a pale-indigo `--accent` for hover and pressed, deep raffia for focus rings, a 0.25rem radius.
- The pattern maker turns the tokens around for the vat's night, so the same controls read light on dark.

Edits to the copied files, each commented where it is made:

- `toggle`: the pressed style keys on `aria-pressed` as well as `data-state`, since a tooltip on the same button overwrites `data-state`. The outline variant hovers with `--muted` instead of `--accent`, so hover and pressed differ.
- `dialog`, `popover` and `tooltip`: `motion-reduce:animate-none`, since Ndop's overlays animate even with reduced motion.

`src/app/lib/icons.ts` registers only `x`, the dialog's close icon, inlined from Lucide rather than importing the icon set.

The Ndop gaps these edits work around are in the build spec's gaps table. One has no workaround: the slider, switch and toggle primitives import `@angular/forms` without a form, about 7 kB gzip, so this page's JS budget is 124 kB instead of 120 kB until Ndop fixes it (ADR-0004).

## Theme and motion

Fraunces (its weight-only cut) for display, Hanken Grotesk for text. The cotton weave on the page comes from two repeating gradients, a token (`--mt-weave`) that the surfaces covering the page wear too.

Everything that moves with the scroll is CSS scroll-driven animation, so it costs no JavaScript and runs before Angular hydrates. It animates transform and opacity only. It stands still with reduced motion, or in browsers without scroll timelines. Each section's stylesheet sits beside its component but is imported by `theme.css`, scoped by the component's tag. Angular ships `styleUrl` styles inside the JavaScript bundle, which this page has no room for.

The hero's blue frame waits in `data-` attributes until the green frame, the page's largest paint, has loaded. A plain script in `index.html` then fetches it. Without JavaScript the cloth stays green.

## Photos

The originals are in `images-src/`, which stays out of git. `nx run atelier-ndop:images` makes the WebP files in `public/images` and the typed list in `src/app/photos/manifest.ts`. That includes square crops of the hero for phones, cut around the cloth. `nx run atelier-ndop:og` renders `public/og.png` from the `og` photo and the hero's line.

## Sources

The story's claims, as the art direction board checked them:

- [Cleveland Museum of Art, ntieya with leopards](https://clevelandart.org/art/2025.274): the leopard and crocodile-lozenge meanings.
- [The Met, display cloth](https://www.metmuseum.org/art/collection/search/636847): the Grassfields; royal display and use.
- [Philadelphia Museum of Art](https://www.philamuseum.org/objects/181499): strips, resist stitching and dyeing; royal and mourning use.
- [Kaji, 2023, _Journal of Textile Engineering & Fashion Technology_](https://medcraveonline.com/JTEFT/challenges-of-the-modernization-and-industrialization-of-the-manufacture-of-ndop-fabric-from-cameroon.html): the diamond, animal and celestial motifs; ndop's use today.
- [Essel, 2021, _Exploring Visual Cultures_](https://www.explore-vc.org/en/objects/the-case-of-ndop-royal-fabric.html): how the cloth is made and used.
- [Darnaude, 2023, University of Évora](https://dev.rdpc.dspace.uevora.pt/items/f2ceedfc-883b-4a41-b7dd-6d7ecbcced7d/full): ndop as the emblematic cloth of the Grassfields chieftaincies.

The hero's colour change:

- [Wikipedia, Vat dye](https://en.wikipedia.org/wiki/Vat_dye): indigo "changes from yellow, in the dyebath, to green and then blue as the air hits it".
- [Wikipedia, Indigo dye](https://en.wikipedia.org/wiki/Indigo_dye): the reduced, soluble form turns back to blue indigo on exposure to air.

## Asset credits

| Asset                                                   | Source                                                                                                                         | License                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| Photographs (`images-src/`, made into `public/images/`) | Generated for this series by Valery Melou with Nano Banana (Google), from the prompts on the art direction board               | Used under this repository's MIT license |
| `public/og.png`                                         | The `og` photo with the hero's line set on it by `og/render-og.mts`                                                            | MIT                                      |
| `public/favicon.svg`                                    | The crocodile lozenge from `pattern/motifs.ts`                                                                                 | MIT                                      |
| Motif shapes                                            | Drawn for this page in `pattern/motifs.ts`, after the motifs the sources name                                                  | MIT                                      |
| Fraunces                                                | [The Fraunces Project Authors](https://github.com/undercasetype/Fraunces), via `@fontsource-variable/fraunces`                 | SIL OFL                                  |
| Hanken Grotesk                                          | [The Hanken Grotesk Project Authors](https://github.com/marcologous/hanken-grotesk), via `@fontsource-variable/hanken-grotesk` | SIL OFL                                  |
| Dialog close icon                                       | [Lucide](https://lucide.dev) `x`                                                                                               | ISC                                      |
