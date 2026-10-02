# Known Limitations

This page states what `schoolfees` has **not** proven and what it does **not**
do. It is deliberately blunt. If a claim is not on this page or in the
[architecture](architecture.md), assume it is not established.

## Network scope

- **Testnet only. No mainnet deployment, ever, in this plan.** Testnet tokens
  have no value and the test network can be reset, which would erase every
  record.
- **Nothing is deployed.** There is no contract address, on any network, to try
  today. Deployment waits for a real school or tutorial centre to agree to try
  the flow (see the [pilot playbook](pilot-playbook.md)).
- **No independent review or audit.** Nobody outside the project has reviewed
  the contract. Do not route real money through it.
- The contract has **no upgrade path and no pause**. A deployed instance keeps
  exactly the behaviour described in [architecture](architecture.md); the only
  way to change it is to deploy a new instance.

## What is not enforced on-chain

These are things a reader might assume the contract checks, and it does not:

- **Who a payer is.** The contract sees an address with a signature; it cannot
  tell whether that address is a parent, a guardian, a student, or the school
  itself. A school may pay its own fee.
- **Who a school is.** **Any address can create a fee.** There is no school
  registry and no administrator approval, so nothing stops an address that is
  not a school from creating a record. A payer who does not verify the school's
  real address out of band could pay the wrong address, and the contract cannot
  reverse that.
- **That a reference means anything.** The reference is opaque bytes. The
  contract cannot check that it is a hash, that it is unique in the school's own
  records, or that it does not contain personal data. Keeping it opaque is a
  client responsibility, not a contract guarantee.
- **The quality or value of the token.** The school picks any SEP-41 token and
  there is no whitelist. A fee can be denominated in a token that is worthless,
  or that the school cannot transfer back. A broken or unfunded token only shows
  up as a failed transfer at pay or refund time, and that failure surfaces as a
  host error, not as one of the codes in `ERRORS.md`.
- **That a refund will succeed, or happen at all.** A refund is a voluntary
  decision by the school, drawn from the school's own balance. If the school has
  spent those tokens, the transfer fails. The contract caps what may be
  refunded; it cannot compel a refund.
- **Enforced installment schedules, late fees, per-payer limits, sibling or
  bundle discounts.** None of these exist in v0. A payer can pay any number of
  times, in any amounts, up to the total. These are recorded in `ROADMAP.md` and
  as drafts under `docs/issue-drafts/` in `schoolfees-contracts`.
- **A refund policy.** Whether a part-payment should be returned, and on what
  grounds, is a decision the school makes off-chain. The contract only enforces
  the arithmetic cap.
- **Privacy of amounts.** Fee records are public: the school and payer
  addresses, the total, the due date, and every payment and refund are all
  readable by anyone. Only the reference is opaque, and only because the client
  chose to make it so.

## Not yet handled

- **There is no deployed contract, so the app cannot be used end to end.**
  `schoolfees-app` is implemented and its pure logic is unit tested, but it has
  never run against a deployed contract or a real wallet: every RPC call, the
  wallet connection, transaction submission and error parsing are unverified on
  a real network. Until a real contract id exists it shows a configuration
  notice. See [proven vs assumed](proven-vs-assumed.md).
- **There is no way to list fees.** Every lookup is keyed by id or reference.
  There is no pagination and no on-chain index, so enumerating a school's fees
  means relying on an indexer that reads events — and an indexer is not part of
  this project.
- **A fee cannot be edited or cancelled.** Its school, token, reference, total
  and due date are fixed at creation. A fee created by mistake, or with a typo,
  stays on-chain; it can only be closed, never removed.
- **A duplicate reference blocks that pair forever.** One fee per `(school,
  reference)` is enforced permanently, with no deletion, so a reference claimed
  by mistake cannot be reused by that school.
- **Records can archive.** Each record is topped up toward its due date plus a
  30-day settlement margin, with a 7-day floor (`src/storage.rs` in
  `schoolfees-contracts`). A fee nobody writes to can archive after roughly
  `due_at + 30 days`: reads submitted as transactions extend a record, but the
  app's read screens only simulate, so browsing the app does not. v0 ships no
  restore user interface, so restoring an archived entry is a manual step today.
- **Spam is possible.** Because anyone can create fees, anyone can fill the
  contract with meaningless records. There is no rate limit, no fee, and no
  blocklist.
- **No property-based or fuzz testing** (draft
  `06-property-based-invariants.md`), no coverage gate, and no load or
  adversarial testing. The test suite checks the documented paths, not arbitrary
  input sequences.
- **No receipts, exports, reminders or translations.** Receipts and translations
  are drafts in `schoolfees-app`; reminders need a backend and a contact channel
  the project deliberately does not have, so they are out of scope. The app uses
  labelled, mobile-first, semantic markup, but no screen-reader or keyboard
  audit has been done, so accessibility is built in, not proven.

## Pilot evidence boundary

**No pilot has happened.** That means:

- Nothing here is evidence of **demand**: no school or centre has been recorded
  as agreeing to use it.
- Nothing here is evidence of **usability** or **real-world fit**: no parent or
  staff member has completed the flow.
- Nothing here is evidence of **behaviour under repeated use over months**, under
  load, or under adversarial input.
- Nothing published in `pilots/` at the time of writing exists; that directory
  deliberately contains only a note that no pilot has happened yet.

The first real evidence will be a pilot run with a real group, recorded
afterwards in `pilots/{name}.md` from the actual transactions. Even then, a
pilot is a small sample: an interested conversation is not a pilot, and an
agreement to try is not evidence that the flow works. The
[pilot playbook](pilot-playbook.md) says how that record will be written.

## Production boundary

Stated plainly: **an independent review is required before `schoolfees` handles
funds beyond a small testnet pilot.** It is testnet-only by design, it has not
been audited, and it does not hold custody precisely so that a failure cannot
strand a pool of money. None of that makes it safe for real fees, and nothing in
this book should be read as claiming otherwise.
