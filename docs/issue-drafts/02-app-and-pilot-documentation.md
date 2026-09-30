# Add app-facing and pilot documentation

**Difficulty:** medium
**Labels:** help wanted, area:docs

## Problem

This book documents the contract precisely, but there is nothing for the people
who would actually use `schoolfees`: no page that walks a parent through paying,
no page that walks school staff through recording a fee, and no page describing
what a pilot participant will see. That is partly because `schoolfees-app` does
not exist yet and no pilot has happened — the pages cannot be written honestly
until both are true.

## Scope

Once the app exists and at least one pilot has run, add:

- a participant-facing page for paying a fee, and
- a staff-facing page for recording a fee and handling refunds,

both written in plain language, with a clear TESTNET warning.

Out of scope: marketing copy, screenshots of anything that is not built, and any
step that cannot be verified against `schoolfees-app` or a real pilot record.

## Acceptance criteria

- [ ] Every step on the new pages can be performed in the app as built.
- [ ] Error handling quotes the wording from `ERRORS.md` in `schoolfees-contracts`, not a paraphrase.
- [ ] No personal data, and no invented school or participant.
- [ ] Any claims about real usage link to a `pilots/{name}.md` file that exists.
- [ ] The new pages are listed in `src/SUMMARY.md`, and `node scripts/check-links.mjs` passes.

## Where to start

`src/quickstart.md` and the pilot playbook show the voice to use. Read
`AGENTS.md` for the privacy and truthfulness rules; the error wording lives in
`ERRORS.md` in `schoolfees-contracts`.

## How to test

```bash
node scripts/check-links.mjs
node --test
```

Then walk through the pages against the running app and fix anything that does
not match.
