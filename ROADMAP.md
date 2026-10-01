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

## Done (Phase 5 — handoff audit)

- [x] `proven-vs-assumed.md` — every claim with the test or command behind it, or the word "assumed".
- [x] `pilot-readiness.md` — the honest checklist for the first testnet deployment.
- [x] `todo-verify.md` — everything still unverified, consolidated from all three repos.
- [x] `TEMPLATE.md` at the repository root — what to copy into a new project, and what to change.
- [x] Cross-repo audit: LICENSE, privacy and trailer rules, version facts and error wording checked against both code repos; stale "app not built yet" claims fixed.

## Done (engineering standards — 2026-10-01)

The book and the two code repositories were measured against the Build Arsenal
(crypto profile, plus education-platform for student-data privacy) and the
Flowtick engineering playbook. The gap map is
[`docs/arsenal-gap-map.md`](docs/arsenal-gap-map.md), which is deliberately outside
`src/` and not in `SUMMARY.md`.

- [x] `src/prd.md` — a one-page product requirements page, written from what the code does, with no invented numbers or users. Added to `SUMMARY.md`.
- [x] `src/legal-compliance.md` — a privacy and legal checklist marked *not legal advice*, including an audit of what the app really stores. Added to `SUMMARY.md`.
- [x] `docs/arsenal-gap-map.md` — every Build Arsenal and Flowtick item with its status per repo, an explicit "not applicable, with the reason" list, and the open decisions.
- [x] `docs/audits/2026-10-01-*.md` — five report-only audits: Git readiness, code review, security review, accessibility review, design review.
- [x] `TEMPLATE.md` §5 — "From the Build Arsenal": which files to copy, what to adapt per profile, and which Flowtick items to drop.
- [x] `AGENTS.md` — Source of truth list, Flowtick collaboration rules, and the conventional-commit/staging rule. `CONTRIBUTING.md` gained the Git discipline for outside contributors.
- [x] Draft 04 below, from the Git-readiness audit.

## Next

- [x] Push the v0 documentation and get CI green on GitHub.
- [ ] Publish the built book so it can be read in a browser — see [draft 01](docs/issue-drafts/01-publish-book-to-github-pages.md).
- [ ] **Blocked on the deployment:** record the real contract id and explorer links here once the contract is deployed — only real values, never invented ones. This is the maintainer's step, not contributor work, so it deliberately has no issue draft.

## Blocked on a real pilot

These wait for facts that do not exist yet:

- [ ] The first `pilots/{name}.md`, written after a real pilot from what actually happened, including what did not work. No draft: it cannot be written from anything but a real pilot.
- [ ] Update `limitations.md` and `threat-model.md` with anything the pilot revealed. No draft, for the same reason.
- [ ] Publish the participant-facing flow (how a parent pays, how a school records a fee, and how a wallet is set up) — the app now exists, so every step can be written against it, but claims about real usage still wait for a pilot — see [draft 02](docs/issue-drafts/02-app-and-pilot-documentation.md).

## Blocked on a legal review

These need a qualified person, not a contributor, so they deliberately have no
issue draft. They are listed in full under "Decisions needed from Tim" in
[`docs/arsenal-gap-map.md`](docs/arsenal-gap-map.md) §9.

- [ ] Review [`src/legal-compliance.md`](src/legal-compliance.md): is a privacy notice required at all, who is the controller, what is the lawful basis, and is a hash of a school-internal student id personal data where the school holds the mapping? (`TODO(legal review)`)
- [ ] Decide whether a pilot school needs a written data arrangement before the first deployment, and who may be named in the pilot record. (`TODO(legal review)`)
- [ ] Decide whether the wallet kit's own `localStorage` keys and its remote wallet-icon requests need to be disclosed, and whether a privacy contact must be published. Nothing is invented in the meantime. (`TODO(legal review)`)

## Later

- [ ] A docs freshness check: a command that verifies the file, function and test names cited in this book still exist in the two code repos (no coverage number is set yet on purpose) — see [draft 03](docs/issue-drafts/03-docs-freshness-check.md).
- [ ] Close the `.gitignore` gaps found by the Git-readiness audit — see [draft 04](docs/issue-drafts/04-docs-gitignore-hygiene.md).

## Explicitly out of scope

Mainnet deployment, investor or fundraising material, and any page that
describes a feature the code does not have.
