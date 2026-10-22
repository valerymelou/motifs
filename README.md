# Motifs

Motifs is a series of twelve landing pages for fictional brands, built with Angular and [Ndop UI](https://ndop.dev) only. Each page has its own art direction, to show that one component library can carry very different identities.

The pages are published as static files at [motifs.valerymelou.com](https://motifs.valerymelou.com), one path per page.

## How it's made

The series is designed and reviewed by Valery Melou and implemented with AI coding tools.

## Workspace

One Nx workspace, managed with pnpm. Each page is its own Angular application, prerendered to static HTML.

| Project  | Path          | Serves                     |
| -------- | ------------- | -------------------------- |
| `motifs` | `apps/motifs` | The series index site, `/` |

## Commands

```sh
pnpm install
pnpm nx serve motifs
pnpm nx run-many -t build test lint
```

## License

MIT
