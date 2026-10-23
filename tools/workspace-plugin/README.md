# workspace-plugin

The local Nx plugin that keeps every Motifs page the same shape and turns the built apps into one static site.

## `landing-page` generator

```sh
pnpm nx g @motifs/workspace-plugin:landing-page <slug>
```

Creates `apps/<slug>` and `apps/<slug>-e2e` for a page already listed in `libs/pages-manifest`:

- a static, prerendered Angular app built with `baseHref` `/<slug>/`, its browser files in `dist/apps/<slug>/<slug>/`, so serving `dist/apps/<slug>` answers at the production path;
- Ndop UI set up as ADR-0002 describes, ending with `ndop add default utils icons`;
- `src/theme.css`, a `sections/` folder with a hero section, `content.ts`, a README to fill in, the page meta and the series footer;
- an e2e project, on the page's own port, that checks the title, that every file loads from under `/<slug>/`, that the page reads without JavaScript, and that axe finds no violations on desktop and mobile.

## `assemble-site` executor

```sh
pnpm nx run workspace-plugin:assemble-site
```

Builds the index (`motifs`) and every app tagged `type:landing`, then writes `dist/site`: the index at the root, each page at `/<slug>/`, a sitemap of the index and live pages, `robots.txt` and `404.html`.

Run `nx test workspace-plugin` for the unit tests. Run pnpm from the workspace root: this folder has its own `package.json`, and pnpm run from inside it installs a separate copy of its dependencies.
