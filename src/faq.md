# FAQ

Short answers, each one checkable against the code. Where a question is about an
error the contract can return, the wording is quoted from `ERRORS.md` in
`schoolfees-contracts`, which is the single source of truth for user-facing
messages.

## Is this live? Can I use it?

No. The contract is implemented and its tests pass, but nothing is deployed —
there is no contract address on testnet yet. Deployment waits until a real school
or tutorial centre has agreed to try the flow (see the
[pilot playbook](pilot-playbook.md)). No pilot has happened.

## Where is the app?

It is implemented and its pure logic is unit tested, but it has **never run
against a deployed contract or a real wallet**. You can run it locally (see the
[quickstart](quickstart.md)), and without a deployed contract it only shows a
configuration notice. No pilot has used it. [Proven vs
assumed](proven-vs-assumed.md) lists exactly what is unverified.

## Does `schoolfees` hold my money?

No. There is **no custody**. When a payer pays, the token contract moves the
tokens directly from the payer's balance to the school's balance in the same
transaction. When the school refunds, the tokens move from the school's own
balance back to the payer. The fee contract records the obligation and its
history; it never holds a balance. Because it is not meant to hold funds, there
is no function to sweep tokens that someone sends to the contract address
directly — those are unrecoverable.

## Are student names or phone numbers on-chain?

No, and they must never be. The only free-form field is the opaque 32-byte
reference. The contract cannot verify what a caller puts there, so keeping it
opaque is a client responsibility. Opaque means something like a hash of the
school's own internal id. Addresses are public keys and therefore public; amounts
and due dates are public too, so fee records are transparent. See
[limitations](limitations.md) for the honest version of this.

## Who is allowed to create a fee?

Any address. There is no school registry and no administrator approval in v0.
The contract only requires that the address creating the fee signs the
transaction, so a fee is recorded against whatever school address signed it.
This is a deliberate v0 default: a registry would add administrator powers the
initial design did not ask for.

## Can anyone change a fee after it is created?

No. There is no update or cancel function. A fee's school, token, reference,
total and due date are fixed once created. The only things that can change are
its payment and refund totals, and the one-way `closed` flag.

## Why can't I close a partially paid fee?

Because "closed" means *settled*. The contract allows closing only when nothing
is owed or nothing was paid. If a fee has some money on it, the school refunds
those payments down to zero first. Trying to close early returns:
"This fee still has part of a payment on it. Refund the remaining payments
before closing."

## Can I pay after the due date?

Yes. Overdue is informative, not a lock. `status` reports `Overdue` after the due
date while a balance remains, and a payment after that is accepted and can still
move the fee to `Paid`.

## What happens if I overpay, or pay zero?

Overpaying the amount still owed returns `Overpayment`: "That is more than the
amount still owed." A zero or negative amount returns `InvalidAmount`: "Enter an
amount greater than zero."

## What is a "reference"?

An opaque 32-byte value the school supplies so it can match the on-chain fee to
its own records without exposing those records. One fee per `(school,
reference)` is allowed, forever; reusing the pair returns `DuplicateReference`:
"A fee with this reference already exists for this school."

## Why did the fee I created a while ago disappear?

Soroban entries have a time to live (TTL). Every record here is topped up toward
its due date plus a 30-day settlement margin, with a 7-day floor. A fee that is
never touched again can archive after roughly `due_at + 30 days`. v0 has no
restore user interface, so recovering an archived entry is a manual step today.

## Is there an audit?

No. There has been no independent review of the contract. Do not route real
money through it.

## Could this run on mainnet?

Not now, and not as a goal of this plan. It is testnet only. Before anything
could handle funds beyond a small testnet pilot, it would need an independent
review — see [limitations](limitations.md).

## How can I contribute?

See [CONTRIBUTING.md](https://github.com/stellar-schoolfees/schoolfees-docs/blob/main/CONTRIBUTING.md).
Unimplemented ideas are recorded in `ROADMAP.md` and as drafts under
`docs/issue-drafts/`, and are not yet GitHub issues.
