# Todo: verify

Everything in the three repositories that nobody has been able to verify yet,
in one place. Line numbers are from the handoff audit commit.

Two kinds of entry are collected here:

1. **`TODO(verify)` markers** in the code or docs — the literal words, found by
   searching all three repositories.
2. **Documented assumptions** — statements that say a thing has never been
   exercised. These do not all use the letters `TODO(verify)`, but they are the
   same kind of debt, and the app's README and this book's
   [proven vs assumed](proven-vs-assumed.md) page are their source.

Anything blocked on deployment cannot be settled until a real school or tutorial
centre agrees to a pilot and the maintainer deploys. That is the pilot gate, and
no amount of local work can remove those items.

## The literal `TODO(verify)` markers

| What is unverified | Where | How to verify | Blocked on deployment? |
|---|---|---|---|
| A contract error code that is **not** in `ERRORS.md` gets a generic message naming the code (`"Something went wrong (contract error code N). Please report this."`) instead of reviewed wording. The branch exists but has never run. | `schoolfees-app/src/lib/contractErrors.ts:143` | Trigger a real host failure on a deployed contract, or add a new code to `ERRORS.md` in `schoolfees-contracts`, re-copy `docs/contract-errors.md`, and confirm the message. Then decide whether to keep or replace the branch. | **Yes** — needs a deployed contract. |
| The maintainer's Stellar CLI is **27.1.0**, while CI pins and uses **v28.1.0**; whether the two behave identically for `stellar contract build` is unproven. | `schoolfees-contracts/AGENTS.md` (Toolchain, "Stellar CLI" bullet) and `README.md` (Toolchain notes) | The maintainer upgrades the CLI to v28.1.0 (an agent must not install tools), then runs `stellar contract build` locally and compares the artifact and command behaviour with the `Build wasm` job in CI. | **No** — needs a local tool upgrade, not a deployment. |

## Assumptions recorded in the app

Source: the "Assumed — never exercised" section of `schoolfees-app/README.md`
(lines 126–141). Full evidence table on [proven vs assumed](proven-vs-assumed.md).

| What is unverified | Where | How to verify | Blocked on deployment? |
|---|---|---|---|
| Every RPC call: build → simulate → assemble → submit → poll. | `schoolfees-app/src/lib/contract.ts` | Run one complete flow against a deployed contract on testnet (or a local network, which needs Docker and a human). | **Yes** |
| A wallet connects, reports testnet, and signs. | `schoolfees-app/src/lib/wallet.ts` | Connect a real wallet on testnet and sign one transaction. | **Yes** |
| Transaction submission and polling, including the archived-record refusal. | `schoolfees-app/src/lib/contract.ts` | Same as the first row; the refusal needs an archived entry to simulate a restore. | **Yes** |
| Host error strings are parsed as `Error(Contract, #N)`. | `schoolfees-app/src/lib/contractErrors.ts` (regex) | Submit a transaction that fails with a contract error and read the real RPC message. | **Yes** |
| The `status()` return value decodes as a unit-variant enum. The app reads it defensively (string, single-element vec, or object) and shows `Unknown` for anything unrecognised, which is honest but untested. | `schoolfees-app/src/lib/scval.ts` | Call `status(fee_id)` against a deployed contract and compare with the return of `get_fee`. | **Yes** |
| The pages are accessible: labels and landmarks are in the markup, and an automated axe-core check now runs over every rendered component and page (2026-10-01), but no screen-reader or keyboard audit has been done. | `schoolfees-app/README.md` (line 137) | The manual screen-reader and keyboard audit — draft `07-component-and-accessibility-tests.md`. | **No** |
| Components and pages have render tests (2026-10-01, app commits `25958ab`/`ca27a2b`), but no browser runs in CI. A local dev-server smoke test was done once during development, with a placeholder contract id. | `schoolfees-app/README.md` (line 140), `.github/workflows/web.yml` | A CI browser job — draft `07-component-and-accessibility-tests.md`. | **No** |

## Assumptions recorded in the contract

| What is unverified | Where | How to verify | Blocked on deployment? |
|---|---|---|---|
| `fee.paid_total` always equals the sum of per-payer `paid` records (and likewise for refunds). It holds by construction — `src/fee.rs::pay` and `::refund` write both in one call — but no aggregate or property-based test checks it under arbitrary sequences. | `schoolfees-docs/src/architecture.md` §7; draft `06-property-based-invariants.md` | Property-based tests over random call sequences, then a fuzz run. | **No** |
| The test-code-size floor ("at least as large as implementation code") is counted by hand. | `schoolfees-docs/src/architecture.md` §7; `schoolfees-contracts/AGENTS.md` | Add the coverage gate — draft `08-coverage-gate.md`. | **No** |
| The wasm that CI builds with CLI v28.1.0 is the same shape as the one this machine built with 27.1.0 (13,794 bytes). | `schoolfees-contracts` build output, not committed | See the CLI row above: compare after the local upgrade. | **No** |

## Assumptions recorded in the docs

| What is unverified | Where | How to verify | Blocked on deployment? |
|---|---|---|---|
| `mdbook build` has never run on the maintainer's machine — mdBook is deliberately not installed. The book build is proven by CI only. | `.github/workflows/docs.yml`; `AGENTS.md` (Tooling) | Read the "Build the book" step in the Docs workflow, or install mdBook (a human step) and run `mdbook build`. | **No** |
| The file, function and test names cited across this book still exist in the two code repos. | `src/architecture.md`, `src/proven-vs-assumed.md` | Add the freshness check — draft `03-docs-freshness-check.md`. | **No** |
| The error wording quoted in the [FAQ](faq.md) matches `ERRORS.md`. It was checked by hand at the handoff audit; only the app's copy is checked automatically. | `src/faq.md` | Extend the app-style comparison so the book's quotes are checked too, or quote by reference instead of by copy. | **No** |

## The word `TODO(verify)` elsewhere is a rule, not an item

The three `AGENTS.md` files and the contributing guides tell contributors to
write `TODO(verify)` when they cannot check something. Those mentions
(`schoolfees-contracts/AGENTS.md:139`, `schoolfees-docs/AGENTS.md:30` and `:38`,
`schoolfees-app/AGENTS.md:22` and `:47`) are instructions, not open items, and
are listed here only so that this page accounts for every occurrence.

## Keeping this page honest

- A new `TODO(verify)` goes on this page in the same commit that adds it.
- A resolved item is **deleted**, not ticked — this page is a worklist, not a
  history.
- The [proven vs assumed](proven-vs-assumed.md) table is the other half: claims
  that *do* have evidence.
