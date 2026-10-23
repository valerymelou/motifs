# ADR-0003: CI on GitHub Actions, hosting on Cloudflare Pages

- Status: Accepted
- Date: 2026-10-23

## Context

The build spec asks for CI that builds, tests and checks every page with axe and Lighthouse, a preview deployment for every pull request, and a production deployment of `dist/site` to motifs.valerymelou.com. It leaves the host open.

The site is plain static files, so any static host works. Valery chose [Cloudflare Pages](https://developers.cloudflare.com/pages/), for room to grow:

- Its [Direct Upload](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/) takes a folder from CI through `wrangler pages deploy`, so the build stays in CI, where the checks run.
- Every branch other than the production branch becomes a [preview deployment](https://developers.cloudflare.com/pages/configuration/preview-deployments/), at its own URL. Previews send `X-Robots-Tag: noindex`.
- It [serves the nearest `404.html`](https://developers.cloudflare.com/pages/configuration/serving-pages/) for unknown paths, and the assembled site has one at its root.
- The [free plan's limits](https://developers.cloudflare.com/pages/platform/limits/) are 20,000 files a site, 25 MiB a file and unlimited previews. Twelve pages fit well inside them.

## Decision

- **CI runs on GitHub Actions** (`.github/workflows/ci.yml`), on every pull request and every push to `main`, with Node 26 and the pnpm version from `packageManager`:
  1. `nx format:check --all`;
  2. `nx affected -t lint test build e2e`, where every app's e2e suite runs axe on desktop and mobile;
  3. `nx run workspace-plugin:lighthouse`, which builds every app, assembles `dist/site` and runs Lighthouse CI on every page, three runs each, judged on the median against the spec's quality bar (`lighthouserc.cjs`).
- **Each run keeps `dist/site` and the Lighthouse reports as artifacts**, so the deploy jobs publish exactly the site that was checked.
- **Pull requests get a preview** after the checks pass: the preview job runs `wrangler pages deploy dist/site --project-name=motifs --branch=<pull request branch>`. The `preview` GitHub environment links to the branch's preview URL. Pull requests from forks get no secrets, so their preview is the `site` artifact, downloaded and opened as it would deploy.
- **Production deploys from `main`** after the checks pass: the deploy job runs the same command with `--branch=main`, the Pages project's production branch, in a `production` GitHub environment whose secret is limited to `main`.
- Wrangler is a pinned dev dependency, so CI deploys with the version in the lockfile. Third-party actions are pinned to commit SHAs. Lighthouse reports stay on disk instead of going to a public upload.

## Consequences

- Setup outside the repo:
  - create a Pages project named `motifs` for Direct Upload, with `main` as its production branch, and add motifs.valerymelou.com as its custom domain;
  - create an account API token with the Account › Cloudflare Pages › Edit permission;
  - in the GitHub repository's settings, store the account ID as the `CLOUDFLARE_ACCOUNT_ID` variable, and the token as the `CLOUDFLARE_API_TOKEN` secret in a `production` environment limited to `main` and in a `preview` environment.
- Preview URLs are public. Pages can put them behind Cloudflare Access (Settings › General › Enable access policy) if a preview ever needs to stay private.
- Anyone who can push a branch to the repository can deploy a preview with the token. Pull requests from forks can't.
- Pages limits a file to 25 MiB and a site to 20,000 files. Pages with photography must keep images small, which the spec's 200 kB hero budget already asks for.
- Lighthouse runs on CI hardware, which varies. A page close to a budget can fail on one run and pass on the next; the median of three runs smooths most of that.
