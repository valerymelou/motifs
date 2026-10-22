# ADR-0002: Each app owns its Ndop components

- Status: Accepted
- Date: 2026-10-22

## Context

Every Motifs page restyles Ndop UI into a different identity. Ndop's styled components are not an npm package: the `ndop` CLI copies their source into a project, where it is meant to be edited. Only the headless layer (`@ndop/primitives`) and the runtime helpers (`@ndop/core`) ship through npm.

A shared library of styled components would force every page onto one look, or fill it with per-page variants. The spec rules it out.

`ndop init` reads `angular.json` only, so it cannot set up an Nx app. Ndop's installation docs give manual steps for Nx, after which `ndop add` works as usual. Those docs show a single `ndop.json` at the workspace root, which can describe only one app. This workspace will hold thirteen.

## Decision

Each app is its own Ndop project. Its config, lockfile and copied components live in the app folder, and the `ndop` CLI is pointed at that folder with `--cwd`:

```text
apps/<slug>/
├── ndop.json          # where this app's items go
├── ndop.lock.json     # installed item versions and file hashes
└── src/
    ├── styles.css     # Tailwind, @ndop/core/styles.css, theme tokens
    └── app/
        ├── ui/        # copied components, restyled freely
        ├── lib/       # utils.ts, icons.ts
        └── blocks/
```

`apps/<slug>/ndop.json`, with paths relative to the app folder:

```json
{
  "$schema": "https://ndop.dev/schema/config.json",
  "style": "default",
  "tailwind": { "css": "src/styles.css" },
  "aliases": {
    "ui": "src/app/ui",
    "lib": "src/app/lib",
    "blocks": "src/app/blocks"
  },
  "importAlias": "@/",
  "iconLibrary": "lucide"
}
```

Setting up an app follows Ndop's manual Nx steps, adapted to the per-app config:

1. Write `apps/<slug>/ndop.json` as above.
2. Import Tailwind and Ndop's token mechanics at the top of `apps/<slug>/src/styles.css`: `@import 'tailwindcss';` then `@import '@ndop/core/styles.css';`.
3. Add a `.postcssrc.json` that loads `@tailwindcss/postcss` in the app folder. Angular's build looks there first, and `ndop doctor --cwd apps/<slug>` checks the same file.
4. From the workspace root, add the theme and the helper files: `pnpm exec ndop add default utils icons --cwd apps/<slug>`.
5. Register `provideNdop()` and `provideIcons()` in the app's `app.config.ts`.

Later items are added the same way: `pnpm exec ndop add dialog --cwd apps/<slug>`. The landing-page generator performs steps 1 to 5, so every new page starts set up.

## Consequences

- Pages can restyle and rewrite their components without affecting each other. `ndop diff` and `ndop update` run per app with `--cwd`, and keep each page's edits through Ndop's three-way merge.
- npm dependencies stay in the root `package.json` at one version for the whole workspace. `ndop add` runs the package manager in the app folder, and pnpm walks up to the root `package.json`.
- Copied components import each other through relative paths. The `@/*` alias would need a `tsconfig.json` in each app's folder or one path in the base config, and a single path cannot point at thirteen apps. Without it, `ndop add` rewrites `@/` imports to relative ones. App code imports `provideIcons` from `./lib/icons`.
- The CLI reads `package.json` from the app folder, which has none. So it cannot see that a package is already installed, and it does not add the `@angular/cdk` peer that `@ndop/primitives` needs. The CDK is installed once at the root, as ADR-0001 records.
- `ndop add` runs pnpm with `strict-dep-builds` off. A new dependency with an unapproved build script installs without running that script instead of failing, so check `pnpm approve-builds` after adding items.
- Two Ndop gaps go to `ndop-ui/ui`: `init` support for Nx `project.json` apps, and `add` reading the workspace `package.json` when `--cwd` points at an app folder. Once both ship, steps 1 to 5 can become one `ndop init` per app.
