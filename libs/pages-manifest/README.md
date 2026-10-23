# pages-manifest

The list of Motifs pages, typed: each page's slug, name, tagline, mood, accent color, status and the Ndop items it uses, plus `SITE` facts shared by the whole series. The series index and the series footer read from it.

```ts
import { findPage, PAGES, pagesByMood } from '@motifs/pages-manifest';
```

When a page launches, set its `status` to `live`.

Run `nx test pages-manifest` for the unit tests.
