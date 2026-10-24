# Fil: page plan

- Status: Approved by Valery on 24 October 2026, with the board's facts checked (all but the one where sources differ), the recommendations agreed, Shiki approved, a yes to the segment counter, and the Send test button kept.
- Direction: The Thread, chosen on 24 October 2026 from the [art direction board](https://claude.ai/artifact/KEuxvPdV8gkK7F5vVsZX8K).
- Slug and path: `fil`, `/fil/`. Mood: editorial. Accent `#22C55E`.

## The idea

A fictional developer API from Buea, Silicon Mountain, for sending SMS and WhatsApp messages across African networks with one endpoint. _Fil_ is French for thread and wire; _sans fil_ is wireless, and a _coup de fil_ is a phone call.

The page is drawn on light, squared paper in black ink, and its one colour is a green thread. It starts as the cursor in the hero's terminal and runs down the whole page: past the code samples, knotting once at each country, along the pricing table, and out at the footer as a stitch, the index's motif for Fil. Every message the page sends runs along it as a bead.

The brief's two signature moments carry it: a command palette that really works (⌘K / Ctrl+K), and code samples in five languages that switch together. A segment counter in the pricing section adds a third, smaller one: type a message and see what it costs.

## Sections, in order

| Section      | Component              | What it holds                                                                                                                                                                                   |
| ------------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header       | `mt-site-header`       | Wordmark, anchors to Code, Coverage, Pricing and FAQ, a "⌘K" button that opens the palette, "Built in Buea"                                                                                     |
| Hero         | `mt-hero-section`      | "One thread, every network." and a line on SMS and WhatsApp; a terminal with a `curl` request and its JSON reply, whose cursor starts the thread; links to the code samples and to pricing      |
| Code samples | `mt-code-section`      | Three tasks (send an SMS; send a WhatsApp template; receive a delivery receipt), each in curl, Node, Python, PHP and Go, all following one language choice, each with a copy button             |
| Features     | `mt-features-section`  | Six short features, from one number format to SMS fallback when WhatsApp can't deliver, delivery receipts by webhook, idempotent sends and a test mode                                          |
| Coverage     | `mt-coverage-section`  | The countries Fil reaches, by region, with their dialling codes; the thread knots at each. Countries only, no operators (decision 4)                                                            |
| Pricing      | `mt-pricing-section`   | A Toggle Group for monthly volume; a Table of the price per message by type and region at that volume, marked fictional; the segment counter (`mt-segment-counter`) under the table             |
| Changelog    | `mt-changelog-section` | Five dated entries, each with a Badge (New, Improved, Fixed)                                                                                                                                    |
| FAQ          | `mt-faq-section`       | An Accordion of six questions, answered with the checked facts: the 24-hour window and templates, SMS segment length, why one ê can double the cost, number format, test keys, fictional prices |
| Footer       | `mt-page-footer`       | Fil's details, then the series footer with the fictional-brand note                                                                                                                             |
| Palette      | `mt-command-palette`   | Ndop Command inside Ndop Dialog, opened by ⌘K / Ctrl+K or the header button                                                                                                                     |

## Signature moment 1: the command palette

Ndop's Command filters a list as you type and runs the highlighted item on Enter. Ndop has no command dialog and binds no shortcut, so the palette is Command inside Dialog, and the page binds the shortcut itself (both noted as Ndop gaps).

| Group         | Commands                                                  |
| ------------- | --------------------------------------------------------- |
| Go to         | Code samples, Features, Coverage, Pricing, Changelog, FAQ |
| Code language | Show samples in curl, Node, Python, PHP or Go             |
| Copy          | Copy the test API key placeholder; copy the base URL      |
| Theme         | Light, dark, or match the system                          |

- **Shortcut:** ⌘K on macOS and Ctrl+K elsewhere opens it from anywhere on the page, except while typing in a field. The header button shows the right one for the platform and opens it for mouse and touch.
- **After a command:** the dialog closes and focus goes where the command leads: the section heading for Go to, the samples for a language, back to the trigger otherwise. A polite live region confirms copies and theme changes ("Copied the test key").
- **Copy:** `navigator.clipboard.writeText`. Where the browser refuses, the palette shows the text selected instead, so it can be copied by hand.
- **Without JavaScript:** the header button is hidden; the anchors do the navigation.

## Signature moment 2: the code samples

One shared language choice (a signal in a small `CodeLanguage` service) drives every sample's Tabs. Choosing a language in any sample, or in the palette, switches them all. The choice is kept in `localStorage` for the next visit; storage that throws or comes back empty falls back to curl.

**Highlighting at build time.** A workspace executor, `highlight-code`, reads the samples from `src/app/code/samples/` (`send-sms.sh`, `send-sms.js`, … one file per task and language). It runs them through [Shiki](https://shiki.style) with a two-colour theme of Fil's own, and writes `src/app/code/samples.generated.ts`: each sample as lines of `[tokenClass, text]` pairs. The template renders those pairs as `<span>`s, so:

- the page ships no highlighter, only the tokens;
- no `innerHTML` (Angular's sanitizer would strip Shiki's inline styles);
- the token classes take their colours from the theme, so light and dark both work.

The generated file is committed, so it can be read and the editor knows its types. Unlike the atelier's photos, the samples are in git, so `build`, `test` and `serve` depend on the cached `highlight` target and the file is always regenerated from the samples first.

**One height per sample:** every language's panel shares one grid cell, the hidden ones kept in layout but invisible, so switching languages moves nothing below. The height is the longest language's, up to 24rem; longer code scrolls inside its panel.

**Copy buttons:** each sample has one, with a Tooltip that says "Copy" and then "Copied". **Without JavaScript:** curl shows; the other languages' tabs are inert.

## The segment counter

A Textarea, prefilled with a one-time-code message in French that fits one SMS. As the visitor types, it shows:

- **Encoding:** GSM 7-bit while every character is in the GSM 03.38 basic set or its extension; UCS-2 as soon as one isn't. The character that forced UCS-2 is named ("ê switches this message to UCS-2").
- **Length:** characters used against the limit. Extension characters such as € count twice in GSM 7-bit. UCS-2 counts UTF-16 code units, so most emoji count twice.
- **Parts:** one part up to 160 (GSM 7-bit) or 70 (UCS-2); above that, 153 or 67 per part.
- **Cost:** parts × the SMS price for the region and volume picked above it, marked fictional.

The result is announced in a polite live region after typing pauses, not on every keystroke. The rules live in a pure function (`segments(text)`) with unit tests on the edge cases: exactly 160, 161, one ê, one €, an emoji, an empty message. Lowercase ç, where the sources differ, gets no claim in the copy; the counter follows the GSM 03.38 basic table as published, where only Ç appears.

Without JavaScript the prefilled message shows with its result for that text, prerendered.

## The thread

Drawn per section, not as one page-long SVG, so each section owns its part and the layout can change at any width:

- The thread runs down a column at the left edge of the content: 1rem in on phones, 2rem from 40rem up. It steps out of the hero terminal's last line, runs down every section, knots once at each coverage region, and ends at the footer in the stitch motif.
- One knot per region rather than per country: 25 knots in one column would stretch the coverage section over several screens.
- Each segment is a straight run, vertical or horizontal, so a bead can travel along it by `transform` alone. Knots are small rings that fill with green as the thread reaches them, by `opacity`.

## Motion

All scroll-linked motion is CSS scroll-driven animation (`animation-timeline: view()`), as on the atelier. It costs no JavaScript, animates transform and opacity only, and sits behind `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`. Section styles are imported by `theme.css` and scoped by the component's tag, not `styleUrl` (Angular ships component styles inside the JavaScript bundle).

| Where               | Moves                                                                                                                                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Header              | Sticky from 40rem; over the first 8rem of scroll its surface slims, the bar rises to its middle and a soft shadow comes in. On phones it scrolls away.                                                                                     |
| Hero                | The label, line and links rise in; the request types out line by line, then the reply; then the thread steps out of the terminal. The headline stays still: it is the largest paint, and a rise pushed Lighthouse's LCP from 0.7 to 1.4 s. |
| Thread              | Each section's run draws as the section comes up. A bead rides it level with the middle of the screen, handed from section to section at the seams.                                                                                        |
| Samples             | A newly chosen language slides in. "Send test" runs a bead down beside the sample.                                                                                                                                                         |
| Coverage            | Each region's knot fills, and its countries pop in one after another.                                                                                                                                                                      |
| Pricing             | Table rows rise in; a new price rolls up into its cell when the volume changes.                                                                                                                                                            |
| Features, changelog | Items rise in.                                                                                                                                                                                                                             |
| FAQ                 | Answers open and close with Ndop's own height animation, so the questions below glide. The spec allows an Ndop component's built-in transitions (rev 28); the copy turns it off for reduced motion.                                        |
| Footer              | The stitch turns into place as the thread arrives.                                                                                                                                                                                         |
| Palette             | Ndop's dialog opening, still with reduced motion, as on the atelier.                                                                                                                                                                       |

With reduced motion, or without scroll timelines, the thread is drawn in full, knots are filled, and nothing moves.

## Ndop items

`ndop add` per ADR-0002: `command`, `dialog`, `tabs`, `table`, `badge`, `accordion`, `toggle-group` (with `toggle`), `textarea`, `button`, `tooltip`. `icons.ts` keeps only the icons these items draw. `textarea` is the one item beyond the brief, for the segment counter. Its copy drops Ndop's `NdInput` host directive: `NdInput` mirrors a form field's state through `@angular/forms`, the counter's textarea belongs to no form, and importing it cost 8.9 kB gzip of initial JS. The id is the native attribute instead.

## Theme (`src/theme.css`)

| Token                           | Value (light)                   | Value (dark)           | Role                                              |
| ------------------------------- | ------------------------------- | ---------------------- | ------------------------------------------------- |
| `--background`                  | paper `#FAFAF7`                 | night `#0B0C0B`        | Page ground, with a faint 16px squared-paper grid |
| `--foreground`                  | ink `#0B0B0C`                   | chalk `#ECEDE8`        | Text                                              |
| `--primary`                     | ink                             | chalk                  | Buttons                                           |
| `--thread`                      | `#22C55E`                       | `#22C55E`              | The thread, knots, beads; never text on paper     |
| `--accent-text`                 | `#15803D`                       | `#4ADE80`              | Green text, at 4.5:1 or better on each ground     |
| `--muted`, `--muted-foreground` | paper shade, graphite `#4B4F49` | night shade, `#9CA39A` | Quiet surfaces and secondary text                 |
| `--code-bg`                     | ink                             | `#141614`              | Terminal and samples, dark in both themes         |
| `--radius`                      | `0.375rem`                      | the same               | Crisp, small                                      |

All written in OKLCH in the file. Every text pairing is checked for 4.5:1 in a unit test, in both themes. The theme follows the system until the palette sets one, kept in `localStorage`.

**Fonts:** Inter Tight for display and text, JetBrains Mono for code, data and labels. Both SIL OFL, self-hosted through Fontsource (decision 7). A fallback face sized like Inter Tight (Arial or Liberation Sans, with `size-adjust` and ascent and descent overrides) is declared in `index.html`, so the headline takes the same room before and after Inter Tight arrives. It's in `index.html` because the build inlines only the critical rules and leaves `@font-face` in the deferred stylesheet.

## Copy

Short, exact, written for developers: real units (characters, segments, per message), real limits, no superlatives. Sample lines:

- Hero: "One thread, every network." / "Send SMS and WhatsApp messages across Africa with one API, from Buea."
- FAQ: "Why did my French message cost two SMS? One ê, â, ô, î or û switches the whole message to UCS-2, which fits 70 characters instead of 160."
- Pricing: "Prices are fictional: Fil is a design study."

Facts in the copy come only from the board's checked claims, with their sources in the app README. The one where sources differ (lowercase ç) is left out. The coverage section's dialling codes are checked against the ITU's list when it is built, and listed in the README too.

## Assets

| Asset                        | Source                                                            | Where           |
| ---------------------------- | ----------------------------------------------------------------- | --------------- |
| No photographs (decision 3)  | —                                                                 | —               |
| The thread, knots and stitch | Drawn in CSS and SVG for this page                                | Everywhere      |
| `og` (1200 × 630)            | Rendered from the page's own terminal and thread, as on the index | Open Graph      |
| Favicon                      | The stitch motif from the index's motif set, in green             | Tab             |
| Inter Tight, JetBrains Mono  | Fontsource, SIL OFL                                               | Type            |
| Icons the items draw         | Lucide, ISC                                                       | Dialog, copy, … |

## JS budget

Fil keeps the default 120 kB. With every section in, Lighthouse measures 119.8 kB of script. Toggle Group, Command and Tabs don't pull in `@angular/forms` here; Ndop's Textarea did, through `NdInput`, so its copy drops that directive (above). The samples' token lists weigh 2.9 kB gzip. Moving them behind `@defer (hydrate never)` was measured and made the initial JS larger, as on the atelier. The margin is thin, so the polish pass adds no JavaScript.

## Ndop gaps (expected)

- **No command dialog.** Command is placed inside a Dialog by hand, as Ndop's own docs do.
- **No shortcut binding.** `ndCommandShortcut` only displays a shortcut; the page binds ⌘K / Ctrl+K itself.
- **Shared Tabs value.** Binding every Tabs' `[value]` to one signal keeps them in step: confirmed in the first unit of work.
- **Enter right after typing.** Command moves its highlight to the first match on the next render, so an Enter pressed in the same instant as the last keystroke runs the previous highlight. Only automated typing is that fast; the e2e tests wait for the highlight. Not logged as a gap unless a person can hit it.
- **Overlays and reduced motion.** As on the atelier, the dialog and tooltip copies add `motion-reduce:animate-none` with its `data-[state=open]` and `data-[state=closed]` variants (the plain class loses to the animations' own, more specific `data-[state]` variants).
- **The accordion ignores reduced motion.** Its open and close height animation runs even with reduced motion. The copy adds the same `motion-reduce` variants as the overlays. Logged in the spec's gaps table.
- **NdInput imports `@angular/forms`.** Ndop's Textarea (and Input) take `NdInput` as a host directive, which reads a bound form field through `@angular/forms` and its signal forms. On a page with no form that is 8.9 kB gzip of initial JS. The copy drops the directive; logged in the spec's gaps table.

## Tests

- Unit: the language choice and its storage fallback; the samples render every language and copy as plain text; the test send; the highlight executor; `segments(text)` on its edge cases.
- E2E: ⌘K and Ctrl+K open the palette and Escape closes it; filtering; every command (go to, language for all samples at once, copy, theme kept across a reload); the samples' tabs by keyboard; copy buttons; the pricing volume toggle; the segment counter switching to UCS-2 on one ê and announcing it; the FAQ by keyboard; reduced motion; the page reads without JavaScript; axe in both themes, on the page and on the open palette, an open FAQ item and the counter in UCS-2. Contrast in both themes is checked there, on the rendered page, rather than against a copy of the tokens.
- Lighthouse on `/fil/` within the quality bar.

## Decisions

1. **Direction:** The Thread (A).
2. **Facts:** all the board's claims are checked except lowercase ç, where sources differ, which is left out.
3. **Photographs:** none.
4. **Coverage:** countries and dialling codes, no operator names.
5. **Prices:** fictional, in US dollars, per message, marked fictional.
6. **Shiki:** approved as a dev dependency, for build-time highlighting.
7. **Fonts:** Inter Tight and JetBrains Mono.
8. **Fake surface:** `https://api.fil.example/v1`, `fil_test_xxxxxxxxxxxx`, `+2376XXXXXXXX`, and each language's own HTTP client.
9. **Segment counter:** yes, with Ndop's textarea.

All answered by Valery on 24 October 2026.
