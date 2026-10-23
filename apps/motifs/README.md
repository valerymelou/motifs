# motifs

The series index, served at `/`. Its idea: the twelve pages are motifs in one cloth, after ndop, the indigo cloth from the Grassfields of Cameroon that Ndop UI is named after.

- **The cloth.** The hero is a band of motifs per page, each in its page's accent, drawn from a typed model (`motifs/motifs.ts`) rather than by hand. Bands weave in on load and drift as the page scrolls, in CSS only; each band links to its page in the collection.
- **One library, twelve identities.** One Ndop card, pinned while the section scrolls, passes from page to page: the same markup restyled through Ndop's tokens alone (`specimens.ts`). A picker jumps to any page, which is also the path for keyboards and reduced motion.
- **The collection.** Every page with its motif as a swatch, filterable by mood; live pages link out with their Open Graph image.

## Theme

An indigo night (`oklch(0.17 0.045 268)`) with raw-cotton type and a faint woven texture from two repeating gradients, set in `src/theme.css`. Instrument Serif for display, Geist and Geist Mono for text and labels.

The headline's face is declared and preloaded in `index.html` rather than in `theme.css`, because the build defers the full stylesheet and the headline is the page's largest paint.

## Ndop items

`button`, `card`, `badge` and `toggle-group` (with `toggle`), restyled through tokens only. `icons.ts` registers no icons, since none of these items draw one.

The two interactive sections hydrate with the page; only the static "How it is made" section uses `@defer (hydrate on viewport)`. A click that lands while a deferred block hydrates was sometimes lost in testing.

## Asset credits

| Asset             | Source                                                                                                                     | License |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- | ------- |
| Instrument Serif  | [The Instrument Serif Project Authors](https://github.com/Instrument/instrument-serif), via `@fontsource/instrument-serif` | SIL OFL |
| Geist, Geist Mono | [Vercel](https://vercel.com/font), via `@fontsource-variable`                                                              | SIL OFL |
| Motif patterns    | Drawn for this series in `motifs/motifs.ts`                                                                                | MIT     |
| `public/og.png`   | Rendered from the motif model by `og/render-og.mts` (`nx run motifs:og`)                                                   | MIT     |
