# Close the .gitignore gaps in this repository

**Difficulty:** easy
**Labels:** good first issue, area:docs

## Problem

Every repository in this project is supposed to ignore the same class of files —
env files and key material included — and this one does not. `schoolfees-docs/.gitignore`
currently ignores `/book/`, `/node_modules/` and editor/OS files, but **not**:

- `.env`
- `.env.local`
- `.stellar/`
- `*.key`

Found by the Git-readiness audit on 2026-10-01
(`docs/audits/2026-10-01-09-git-readiness.md`).

The risk is small **today**, and the honest framing matters: this repository has
no code that reads an environment file, no CLI that writes `.stellar/`, and no key
of its own, so the realistic scenario is a contributor dropping a scratch file
here by mistake, not a leak. That is exactly why it is an easy fix rather than an
incident — and exactly why it should not stay inconsistent with the other two
repositories.

## Scope

Add the missing patterns to `.gitignore`, with a short comment explaining what
they are for, so the three repositories' ignore rules agree on the things that
matter (env files and key material).

Out of scope: adding any code that reads an environment file, changing
`book.toml`, and adding a secret-scanning tool or hook (a separate, larger idea).

## Acceptance criteria

- [ ] `.gitignore` ignores `.env`, `.env.local`, `.stellar/` and `*.key`.
- [ ] `git check-ignore -v .env .env.local .stellar/x app.key` shows a rule for each.
- [ ] The patterns and their reasons can be compared to
      `schoolfees-app/.gitignore` and `schoolfees-contracts/.gitignore` without
      contradiction.
- [ ] `node scripts/check-links.mjs` and `node --test` still pass.
- [ ] The finding is marked resolved in `docs/audits/2026-10-01-09-git-readiness.md`.

## Where to start

`.gitignore` in this repository; compare with `../schoolfees-app/.gitignore`,
which has the missing patterns and a comment per group.

## How to test

```bash
git check-ignore -v .env .env.local .stellar/x app.key
node scripts/check-links.mjs
node --test
```
