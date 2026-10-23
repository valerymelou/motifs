# motifs

The series index, served at `/`. It keeps Ndop UI's default theme so the pages bring the color, and lists every page from `libs/pages-manifest`: live pages link to themselves with their Open Graph image, the others show their accent color and a "coming soon" badge. Visitors can filter the grid by mood.

## Ndop items

`card`, `badge` and `toggle-group` (with `toggle`), unrestyled. The default `icons.ts` registers no icons, since none of these items draw one; that keeps about 12 kB gzip out of the bundle.

## Asset credits

| Asset             | Source                                                        | License |
| ----------------- | ------------------------------------------------------------- | ------- |
| Geist, Geist Mono | [Vercel](https://vercel.com/font), via `@fontsource-variable` | SIL OFL |
| `public/og.png`   | Still to make (1200×630)                                      |         |
