# Publish the book to GitHub Pages

**Difficulty:** easy
**Labels:** good first issue, area:ci

## Problem

CI builds the book with `mdbook build`, but the result is thrown away. There is
no stable URL where a reader — a school, a parent, or a reviewer — can read the
documentation without cloning the repository.

## Scope

Add a step (or workflow) that publishes the built book to GitHub Pages from
`main`. Keep the existing checks in `.github/workflows/docs.yml` unchanged, and
do not publish from pull requests.

Out of scope: a custom domain, analytics, or any change to the book's contents.

## Acceptance criteria

- [ ] The book is served from the repository's GitHub Pages URL.
- [ ] A push to `main` republishes it; pull requests do not.
- [ ] `node scripts/check-links.mjs`, `node --test` and `mdbook build` still run and still gate the deploy.
- [ ] The URL is written into `README.md` in the same pull request.

## Where to start

`.github/workflows/docs.yml` and `book.toml`. Read `AGENTS.md` first: testnet
only, no invented content, and agents do not change remotes or repository
settings — the Pages setting is a human step.

## How to test

```bash
node scripts/check-links.mjs
node --test
mdbook build
```

Then push to a branch and confirm the deploy job publishes the `book/` directory
only on `main`.
