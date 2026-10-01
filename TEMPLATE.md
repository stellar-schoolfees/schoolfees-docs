# TEMPLATE.md — reusing the schoolfees layout

What to copy from `schoolfees` into a new Stellar/Soroban project, and what must
change. Written after the v0 handoff (2026-09-30) by reading the three real
repositories:

- `schoolfees-contracts` — Rust/Soroban contract.
- `schoolfees-docs` — mdBook documentation with two dependency-free checkers.
- `schoolfees-app` — Vite + React + TypeScript web app.

This file is instructions for a human or an agent starting a **new** project. It
has not been applied to any other project, and nothing here should be copied
into a project that already has these files.

## 1. What to copy

### 1.1 The repository set

Three repositories, one purpose each. The split matters: the contract is the
source of truth, the docs describe only what the code does, and the app is the
human entry point. Docs and app must never define behaviour the contract does
not have.

### 1.2 Per-repo skeleton, always

| File | Where | Notes |
|---|---|---|
| `AGENTS.md` | all three | The rulebook an agent reads first. Copy the section set; the content changes per project (see §2). |
| `README.md` | all three | Status banner first ("Status: v0 implemented, testnet only, not deployed …"), then what works, then honest limitations, with links to the other repos. |
| `CONTRIBUTING.md` | all three | Short orientation: rules, checks to run, where things belong, commit style. |
| `ROADMAP.md` | all three | Done sections, Next, blocked-on-real-users items, Later (each with a draft), Explicitly out of scope. |
| `LICENSE` | all three | Same holder and year in every repo. |
| `.gitignore` / `.gitattributes` | all three | `target/`, `node_modules/`, `.env`, `.stellar/`, `*.key`; `* text=auto eol=lf`. |
| `.github/workflows/` | one per repo | See §1.4. |
| `docs/issue-drafts/` | all three | `README.md` index + one `NN-title.md` per unimplemented item. |

### 1.3 Per-repo specifics

**Contract repo**

- `rust-toolchain.toml` pinning only the target (`wasm32v1-none`), with a
  comment explaining why the channel is not pinned.
- `Cargo.toml` with the release profile (`overflow-checks = true`,
  `panic = "abort"`, `lto = true`) and the SDK version.
- `src/` split: thin `lib.rs`; logic in its own module; `types.rs` for the error
  enum, stored types and events; `storage.rs` for keys and TTL helpers; one
  `error_paths.rs` test per error variant; `test.rs` for lifecycle tests;
  `test_helpers.rs`.
- `ERRORS.md` — one row per variant, with a "user-facing message" column that is
  the single source of truth for every other repo.
- `scripts/check-errors.mjs` + `check-errors.test.mjs` — keeps `ERRORS.md` and
  the error enum in sync, no dependencies.
- `docs/events.md`, `docs/decisions/`, `docs/design/`.
- `docs/SECURITY.md` — auth per function, no custody, token trust, input
  validation, TTL/archival risk, dependency review, out of scope.
- `docs/TESTING.md` — the real test layers with counts, and what is **not**
  tested.
- `docs/DEPLOYMENT_CHECKLIST.md` — the release gate; first item is the pilot
  agreement, and it records key holders and the wasm hash.
- `docs/ARCHITECTURE.md` — a short module map and a pointer to the docs repo's
  architecture page. Never a second copy of it.
- `scripts/deploy-testnet.sh`, gated so an agent never runs it.

**Docs repo**

- `book.toml`, `src/SUMMARY.md`.
- Core pages: `introduction.md`, `quickstart.md`, `architecture.md`,
  `limitations.md`, `threat-model.md`, `pilot-playbook.md`, `faq.md`, and
  `pilots/README.md` until a real pilot exists.
- Audit pages: `proven-vs-assumed.md`, `pilot-readiness.md`, `todo-verify.md`
  (templates of the three; see §1.5).
- `src/prd.md` — one page, written from what the code does, never from
  intention.
- `src/legal-compliance.md` — a privacy/legal checklist marked *not legal
  advice*, with every open question marked `TODO(legal review)`.
- `scripts/check-links.mjs` + `check-links.test.mjs` — verifies every relative
  link and every `SUMMARY.md` entry, no dependencies.
- `TEMPLATE.md` (this file), adapted.

**App repo**

- The scaffold decision recorded in `docs/decisions/` (evaluate Scaffold
  Stellar first; record why or why not).
- `src/config.ts` as the only place `.env` is read; `src/lib/` pure logic with a
  test next to each module; `src/hooks/`, `src/components/`, `src/pages/` for
  UI only.
- `.env.example` with placeholder values; `.env` never committed.
- `docs/contract-errors.md` — a vendored copy of the contract's error table so
  CI can check the mapping without checking out the other repo.
- `docs/SECURITY.md` — wallet rules, network safety, validation, RPC failure
  handling, duplicate submission, dependency review.
- `docs/TESTING.md` — what is unit tested, what is not, and the release smoke
  test.
- `docs/DESIGN_GUIDELINES.md` and `docs/ACCESSIBILITY.md` — direction, tokens,
  components, and the WCAG baseline with its honest gaps.
- `docs/DEPLOYMENT_CHECKLIST.md` — build, console, env, banner, states, and the
  hosting steps left to the human.
- `docs/PRODUCTION_QUALITY.md` — titles, metadata, favicon, 404, source maps,
  bundle, and what is deferred until a real domain exists.
- `docs/RESOURCES.md` — every dependency with version, purpose, licence and
  whether it ships, plus the real `npm audit` result.
- `vitest.config.ts`, strict tsconfigs, `.oxlintrc.json` (or the scaffold's
  linter), `scripts/deploy-testnet.sh` gated on `PILOT_CONFIRMED=yes`.

### 1.4 CI workflows

Copy the three workflows and change only the paths and step names they need.

- **`contract.yml`**: `cargo fmt --all --check`; `cargo test`;
  `cargo clippy --all-targets -- -D warnings`; `node --test`;
  `node scripts/check-errors.mjs`; `stellar contract build`. Pin the CLI with
  `stellar/stellar-cli@vX.Y.Z`.
- **`docs.yml`**: `node scripts/check-links.mjs`; `node --test`;
  `peaceiris/actions-mdbook@v2`; `mdbook build`.
- **`web.yml`**: `npm ci`; `npm run lint`; `npm run typecheck`; `npm test`;
  `npm run build`. Match the Node major to the scaffold's.

All three: `on: push` to `main` and `pull_request`, with a concurrency group
that cancels superseded runs.

### 1.5 Document templates worth copying wholesale

- The **issue-draft template** (in `AGENTS.md`): imperative title, Difficulty
  (easy/medium/hard), Labels (`good first issue` / `help wanted` /
  `area:…`), Problem, Scope, Acceptance criteria as checkboxes, Where to start,
  How to test.
- The **`limitations.md` shape**: network scope, what is not enforced on-chain,
  what is not handled, pilot-evidence boundary, production boundary.
- The **threat-model shape**: assets, adversaries, a STRIDE walk-through with
  genuine "not applicable, because…" entries, and out-of-scope.
- **`proven-vs-assumed.md`**: a three-status table (tested in CI / tested
  locally only / assumed) with the test or command for every claim.
- **`pilot-readiness.md`**: numbered sections (agreement, keys, token and
  funding, wallet and network, deployment, off-chain data, walk-through, stop
  conditions, after the pilot), every item marked Done or Not done.
- **`todo-verify.md`**: literal `TODO(verify)` markers and documented
  assumptions, each with where it appears, how to verify it, and whether it is
  blocked on deployment.

### 1.6 Rules that carry over unchanged

- Testnet only; no mainnet. Never invent addresses, hashes, users, quotes or
  outcomes. Nothing unbuilt is described as built.
- No secret keys, seed phrases or `.env` contents are ever read, logged or
  committed.
- Agents do not deploy, push, change remotes, create issues, install tools or
  run `sudo`; they write scripts and the human runs them.
- No `Generated with …` or co-author trailers. Small commits, no history
  rewrite.
- One error-wording source of truth (the contract's `ERRORS.md`), quoted
  verbatim everywhere else.
- Every technical claim points at a file, function, test or command; otherwise
  it is marked `TODO(verify)` and listed.

## 2. What to change per project

| Thing | Change it how |
|---|---|
| **Names and branding** | Replace every `schoolfees`, repo name and URL. Never copy another project's figures, names or claims — copy the structure only. |
| **Privacy rule** | Keep the shape and the force of "Never put student names, phone numbers, or IDs on-chain. Opaque references or hashes only." — but name the right nouns for the domain (members, patients, customers, guests). It must appear verbatim-identical in all three `AGENTS.md` files. |
| **Domain text** | Rewrite README, introduction and architecture around what *this* contract does. Do not reuse fee-specific wording for a non-fee domain. |
| **Error ranges** | Keep the `1–9` init/lookup, `10–29` lifecycle/timing, `30–49` validation ranges unless the new contract needs more, and update `AGENTS.md`, `ERRORS.md` and the checker together. |
| **Toolchain versions** | Re-check developers.stellar.org and the package registries on the day you start. Never copy version pins from another project — including this one. |
| **CI pins** | The CLI version in `contract.yml`, the Node version in `docs.yml`/`web.yml`, and any action versions. |
| **Checkers** | `check-errors.mjs` assumes ERRORS.md's table shape and the enum's numbering; adapt the regexes if the new table differs. `check-links.mjs` is generic and needs no change. |
| **App stack** | Follow the new project's scaffold decision. If Scaffold Stellar fits (fresh project with its own contracts workspace, tools available), prefer it; record the decision either way. |
| **Wallet and token choices** | Per project: which SEP-41 token the domain uses, and which wallet(s) the users are likely to have. |
| **Pilot gate** | Keep the mechanism — no deployment until a real user group agrees — but write the new project's own gate in its own words. |
| **Issue drafts** | Start empty. Each unimplemented item gets its own sized draft in the repo it belongs to, plus a ROADMAP entry. Do not copy this project's drafts. |
| **LICENSE holder/year** | The new owner and the year of first publication, identical in all three repos. |

## 3. What not to copy

- The schoolfees issue drafts, roadmap items, architecture claims, pilot files
  or any status sentence — they are true only of schoolfees.
- Any "implemented and tested" claim: a new repo's first commit is not tested.
  Start from "not implemented yet" and earn every claim.
- Investor-style documents, mainnet scripts, or tooling the project does not
  use.
- Version pins (see §2).

## 4. A sensible order

1. Contracts repo: skeleton, `AGENTS.md`, CI, the error enum with one row and
   one test per variant, then the errors checker. Only then the main logic,
   with `error_paths.rs` growing with it.
2. Docs repo: the checkers and CI first, then the architecture page from the real
   code — never from the plan.
3. App repo: record the stack decision, build `src/lib/` with tests against the
   contract's real ABI, then the pages.
4. The audit pages (`proven-vs-assumed`, `pilot-readiness`, `todo-verify`)
   **last**, from the finished state, not from intention.

Each repo keeps its own `ROADMAP.md` and `docs/issue-drafts/`, and the
`AGENTS.md` files stay in step as the project learns.

## 5. From the Build Arsenal

How `schoolfees` was measured against the Build Arsenal and the Flowtick
engineering playbook (2026-10-01), and what a new project should take from each.
The full per-item audit for `schoolfees` is
`docs/arsenal-gap-map.md` in this repository; it is **not** part of the book and
is not in `SUMMARY.md`.

### 5.1 Copy these files, then adapt them

| Source | Copy to | Adapt |
|---|---|---|
| `01-core-project-docs/AGENTS_TEMPLATE.md` | all three repos | Keep the section set: Source of truth, Collaboration rules, Build rules, Verification. Add the project's own privacy line, safety rules and truthfulness rules. |
| `01-core-project-docs/SECURITY_TEMPLATE.md` + `04-security-arsenal/SECURITY_CHECKLIST.md` + `CRYPTO_SECURITY.md` | `docs/SECURITY.md` in the contracts and app repos | Split by repo: the contract's auth/custody/token/TTL, the app's wallet/network/validation/RPC. Link the threat model, never duplicate it. |
| `01-core-project-docs/TESTING_TEMPLATE.md` | `docs/TESTING.md` in all three | Add real counts and names, and a "what is NOT tested" table. The not-tested half is the valuable half. |
| `01-core-project-docs/DEPLOYMENT_CHECKLIST_TEMPLATE.md` + `05-production-launch-arsenal/RELEASE_RUNBOOK.md` | `docs/DEPLOYMENT_CHECKLIST.md` in the code repos | Put the real gate first (a pilot agreement, or whatever the project's gate is), then artefact, keys, rollback, smoke test. |
| `01-core-project-docs/DESIGN_GUIDELINES_TEMPLATE.md` + `03-design-system/*` | `docs/DESIGN_GUIDELINES.md` in the app repo | Trim to what the app actually uses; keep the "what to avoid" list and the known-deviations table. |
| `03-design-system/ACCESSIBILITY.md` + Flowtick §3 | `docs/ACCESSIBILITY.md` in the app repo | State the WCAG target, mark what is built-in versus audited, and list what a human must check by eye. |
| `01-core-project-docs/PRODUCTION_QUALITY_TEMPLATE.md` + `05-production-launch-arsenal/SEO_TEMPLATE.md` | `docs/PRODUCTION_QUALITY.md` in the app repo | Mark everything that needs a domain as **deferred**, and never invent a URL. |
| `01-core-project-docs/RESOURCES_TEMPLATE.md` | `docs/RESOURCES.md` in the app repo | Read licences from the **installed** packages; record the real audit result and any package with no declared licence. |
| `01-core-project-docs/PRD_TEMPLATE.md` | `src/prd.md` in the docs repo | Write it from what exists, with no invented numbers or users. |
| `01-core-project-docs/LEGAL_COMPLIANCE_TEMPLATE.md` | `src/legal-compliance.md` in the docs repo | Mark it *not legal advice*, audit what the app really stores, and label every open question `TODO(legal review)`. |
| `01-core-project-docs/ARCHITECTURE_TEMPLATE.md` | `docs/ARCHITECTURE.md` in the code repos | A module map plus a link to the one real architecture page. Never a second copy. |
| Flowtick §1 (Git discipline) | each `CONTRIBUTING.md`, and the commit rules in each `AGENTS.md` | Explicit staging, a staged-diff read, a secret scan and conventional commits with a 72-character subject. |
| Flowtick §6 (Scoping and process) | each `AGENTS.md` (Collaboration rules) | Lead with the result, call out wrong assumptions plainly, ask before high-stakes changes, report honestly what was and was not tested. |
| `04-security-arsenal/THREAT_MODEL_TEMPLATE.md` | `src/threat-model.md` in the docs repo | Keep the STRIDE walk-through with genuine "not applicable, because…" entries. |

### 5.2 Adapt per project profile

The Build Arsenal's project profiles change what "done" means. For a new project
pick exactly one primary profile and add the privacy profile of the domain.

| Profile | What it adds on top of the core docs |
|---|---|
| **crypto** (risk: HIGH — applied here) | Wallet connection and chain detection, address/contract-id validation, **the network shown before signing**, rejected/cancelled signature handling, bounded RPC retries and timeouts, duplicate-transaction prevention, no key material in the client, a testnet/production separation that is enforced in code. |
| **education-platform** (applied here for student data) | A student-data privacy rule stated verbatim in every `AGENTS.md`, an opaque-reference-only rule on-chain, a legal checklist page, and accessibility treated as a requirement rather than a nicety. Roles, progress and content permissions are **only** copied if the project really has them — `schoolfees` has none and says so. |
| **ai-app**, **saas**, **ecommerce**, **marketplace**, **dashboard**, **landing-page**, **portfolio**, **mobile-app**, **enterprise** | Ignored for `schoolfees`. Take them only if the new project is genuinely that shape: an AI app needs `04-security-arsenal/AI_SECURITY.md`; a SaaS needs sessions, rate limits and backup restore; an ecommerce app needs payments, uploads and duplicate-prevention; an enterprise app needs the strictest of everything. |

### 5.3 What to drop from Flowtick

Flowtick was written from a React + Vite + `localStorage` todo app deployed on
Vercel. These parts do not transfer to a testnet-only contract project, and are
dropped **with a stated reason** rather than silently:

| Flowtick item | Why it is dropped here |
|---|---|
| §2 "Persistence layer": guarded parse, versioned storage keys, `crypto.randomUUID()`, app-prefixed keys | The app persists nothing of its own. Where a project does persist, keep these rules verbatim. |
| §2 "Empty states per filter" | There are no lists or filters. Keep the rule for the day one is added. |
| §4 "Routing and metadata": hand-rolled `popstate` router, `AppLink`, per-view `usePageTitle` | There is no router. Rather than invent one, the project records "every view is a URL" as a **gap with a draft**. A new project that needs deep links should just use React Router / the framework's router. |
| §4 "Host-side requirement": SPA rewrites, server 404 status codes | There are no client routes and nothing is deployed. It becomes required the moment routing exists. |
| §5 "Deploy and QA" as written for Vercel/Netlify | Deployment is a human step behind a pilot gate; the *verification* half (curl the real routes, clear storage, mobile viewport, live smoke test) is kept and rewritten for a static bundle. |
| §2 "Node/Python backend equivalent" (validated payloads, database keys, invalidation) | There is no backend or database. The on-chain equivalent is input validation, a monotonic id and a typed error on a missing record. |
| Anything requiring a dependency: Motion/GSAP, component libraries, Playwright, analytics | The project forbids analytics, trackers and third-party scripts, and adds dependencies only with a stated reason. Browser automation stays a *draft*, not an assumption. |
| Flowtick's own examples, wording and figures | Never copied. Only the principle is reused, restated for a Soroban contract, a static testnet app and an mdBook. |

### 5.4 The parts worth keeping everywhere

Regardless of stack, three things from the two sources carried most of the value
here and should be copied into every project:

1. **"What is NOT tested" as a first-class document.** A suite that states its
gaps is more trustworthy than one that does not. Flowtick's "tested / not
tested" completion report and the `proven-vs-assumed` table are the same idea.
2. **A deferral discipline.** A missing domain, contact or legal answer is
recorded as `TODO(verify)` / `TODO(legal review)` with an owner — never filled
with an invented value.
3. **A release gate with a named first item.** "Pilot agreement in hand" or its
equivalent turns "ready" from a feeling into a checklist.
