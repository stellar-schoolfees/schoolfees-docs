# Roadmap

What is next for the documentation, in order. Anything not listed as done is
**not implemented**.

## Done (Phase 3 — v0 documentation set)

- [x] mdBook configuration (`book.toml`) and the table of contents (`src/SUMMARY.md`).
- [x] `architecture.md`, filled from the real contract code, every claim pointing at a file, function or test.
- [x] `limitations.md`, covering testnet-only scope, what is not enforced on-chain, what is not handled, the pilot-evidence boundary and the production boundary.
- [x] `threat-model.md`, a STRIDE walk-through with honest "not applicable, because…" entries.
- [x] `pilot-playbook.md`, written for a solo builder.
- [x] `pilots/` with a note that no pilot has happened yet.
- [x] `introduction.md`, `quickstart.md`, `faq.md`.
- [x] `scripts/check-links.mjs` + tests, and `.github/workflows/docs.yml` running the link check, the tests and the mdBook build in CI.
- [x] `README.md`, `CONTRIBUTING.md`, `LICENSE`, `.gitignore`, `.gitattributes`.

## Next

- [ ] Push the v0 documentation and get CI green on GitHub.
- [ ] Publish the built book so it can be read in a browser — see [draft 01](docs/issue-drafts/01-publish-book-to-github-pages.md).
- [ ] Record the deployed contract id and explorer links here once the contract is deployed — only real values, never invented ones.

## Blocked on a real pilot

These wait for facts that do not exist yet:

- [ ] The first `pilots/{name}.md`, written after a real pilot from what actually happened, including what did not work.
- [ ] Update `limitations.md` and `threat-model.md` with anything the pilot revealed.
- [ ] Publish the participant-facing flow (how a parent pays, how a school records a fee) once the app exists and a pilot validates it — see [draft 02](docs/issue-drafts/02-app-and-pilot-documentation.md).

## Later

- [ ] App-facing pages in this book, once `schoolfees-app` exists: wallet setup, a TESTNET banner, and errors mapped from `ERRORS.md`.
- [ ] A coverage or freshness check for the docs (no number is set yet on purpose).

## Explicitly out of scope

Mainnet deployment, investor or fundraising material, and any page that
describes a feature the code does not have.
