# Product requirements — schoolfees (v0)

One page, written **after** the code, from what the code actually does. Every
claim here points at something checkable in
[`schoolfees-contracts`](https://github.com/stellar-schoolfees/schoolfees-contracts),
[`schoolfees-app`](https://github.com/stellar-schoolfees/schoolfees-app) or this
book. Nothing is aspirational, and no user number, quote, pilot, price or date
appears anywhere — none exists.

This is the retrospective version of the Build Arsenal PRD template. The
forward-looking version was the approved interface draft,
`docs/design/interface-v0.md` in the contracts repo.

## Product

**schoolfees** — record one school-fee obligation against an opaque reference on
Stellar's testnet, and settle it, with a record both sides can read.

**In one sentence:** a school records that a fee is owed; a payer pays it in
instalments straight to the school; anyone can read the record; nobody's name is
ever on the chain.

## Problem

A school-fee payment today is confirmed by a receipt, a bank transfer or a
screenshot. The school's record and the family's record can disagree, and neither
is independently checkable. Meanwhile, the obvious fix — putting the payment on
a public ledger — would put a child's name, or something that maps to it, on a
permanent public record.

So the problem has two halves: **make a fee record verifiable by both sides**,
and **do that without putting personal data on-chain**. This project exists to
see whether those two halves can be done together, on testnet, before anyone
tries it with real money.

## Users

| User | What they need | What the app gives them |
|---|---|---|
| **School or tutorial centre staff** (bursar, administrator) | record a fee that a family can verify; take part-payments; refund a payment; close a settled record | connect a wallet, create a fee against a reference only they understand, refund and close (`CreateFeePage`, `SchoolActionsPage`) |
| **A payer** (parent or guardian, or anyone paying on their behalf) | pay part or all of a fee and keep the receipt | look up the fee, see everything recorded, pay in instalments, get the transaction hash (`LookupFeePage`, `PayPage`) |
| **Anyone else** | check that a record says what they were told it says | read a fee and its derived status with no account and no wallet (`get_fee`, `status`) |

The users are not developers. Every user-facing word in the app is written for a
phone, in plain language, and the one technical field (the reference) carries a
plain-words warning next to it.

## v0 scope — what is built

Everything below exists and is described in [Architecture](architecture.md).
Nothing below is deployed.

**The contract** (`schoolfees-contracts`, testnet, Rust/Soroban):

1. `initialize(admin)` / `admin()` — one-time setup; the admin has no power over
   fees.
2. `create_fee(school, token, reference, total, due_at)` — one fee per
   `(school, reference)`, opaque 32-byte reference only.
3. `pay(fee_id, payer, amount)` — instalments, straight from the payer to the
   school; no custody.
4. `refund(fee_id, payer, amount)` — from the school's own balance, capped at
   what that payer still has paid.
5. `close_fee(fee_id)` — only when nothing is owed or nothing was paid.
6. `get_fee(fee_id)` / `status(fee_id)` — public reads; status derived, never
   stored.
7. Four lifecycle events, eleven error codes with reviewed wording, TTL extension
   from each fee's real deadline, no loops and no lists.
8. 34 tests, every error path exercised, CI green.

**The app** (`schoolfees-app`, Vite + React + TypeScript, static):

9. Five flows: Home/connect, create a fee, view a fee, pay, school actions.
10. Wallet-only signing — the app never asks for, receives or stores a key.
11. A visible TESTNET banner on every screen, and a refusal to operate on any
    other network.
12. Error wording taken from the contract's `ERRORS.md`, checked by a test.
13. Address, contract-id, amount, date and reference validation before anything
    is built; a transaction hash and explorer link after every action.
14. Mobile-first, labelled, keyboard-reachable markup; no analytics, no trackers,
    no backend.
15. 154 tests — 85 over the pure logic and 69 render tests with an automated
    accessibility check — and CI running lint, type-check, tests and the
    production build.

**The documentation** (this book): architecture, limitations, threat model,
pilot playbook, proven-vs-assumed, pilot readiness, todo-verify, and the pages
linked from [SUMMARY](SUMMARY.md).

## Out of scope for v0

Each of these is deliberate, and each is recorded with its reasoning in the
relevant `ROADMAP.md`.

- **Mainnet, ever, in this phase.** Testnet-only by rule.
- **Any backend, database, server or indexer.** The app is a static bundle; the
  contract is the only store.
- **Analytics, trackers, third-party scripts, cookies set by the app.**
- **A school registry, identity layer, allow-list or token whitelist.** Any
  address can create a fee; the payer verifies the school out of band.
- **An admin override, upgrade path, pause or migration.** The recorded admin has
  no power over fees.
- **Enforced instalment schedules, late fees, per-payer limits, sibling or bundle
  discounts, fee editing or cancellation, fee listing/pagination, receipts,
  reminders, translations.** In-progress drafts live in the app and contracts
  `docs/issue-drafts/`.
- **A restore flow for an archived record** (the app and the contract both say
  so, and both have drafts).
- **Legal or investor material**: no privacy policy, no terms, no cookie banner,
  no funding ask, no competitive positioning. See
  [Legal and privacy](legal-compliance.md) for why that page is a checklist for
  a human, not a promise.
- **A pilot.** No school or centre has agreed to try the flow yet, so there is
  nothing to report and no deployment.

## Definition of done for v0

- [x] The six contract functions behave as designed, with authorization on every
      function that acts for an address, and every error path tested.
- [x] The error table, the enum and the app's wording agree, checked
      automatically (`scripts/check-errors.mjs`, `contractErrors.test.ts`).
- [x] The app validates every input, refuses any non-testnet network, and shows
      the transaction hash after every action.
- [x] Lint, strict type-check, unit tests and the production build pass in CI on
      all three repositories.
- [x] The book states what is proven, what is assumed, and what is not
      implemented — and does not soften the pilot or production boundaries.
- [x] Nothing unbuilt is described as built; no address, hash, tester, school or
      outcome is invented.
- [ ] **Not done, and not v0's to do:** a testnet deployment. It waits for a real
      school or tutorial centre to agree to try the flow
      ([pilot readiness](pilot-readiness.md)).

## How this document stays honest

- If a claim here is not in [Architecture](architecture.md) with a file, function
  or test behind it, it does not belong on this page.
- Changes to scope go to `ROADMAP.md` and to a draft in `docs/issue-drafts/`,
  never silently into the code.
- No number appears on this page that is not a count produced by a real command,
  and the only counts here are test counts and error codes.
