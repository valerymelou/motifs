# Motifs

Motifs is a series of twelve landing pages for fictional brands, built with Angular and [Ndop UI](https://ndop.dev) only. Each page has its own art direction, to show that one component library can carry very different identities.

The pages are published as static files at [motifs.valerymelou.com](https://motifs.valerymelou.com), one path per page.

## How it's made

The series is designed and reviewed by Valery Melou and implemented with AI coding tools.

## Workspace

One Nx workspace, managed with pnpm. Each page is its own Angular application, prerendered to static HTML.

| Project            | Path                     | Purpose                                               |
| ------------------ | ------------------------ | ----------------------------------------------------- |
| `motifs`           | `apps/motifs`            | The series index, served at `/`                       |
| `pages-manifest`   | `libs/pages-manifest`    | The typed list of pages the index and footers read    |
| `motion`           | `libs/motion`            | Reveal, stagger, parallax and scroll-progress helpers |
| `site`             | `libs/site`              | The series footer and the page meta provider          |
| `workspace-plugin` | `tools/workspace-plugin` | The landing-page generator and site assembly          |

Each page will live in `apps/<slug>`, served at `/<slug>/`.

## Commands

```sh
pnpm install
pnpm nx serve motifs
pnpm nx run-many -t build test lint e2e
```

Start a new page (it must be listed in `libs/pages-manifest` first), then build the whole site into `dist/site`:

```sh
pnpm nx g @motifs/workspace-plugin:landing-page <slug>
pnpm nx run workspace-plugin:assemble-site
```

## License

MIT
