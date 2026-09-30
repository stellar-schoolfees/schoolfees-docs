# Add app-facing and pilot documentation

**Difficulty:** medium
**Labels:** help wanted, area:docs

## Problem

This book documents the contract precisely, but there is nothing for the people
who would actually use `schoolfees`: no page that walks a parent through paying,
no page that walks school staff through recording a fee, no page on connecting a
wallet, and no page describing what a pilot participant will see. The app now
exists (`schoolfees-app`), so the steps can be written against real UI — but no
pilot has happened, so the pages must not imply real usage, and every step must
be checked against the app as built.

## Scope

Add:

- a participant-facing page for paying a fee,
- a staff-facing page for recording a fee and handling refunds,
- a short page on connecting a wallet on testnet, and
- a note on what a pilot participant sees, once a pilot has run.

All four in plain language, with a clear TESTNET warning, and with error handling
that quotes `ERRORS.md`.

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
`ERRORS.md` in `schoolfees-contracts`. The app's own README section "What is
proven vs assumed" is the model for honest phrasing.

## How to test

```bash
node scripts/check-links.mjs
node --test
```

Then run the app (`npm run dev` in `schoolfees-app`) and walk through the pages
against it, fixing anything that does not match. Anything that needs a deployed
contract stays marked unverified until the first testnet deployment.
