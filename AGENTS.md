# AGENTS.md

Rules for any AI agent working in this repository (`schoolfees-docs`). Read this file at the start of every task.

## Project context
`schoolfees` is a Stellar/Soroban project with three repos: `schoolfees-contracts` (Rust contract), `schoolfees-app` (small web app) and `schoolfees-docs` (this repo, an mdBook). It is built by one person, will be public and open to outside contributors. Testnet only. Readers include school or tutorial centre staff and parents, who are not developers.

**Never put student names, phone numbers, or IDs on-chain. Opaque references or hashes only.**

**Pilot rule:** no schoolfees contract is deployed until a real school or tutorial centre has agreed to try it. No pilot has happened until the human says so and provides the facts.

## Source of truth

Read these before changing anything, in this order:

1. `src/SUMMARY.md` — what the book contains. Anything in it must live under `src/` or mdBook
   will not build it.
2. `src/architecture.md` — the single description of the system; every claim points at a file,
   function or test in a code repo.
3. `src/prd.md` — what the product is, from what exists.
4. `src/limitations.md` — what is not proven and not handled.
5. `src/threat-model.md` — the STRIDE walk-through, and the single source of threats.
6. `src/legal-compliance.md` — the privacy and legal checklist, marked *not legal advice*.
7. `src/proven-vs-assumed.md` — every claim with its evidence, or the word "assumed".
8. `src/pilot-readiness.md` and `src/pilot-playbook.md` — the gate and how a pilot is run.
9. `src/todo-verify.md` — every open `TODO(verify)`. A new one goes on this page in the same
   commit that adds it.
10. `TEMPLATE.md` — what to copy into a new project, and what to change.

When a page would restate something another repo or page already says, link to it instead.

## Collaboration rules

- **Lead with the result or the next action.** Say what happened or what you need first;
  detail comes after.
- **Call out incorrect assumptions plainly.** If a premise in the task is wrong, say so in one
  sentence and continue with what is true.
- **Ask before anything destructive, legal, security-related, payment-related or
  irreversible.** Legal wording, a privacy contact, student-data policy and anything touching
  deployment or keys are exactly this kind of decision: never guess, record the question for
  the human and carry on with the rest.
- **Honest completion report.** Before saying done, state what you tested, what you did **not**
  test, and any defect you found. "It works" without evidence is a liability, not a signal.
- Do not invent requirements, and do not add scope beyond the task.

## Tooling
- mdBook (`book.toml`, `src/SUMMARY.md`). mdbook is NOT installed locally; the mdbook build is verified by CI only. Do not install it.
- Local check: a dependency-free Node link checker (`scripts/check-links.mjs`) that verifies every `SUMMARY.md` entry exists and every relative link resolves.
- CI: `.github/workflows/docs.yml` runs the mdbook build and the link checker.

## Required documents
Every docs repo ships, at minimum:
- `architecture.md`: written only after the contract interface is stable, filled from the real code in `schoolfees-contracts`.
- `limitations.md`: what is not proven, not what sounds acceptable. Must cover testnet-only status, what the contract does not enforce, what is not handled, the pilot-evidence boundary, and the production boundary in plain words. An empty or vague limitations doc means it was not written carefully.
- `threat-model.md`: STRIDE walk-through, with honest "not applicable, because..." entries rather than skipped categories.
- `pilot-playbook.md`: written for a solo builder. No "we" or "the five of us" wording.
- `pilots/{name}.md`: one per REAL pilot only. Until then `pilots/` holds a note saying no pilot has happened yet.
- Plus `introduction.md`, `quickstart.md`, `faq.md`.

Do not invent extra "investor-style" documents (funding asks, hiring plans, competitive positioning) unless the human explicitly asks for one.

## Writing rules
- Describe only what the code does. Anything not built is marked "Not implemented yet".
- Every technical claim must point to something checkable: a file, function, test or command in `schoolfees-contracts` or `schoolfees-app`. If it cannot be pointed to, remove it or mark it `TODO(verify)`.
- Error wording: the "user-facing message" column of `ERRORS.md` in `schoolfees-contracts` is the single source of truth. Quote it, never paraphrase differently.
- Plain language first. Explain any Stellar or Soroban term the first time it appears.
- Never soften the pilot-evidence boundary or the production boundary.
- Never include personal data: no names, phone numbers, emails, student or member identifiers, or anything about children, even as examples. Use obviously fake placeholders like `ref_0001`.

## Truthfulness and evidence rules
- Never invent contract addresses, transaction hashes, users, testers, quotes, schools, or pilot outcomes. Evidence and pilot files are written only from data the human provides.
- Never invent function names, flags, or API details. If unsure, read developers.stellar.org. If you still cannot verify, write `TODO(verify)` and list it in your final summary.
- When using a real third-party project as inspiration for structure, never copy its name, branding, figures or claims. Cite the pattern, not the source's content.

## Safety rules
- Testnet only. Never mainnet.
- NEVER read, print, log, commit, or ask for secret keys, seed phrases or `.env` contents.
- Do NOT deploy, push, change git remotes, create GitHub issues, install tools, run `sudo`, or pipe downloads into a shell. Write files and stop; the human runs anything else.
- Do not add dependencies without saying why.

## Commit rules

- One logical change per commit. Never bundle unrelated changes.
- Never create empty or filler commits.
- Every commit must pass this repository's checks (the link checker and its tests locally; the mdBook build in CI).
- Conventional format: `type: imperative summary`, where `type` is one of `feat`, `fix`,
  `docs`, `chore`, `test`, `refactor`, `style` or `perf`.
- Subject line: 72 characters or fewer, in the imperative mood. No trailing period.
- Stage files by explicit name. **Never** `git add -A` or `git add .`.
- Run `git status` and read the staged diff (`git diff --staged`) before every commit. A new
  page goes into `src/SUMMARY.md` in the same commit, or the link checker fails.
- Never commit `.env` contents, key material, a secret, or a secret-looking string. If you see
  one in a diff, stop and say so.
- Do not rewrite history.
- Never add a "Generated with Codebuff" trailer or any co-author trailer to commit messages.

## Scope rules
- Build v0 docs only. Record anything unimplemented in `ROADMAP.md` and as drafts in `docs/issue-drafts/NN-title.md` (template below). Do not create issues on GitHub.
- Do not add scope beyond what the task asks.

## Issue draft template
    # Title (imperative, specific)
    **Difficulty:** easy | medium | hard
    **Labels:** good first issue | help wanted | area:<contracts|app|docs|ci>
    ## Problem
    What is missing or wrong, and why it matters.
    ## Scope
    What to change. What is explicitly out of scope.
    ## Acceptance criteria
    - [ ] Checkable statements (tests pass, docs updated, behavior X).
    ## Where to start
    Files or documents, and the docs to read.
    ## How to test
    Exact commands.
