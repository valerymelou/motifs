# ADR-0004: Per-page JS budgets for Ndop gaps

- Status: Accepted
- Date: 2026-10-24

## Context

The build spec caps initial JS at 120 kB gzip per page. Lighthouse CI measures it as the script bytes a page transfers (ADR-0003).

Atelier Ndop, the first page, measures 121.2 kB with its brief complete: the pattern maker's toggle groups, tooltips, slider, popover, switch and dialog, the story and the motion pass. About 7 kB of that is `@angular/forms`. Ndop's slider, switch and toggle primitives import it to look for a form control, even when the page has no form. The gap is in the spec's gaps table.

Every cut that keeps the brief was made first:

- head tags set at prerender only;
- a plain `<img>` instead of `NgOptimizedImage`;
- a footer that no longer carries every page's manifest entry;
- component styles moved to the global stylesheet;
- the generated photo list cut to widths.

The page is about 114 kB without the forms code. The remaining ways under 120 kB were to drop a brief component (the Tooltip saves 1.1 kB, not enough on its own) or to fix Ndop.

## Decision

- **The default stays 120 kB.** A page may carry a higher budget, up to 125 kB, only when an Ndop gap in the spec's gaps table accounts for the excess.
- **Each raised budget is named in `lighthouserc.cjs`,** with the gap it stands for. Lighthouse CI asserts each page against its own budget through `assertMatrix`. The page's plan records the budget and why.
- **Atelier Ndop's budget is 124 kB:** the forms gap plus room for its polish pass.
- **A raised budget comes back down when Ndop fixes the gap.** The page then moves to the newer Ndop once the release has aged past pnpm's minimum release age.

## Consequences

- Pages built on Ndop's form primitives start about 7 kB behind. Their plans should count that before choosing components.
- The budget no longer gives one number for the whole series. Reviewers read the page's line in `lighthouserc.cjs` to know what it is held to.
- The fix belongs in Ndop. An optional injection that doesn't import `@angular/forms` would bring every affected page back under 120 kB.
