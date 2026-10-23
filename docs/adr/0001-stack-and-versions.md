# ADR-0001: Stack and pinned versions

- Status: Accepted
- Date: 2026-10-22

## Context

Motifs is a public reference for building with Angular and Ndop UI. Readers copy its setup, so the versions it runs on must be stated, not guessed from a lockfile. The build spec fixes the stack (Nx, pnpm, standalone zoneless Angular, static prerendering, Ndop UI, Tailwind CSS v4, Vitest, Playwright with axe) and asks this ADR to pin the versions.

## Decision

Use the versions below. `pnpm-lock.yaml` holds the exact resolved version of every package; this table records the ones the series depends on and the range each is declared with in `package.json`.

| Concern          | Package                                                       | Version                       | Declared as                       |
| ---------------- | ------------------------------------------------------------- | ----------------------------- | --------------------------------- |
| Runtime          | Node.js                                                       | 26.0.0                        | (local)                           |
| Package manager  | pnpm                                                          | 12.8.1                        | `packageManager`                  |
| Monorepo         | `nx`, `@nx/angular`, `@nx/playwright` and other `@nx/*`       | 24.0.0                        | exact                             |
| Framework        | `@angular/*` (core, build, cli, ssr, router, forms)           | 22.2.3                        | `~22.2.0`                         |
| Language         | `typescript`                                                  | 6.0.3                         | `~6.0.3`                          |
| UI               | `@ndop/core`, `@ndop/primitives`                              | 1.1.0                         | `^1.1.0`                          |
| UI tooling       | `@ndop/cli`                                                   | 1.1.0                         | `^1.1.0`                          |
| UI peer          | `@angular/cdk`                                                | 22.2.4                        | `~22.2.0`                         |
| Styling          | `tailwindcss`, `@tailwindcss/postcss`                         | 4.3.3                         | `^4.3.3`                          |
| Theme assets     | `@fontsource-variable/geist`, `geist-mono`, `@lucide/angular` | 5.3.0, 5.3.0, 1.61.0          | `^5.3.0`, `^5.3.0`, `^1.61.0`     |
| Display face     | `@fontsource/instrument-serif`                                | 5.3.0                         | `^5.3.0`                          |
| Library build    | `ng-packagr`                                                  | 22.2.4                        | `~22.2.0`                         |
| Workspace plugin | `@nx/plugin`, `@nx/vitest`, `vite`, `@swc-node/register`      | 24.0.0, 24.0.0, 8.3.5, 1.11.1 | exact, exact, `^8.0.0`, `~1.11.1` |
| Unit tests       | `vitest`, `jsdom`                                             | 4.1.12, 27.4.0                | `^4.0.8`, `^27.1.0`               |
| E2E tests        | `@playwright/test`                                            | 1.64.1                        | `^1.64.1`                         |
| Accessibility    | `@axe-core/playwright`                                        | 4.14.0                        | `^4.14.0`                         |
| Performance      | `@lhci/cli` (Lighthouse 12.6.1)                               | 0.15.1                        | `^0.15.1`                         |
| Deploy           | `wrangler` (ADR-0003)                                         | 4.152.0                       | exact                             |
| Lint             | `eslint`, `angular-eslint`, `typescript-eslint`               | 9.39.5, 22.6.0, 8.72.0        | `^9.8.0`, `^22.5.0`, `^8.58.0`    |
| Format           | `prettier`                                                    | 3.6.2                         | `~3.6.2`                          |

Notes on the choices:

- Angular 22.2 supports Node `^22.22.3 || ^24.15.0 || >=26.0.0`, and Ndop 1.1.0 supports Angular 21 and 22, so the two majors fit together.
- `@ndop/primitives` lists `@angular/cdk` as a peer dependency, so the CDK is installed only because Ndop needs it, as the spec allows.
- Tailwind v4 is wired through `@tailwindcss/postcss` (with `postcss`). Angular's build looks for `.postcssrc.json` or `postcss.config.json` in the project folder, then the workspace root. Each app gets its own `.postcssrc.json` (ADR-0002).
- The shared libraries are buildable with `ng-packagr` only because Nx's `vitest-angular` runner, which the apps also use, requires a build target for libraries. They are not published.
- Wrangler only deploys here: `wrangler pages deploy` uploads `dist/site` and runs no Workers code. Its `workerd` dependency's install script is denied in `allowBuilds`, since only local Workers development needs it.
- pnpm keeps its default supply-chain policy: a package must be at least one day old before it installs. No package is excluded from it. When a fresh release is needed, wait for it to age instead of adding an exclusion.

## Consequences

- Upgrades go through `nx migrate` (Nx and Angular) or `pnpm update` (the rest), with the same change updating this table. A major version change gets a new ADR that supersedes this one.
- The theme assets come with Ndop's default theme and icon set, installed by `ndop add default icons`. Each page swaps the fonts for its own.
- No app runs a server: every app builds with `outputMode: 'static'`, so Express is not a dependency.
- The Node version is the one the workspace was set up and tested with. CI pins the same major once it exists.
