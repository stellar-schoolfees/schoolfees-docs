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
- `scripts/deploy-testnet.sh`, gated so an agent never runs it.

**Docs repo**

- `book.toml`, `src/SUMMARY.md`.
- Core pages: `introduction.md`, `quickstart.md`, `architecture.md`,
  `limitations.md`, `threat-model.md`, `pilot-playbook.md`, `faq.md`, and
  `pilots/README.md` until a real pilot exists.
- Audit pages: `proven-vs-assumed.md`, `pilot-readiness.md`, `todo-verify.md`
  (templates of the three; see §1.5).
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
