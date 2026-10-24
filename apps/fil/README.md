# Fil

Send SMS and WhatsApp messages across African networks with one API.

Part of [Motifs](../../README.md), served at `/fil/`. Mood: editorial.

## Brand idea

A fictional developer API from Buea, the town called Silicon Mountain, for sending SMS and WhatsApp messages across Africa through one endpoint. _Fil_ is French for thread and wire; _sans fil_ is wireless, and a _coup de fil_ is a phone call. The art direction is "The Thread", chosen from the [art direction board](https://claude.ai/artifact/KEuxvPdV8gkK7F5vVsZX8K); the full plan is in [`docs/plans/fil.md`](../../docs/plans/fil.md).

The page is black ink on squared paper, and its one colour is a green thread. The thread steps out of the hero's terminal and runs down every section. It knots once at each coverage region and ends at the footer in the stitch, the motif the index gives Fil.

- **Command palette.** ⌘K or Ctrl+K, or the header's button: jump to a section, switch every code sample's language, copy the test key or the base URL, or set the theme.
- **Code samples.** Three tasks in curl, Node, Python, PHP and Go. Each uses its language's own HTTP tooling, and all follow one remembered language choice. They are highlighted at build time.
- **Segment counter.** Type a message and see its encoding, length, parts and cost. It names the character that forced UCS-2.

The API, its key, its prices, coverage and changelog are fictional. The base URL is on `.example`, a domain reserved for documentation, and the page says so.

## Ndop items

`command`, `dialog`, `tabs`, `table`, `badge`, `accordion`, `toggle-group` (with `toggle`), `textarea`, `button` and `tooltip`, added with `ndop add` (ADR-0002). `textarea` is the one item beyond the brief, for the segment counter.

Restyled through tokens first:

- The page's tokens in `src/theme.css` are ink and paper with a dark mirror, a green `--thread` for lines and marks, and `--accent-text` for green text. #22C55E is too light for text on paper, so green text is #15803D in light and #4ADE80 in dark.
- The code surfaces stay dark in both themes.

Edits to the copied files, each commented where it is made:

- **The palette.** Ndop has no command dialog and binds no shortcut, so the palette puts Command inside Dialog and binds ⌘K and Ctrl+K itself.
- **`textarea`.** It drops its `NdInput` host directive. `NdInput` mirrors a form field's state through `@angular/forms`, the counter's textarea belongs to no form, and importing it cost 8.9 kB gzip of initial JS.
- **`dialog`, `tooltip` and `accordion`.** They add `motion-reduce:animate-none` with its `data-[state=open]` and `data-[state=closed]` variants, since Ndop's animations run even with reduced motion. The plain class loses to the animations' own `data-[state]` variants.

`src/app/lib/icons.ts` registers only the icons the page draws, inlined from Lucide: close, search, chevron, copy and check. The Ndop gaps these edits work around are in the build spec's gaps table.

## Code samples

The samples live in `src/app/code/samples/`, one file per task and language. The `highlight` target runs the workspace's `highlight-code` executor, which tokenises them with [Shiki](https://shiki.style) and writes `samples.generated.ts`. The page renders those tokens itself, so it ships no highlighter. `build`, `test` and `serve` depend on the target, so the file is always regenerated from the samples first.

## Theme and motion

Inter Tight for display and text, JetBrains Mono for code and labels. A fallback face sized like Inter Tight is declared in `index.html`, so the headline takes the same room before and after the web font loads. It's declared there because the build inlines only critical rules and leaves `@font-face` in the deferred stylesheet.

Motion is CSS, imported by `theme.css` and scoped by component tags, so it costs no JavaScript:

- The hero's request types out, then the reply arrives.
- Each section's run of thread draws, and a bead rides it level with the middle of the screen.
- The header slims; countries pop in; prices roll up.

Answers glide open with Ndop's own accordion animation. With reduced motion, or without scroll timelines, the page stands still with the thread drawn in full.

## Sources

The FAQ's and the page's facts, as the art direction board checked them:

- [Meta for Developers, WhatsApp pricing](https://developers.facebook.com/docs/whatsapp/pricing):
  - per-message pricing since 1 July 2025;
  - the message categories;
  - the 1,000 free service messages a month;
  - the 24-hour customer service window and templates outside it.
- [Wikipedia, SMS](https://en.wikipedia.org/wiki/SMS): 160 GSM 7-bit or 70 UCS-2 characters in one message, and 153 or 67 per part in a split one.
- [Wikipedia, GSM 03.38](https://en.wikipedia.org/wiki/GSM_03.38): which accented letters fit the GSM 7-bit alphabet, and € taking two characters. Lowercase ç, where sources differ, is left out of the copy.
- [Wikipedia, Telephone numbers in Cameroon](https://en.wikipedia.org/wiki/Telephone_numbers_in_Cameroon): +237, and nine-digit numbers with mobiles starting with 6.
- [Wikipedia, List of telephone country codes](https://en.wikipedia.org/wiki/List_of_telephone_country_codes): the coverage section's dialling codes.
- [Wikipedia, Silicon Mountain](https://en.wikipedia.org/wiki/Silicon_Mountain) and [TechCabal, 2018](https://techcabal.com/2018/08/10/cameroons-silicon-mountain-its-history-resilience-and-future/): Buea's nickname.

## Asset credits

| Asset                                     | Source                                                                                                                      | License |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------- |
| `public/og.png`                           | Rendered from the page's copy and fonts by `og/render-og.mts` (`nx run fil:og`)                                             | MIT     |
| `public/favicon.svg`                      | The stitch motif from the index's motif set                                                                                 | MIT     |
| The thread, knots and stitch              | Drawn in CSS and SVG for this page                                                                                          | MIT     |
| Inter Tight                               | [The Inter Project Authors](https://github.com/rsms/inter-tight), via `@fontsource-variable/inter-tight`                    | SIL OFL |
| JetBrains Mono                            | [The JetBrains Mono Project Authors](https://github.com/JetBrains/JetBrainsMono), via `@fontsource-variable/jetbrains-mono` | SIL OFL |
| Close, search, chevron, copy, check icons | [Lucide](https://lucide.dev)                                                                                                | ISC     |
