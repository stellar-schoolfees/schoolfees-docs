# Add a docs freshness check

**Difficulty:** easy
**Labels:** good first issue, area:docs

## Problem

Every technical claim in this book names a file, function or test in
`schoolfees-contracts` or `schoolfees-app`, but nothing checks that those names
still exist. When the code repos are refactored, a renamed function or deleted
test silently turns a verified claim into a false one, and `check-links.mjs` only
checks links inside this repository — it cannot see the other two repos (CI
checks out this repo alone).

## Scope

Add a dependency-free Node script, in the same style as `scripts/check-links.mjs`,
that extracts the `path::function` references and the cited file paths from the
book's markdown and verifies them against the sibling repositories when those
directories are present, skipping the check with a clear message when they are
not (CI only checks out this repo).

Out of scope: changing CI to check out the other repos, any change to the book's
contents, and a coverage number for the docs.

## Acceptance criteria

- [ ] `node scripts/check-freshness.mjs` prints how many references it checked and fails when one is missing.
- [ ] When `../schoolfees-contracts` or `../schoolfees-app` is absent, the script says so and exits zero.
- [ ] The script has unit tests in the style of `check-links.test.mjs`, run by `node --test`.
- [ ] The command and its limits are documented in `CONTRIBUTING.md` and `README.md`.
- [ ] `node scripts/check-links.mjs` and `node --test` still pass.

## Where to start

`scripts/check-links.mjs` and `scripts/check-links.test.mjs` for the structure;
`src/architecture.md` for the shape of the references being checked. Read
`AGENTS.md` first: no dependencies, and the script reports rather than rewrites.

## How to test

```bash
node scripts/check-freshness.mjs
node --test
node scripts/check-links.mjs
```

Then rename a cited test in a checkout of `schoolfees-contracts` and confirm the
script fails with the file and line in this book.
