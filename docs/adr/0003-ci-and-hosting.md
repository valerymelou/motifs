# ADR-0003: CI on GitHub Actions, hosting on Cloudflare Pages

- Status: Accepted
- Date: 2026-10-23

## Context

The build spec asks for CI that builds, tests and checks every page with axe, a Lighthouse check of every page against its quality bar, a preview deployment for every pull request, and a production deployment of `dist/site` to motifs.valerymelou.com. It leaves the host open.

The site is plain static files, so any static host works. Valery chose [Cloudflare Pages](https://developers.cloudflare.com/pages/), for room to grow:

- Its [Direct Upload](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/) takes a folder from CI through `wrangler pages deploy`, so the build stays in CI, where the checks run.
- Every branch other than the production branch becomes a [preview deployment](https://developers.cloudflare.com/pages/configuration/preview-deployments/), at its own URL. Previews send `X-Robots-Tag: noindex`.
- It [serves the nearest `404.html`](https://developers.cloudflare.com/pages/configuration/serving-pages/) for unknown paths, and the assembled site has one at its root.
- The [free plan's limits](https://developers.cloudflare.com/pages/platform/limits/) are 20,000 files a site, 25 MiB a file and unlimited previews. Twelve pages fit well inside them.

## Decision

- **CI runs on GitHub Actions** (`.github/workflows/ci.yml`), on every pull request and every push to `master`, with Node 26 and the pnpm version from `packageManager`:
  1. `nx format:check --all`;
  2. `nx affected -t lint test build e2e`, where every app's e2e suite runs axe on desktop and mobile;
  3. `nx run workspace-plugin:assemble-site`, which builds every app and assembles `dist/site`.
- **Each run keeps `dist/site` as an artifact**, so the deploy jobs publish exactly the site that was checked.
- **Lighthouse runs locally, not in CI.** `nx run workspace-plugin:lighthouse` assembles `dist/site` and runs Lighthouse CI on every page, three runs each, judged on the median against the spec's quality bar (`lighthouserc.cjs`). It is part of each page's Verify step, before the page goes live. Lighthouse applies its mobile network and CPU throttling for real (`throttlingMethod: devtools`) instead of simulating it: served from localhost, the JS arrives before the first paint, and the simulation then counts it against LCP although a phone paints the prerendered page long before. In GitHub Actions the same pages failed on blocking time alone: the runners' CPUs are several times slower than a developer machine, so the 4× CPU throttling pushed total blocking time to 449–904 ms against 39–158 ms locally, with LCP, CLS and script weight unchanged. The check also took about four of the run's seven minutes.
- **Pull requests get a preview** after the checks pass: the preview job runs `wrangler pages deploy dist/site --project-name=motifs --branch=<pull request branch>`. The `preview` GitHub environment links to the branch's preview URL. Pull requests from forks get no secrets, so their preview is the `site` artifact, downloaded and opened as it would deploy.
- **Production deploys from `master`** after the checks pass: the deploy job runs the same command with `--branch=master`, the Pages project's production branch, in a `production` GitHub environment whose secret is limited to `master`.
- Wrangler is a pinned dev dependency, so CI deploys with the version in the lockfile. Third-party actions are pinned to commit SHAs. Lighthouse reports stay on disk instead of going to a public upload.

## Consequences

- Setup outside the repo:
  - create a Pages project named `motifs` for Direct Upload, with `master` as its production branch, and add motifs.valerymelou.com as its custom domain;
  - create an account API token with the Account › Cloudflare Pages › Edit permission;
  - in the GitHub repository's settings, store the account ID as the `CLOUDFLARE_ACCOUNT_ID` variable, and the token as the `CLOUDFLARE_API_TOKEN` secret in a `production` environment limited to `master` and in a `preview` environment.
- Preview URLs are public. Pages can put them behind Cloudflare Access (Settings › General › Enable access policy) if a preview ever needs to stay private.
- Anyone who can push a branch to the repository can deploy a preview with the token. Pull requests from forks can't.
- Pages limits a file to 25 MiB and a site to 20,000 files. Pages with photography must keep images small, which the spec's 200 kB hero budget already asks for.
- CI doesn't check the quality bar, so a change that adds weight to a live page isn't caught by a pull request. Any change to a page goes through its Verify step, and Lighthouse there is the gate. Run it again before merging a change that touches several pages or a shared library.
- Local hardware varies too. A page close to a budget can fail on one run and pass on the next; the median of three runs smooths most of that.
