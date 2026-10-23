# site

The parts every Motifs page shares:

- `<mt-series-footer slug="…">`: the slim strip at the end of each page, with the series link, the page's source folder on GitHub, Ndop UI and the fictional-brand note. Place it inside the page's own `<footer>`.
- `provideLandingMeta(slug)`: sets the title, description, canonical URL and Open Graph tags from the pages manifest. Leave the slug out for the series index. Each app ships its Open Graph image as `public/og.png` (1200×630).

Run `nx test site` for the unit tests.
