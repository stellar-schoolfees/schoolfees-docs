# schoolfees Architecture

This page describes the v0 fee lifecycle exactly as implemented in
[`schoolfees-contracts`](https://github.com/stellar-schoolfees/schoolfees-contracts).
Every claim points at a real file, function or test. Paths such as
`src/fee.rs` are relative to that repository, not to this book. Anything not
implemented is marked **Not implemented yet**.

## 1. System position

`schoolfees` is a fee-recording contract on Stellar's testnet, written in Rust
for Soroban. It records one obligation (a *fee*) and its payment and refund
history against an opaque reference. It depends on three things and owns
nothing else:

- **The Stellar network**, for consensus, the ledger clock
  (`env.ledger().timestamp()`, used in `src/fee.rs::create_fee` and
  `src/fee.rs::status`) and storage archival.
- **A SEP-41 token contract**, chosen by the school at fee creation. In tests
  this is a real Stellar Asset Contract registered with
  `env.register_stellar_asset_contract_v2` (`src/test_helpers.rs::setup_token`).
  The contract calls it through `soroban_sdk::token::TokenClient` in
  `src/fee.rs::pay` and `src/fee.rs::refund`.
- **A wallet**, to sign transactions. The contract only ever calls
  `Address::require_auth` (`create_fee`, `pay`, `close_fee`, `refund` in
  `src/fee.rs`); it holds no keys.

It is **not** a payment processor, a custodian, an escrow, or a school registry.
It never holds a token balance: every movement of value is a direct transfer
between the payer's and the school's balances, executed by the token contract.

The contract target is `wasm32v1-none`, built with `soroban-sdk = "28"` and a
release profile that sets `overflow-checks = true`, `panic = "abort"` and
`lto = true` (`Cargo.toml`).

## 2. Runtime topology

| Where | What runs | Status |
|---|---|---|
| Stellar testnet | The `schoolfees` contract (`src/lib.rs`), its own persistent and instance storage | Implemented; **not deployed** |
| Stellar testnet | The SEP-41 token contract the school chose | External, owned by the network/issuer |
| The user's browser | The web app (`schoolfees-app`): wallet flow, error mapping | **Not implemented yet** |
| A keeper, indexer or backend service | — | **Does not exist**, and is out of scope |

There is no server, no database and no off-chain component in v0. Anyone who
wants fee data reads it from the contract (`get_fee`, `status`) or from the
events in `docs/events.md`.

## 3. Core protocol objects

Three stored types live in `src/types.rs`, and the storage keys that address them
are in `src/storage.rs`.

### `Fee` — persistent, key `DataKey::Fee(u64)`

| Field | Type | Meaning |
|---|---|---|
| `id` | `u64` | Fee id. First id is 1 (`src/fee.rs::create_fee` falls back to `1` when `DataKey::NextFeeId` is absent). |
| `school` | `Address` | Created the fee; receives payments. |
| `token` | `Address` | The SEP-41 token the fee is denominated in. |
| `reference` | `BytesN<32>` | Opaque 32-byte reference. Never personal data. |
| `total` | `i128` | Amount owed. `create_fee` rejects `total <= 0`. |
| `due_at` | `u64` | Due date in Unix seconds, the same clock as `env.ledger().timestamp()`. |
| `paid_total` | `i128` | Sum of every payer's payments. |
| `refunded_total` | `i128` | Sum of every payer's refunds. |
| `closed` | `bool` | Set once by `close_fee`; terminal. |

Two values are **derived, never stored**: `net = paid_total - refunded_total`
(`src/fee.rs::net_paid`) and `remaining = total - net` (computed inline in
`src/fee.rs::pay`).

### `PayerRecord` — persistent, key `DataKey::Payer(u64, Address)`

| Field | Type | Meaning |
|---|---|---|
| `paid` | `i128` | Everything this payer paid into this fee. |
| `refunded` | `i128` | Everything this payer got back from it. |

### Reference index — persistent, key `DataKey::Reference(Address, BytesN<32>)`

Stores a `u64` fee id. Its only job is to enforce one fee per `(school,
reference)`, forever; `create_fee` checks it with `persistent().has(...)` and
returns `Error::DuplicateReference` when it is present.

### Instance storage — keys `DataKey::Admin`, `DataKey::NextFeeId`

`Admin` is written by `initialize` and read by `admin` (`src/lib.rs`).
`NextFeeId` is the only piece of instance state the fee lifecycle writes
(`src/fee.rs::create_fee`). No fee function reads `Admin`.

## 4. Lifecycle

`FeeStatus` (`src/types.rs`) has four values and is **derived on every read, never
stored**. The order of the checks matters, and it is exactly the body of
`src/fee.rs::status`:

| Order | Condition | Status |
|---:|---|---|
| 1 | `fee.closed` | `Closed` |
| 2 | `net >= total` | `Paid` |
| 3 | `now > due_at` | `Overdue` |
| 4 | otherwise | `Open` |

Transitions and who triggers them:

| Action | Function | Signature required | Effect |
|---|---|---|---|
| Record a fee | `create_fee` | The school's | New `Fee`, `Open`, id from the counter, reference index claimed |
| Pay | `pay` | The payer's | `payer.paid += amount`, `fee.paid_total += amount`, token transfer payer → school |
| Refund | `refund` | The school's | `payer.refunded += amount`, `fee.refunded_total += amount`, token transfer school → payer |
| Close | `close_fee` | The school's | `closed = true`, only when `net == 0` or `net == total` |

Because status is derived, `pay` can move a fee from `Open` or `Overdue` to
`Paid`, and `refund` can move it from `Paid` back to `Open` or `Overdue`.
`Closed` is terminal: `pay`, `refund` and a second `close_fee` on a closed fee
all return `Error::FeeClosed` (`src/error_paths.rs::error_path_fee_closed`).

`close_fee` deliberately refuses a partially paid fee with
`Error::CloseNotAllowed`; the school refunds those payments down to zero first.
Both allowed cases and the refusal are covered:
`src/test.rs::close_fee_with_nothing_paid_marks_it_closed`,
`src/test.rs::close_fee_after_full_payment_marks_it_closed`,
`src/test.rs::refund_returns_tokens_and_reopens_the_fee` and
`src/error_paths.rs::error_path_close_not_allowed`.

Payments after the due date are accepted (`src/fee.rs::pay` never compares the
clock); `src/test.rs::pay_after_due_date_is_allowed_and_status_becomes_overdue_then_paid`
covers exactly that.

## 5. Component responsibilities

### `schoolfees-contracts` — the contract

**Owns:** the fee record, per-payer records, the reference index, the fee-id
counter, per-record TTL extension, and four lifecycle events. It enforces the
authorization on each function, the amount rules (`total > 0`, `amount > 0`,
`amount <= remaining`, refund capped at what the payer paid), the due-date rule,
reference uniqueness, and the close rule.

**Does not own:** identity. It cannot tell whether an address is a real school,
whether a payer is a guardian, whether the reference is unique in the school's
own books (only that the *pair* is unused on-chain), or what a token is worth.
It does not move funds except by calling the token contract, and it cannot undo
a transaction.

**Shape:** `src/lib.rs` holds only `#[contract]`, `#[contractimpl]` and thin
delegating calls (`src/lib.rs::create_fee` calls `fee::create_fee`, and so on).
Logic, storage and checks live in `src/fee.rs`; types and events in
`src/types.rs`; keys, TTL constants and TTL helpers in `src/storage.rs`.

### `schoolfees-app` — **Not implemented yet**

When it exists it will own the wallet flow, turn a school's internal identifier
into an opaque reference before it reaches the chain, and map error codes from
`ERRORS.md` to user-facing messages. It is out of scope for v0.

### `schoolfees-docs` — this book

Owns the architecture, limitations, threat model and pilot record. It does not
define behaviour; the code does.

## 6. Trust boundaries

| Trust question | Who resolves it |
|---|---|
| Is this address really the school I intend to pay? | Nobody on-chain. The payer must verify the school address, token, reference and total out of band. `create_fee` only checks that the creating address signed. |
| Is this reference the fee I think it is? | Out of band. The contract treats `BytesN<32>` as opaque; opacity is a client responsibility (see the privacy note in `src/types.rs` and `AGENTS.md`). |
| Will the payment reach the school? | Yes, by construction: `pay` calls `TokenClient::transfer(payer, school, amount)` in the same transaction, or the whole call fails. |
| Can a school be refunded more than it received? | No. `refund` caps at `payer.paid - payer.refunded` (`Error::RefundExceedsPaid`) and always draws on the school's own balance. |
| Who can create a fee? | Any address. There is no registry and no admin check; `create_fee` calls no admin code path. |
| Can the administrator change fees? | No. `Admin` is recorded by `initialize` but **no fee function reads it**, so the admin has no power over the lifecycle in v0. |
| Can a third party act as a payer? | Only by signing with its own key (`payer.require_auth()`); there is no way to spend someone else's tokens without their signature. |

## 7. Design invariants

| Invariant | Where it holds | Where it is checked |
|---|---|---|
| `0 <= net <= total` after every successful call | `src/fee.rs`: amounts are validated before any write (`total > 0`, `amount > 0`, `amount <= remaining`, refund `<= paid - refunded`) | Indirectly through the error-path tests and the happy-path tests; there is **no property-based test yet** (see draft `06-property-based-invariants.md` in the contracts repo). |
| `fee.paid_total` equals the sum of payer `paid` values | `src/fee.rs::pay` updates both in the same call | Holds by construction; **no dedicated aggregate test yet**. |
| `fee.refunded_total` equals the sum of payer `refunded` values | `src/fee.rs::refund` updates both in the same call | Holds by construction; **no dedicated aggregate test yet**. |
| Every payer's `refunded <= paid` | `src/fee.rs::refund` cap | `src/error_paths.rs::error_path_refund_exceeds_paid`, `src/test.rs::refund_returns_tokens_and_reopens_the_fee` |
| `closed` implies `net` is `0` or `total` | `src/fee.rs::close_fee` | `src/test.rs::close_fee_with_nothing_paid_marks_it_closed`, `src/test.rs::close_fee_after_full_payment_marks_it_closed`, `src/error_paths.rs::error_path_close_not_allowed` |
| A closed fee never changes again | `closed` checked first in `pay`, `refund`, `close_fee` | `src/error_paths.rs::error_path_fee_closed` |
| Records outlive their deadline | `src/storage.rs::record_ttl_target` / `extend_record_ttl` | `src/test.rs::create_fee_extends_the_fee_and_reference_ttls`, `src/test.rs::pay_extends_the_payer_record_ttl`, `src/test.rs::get_fee_keeps_a_late_record_alive_with_the_floor_ttl` |
| Test code is at least as large as implementation code | Repository rule in `AGENTS.md`; in v0 the test modules are larger than the implementation modules | Checked by hand, not automated. |

Two invariants are guaranteed by the order of operations in a single function
rather than by a separate check, and one class of property (paid totals always
equal the sum of per-payer records under arbitrary sequences of calls) has no
automated proof. That gap is stated here rather than hidden.

## Related documentation

- [Known limitations](limitations.md) — what none of the above proves.
- [Threat model](threat-model.md) — STRIDE walk-through of these boundaries.
- `ERRORS.md` in `schoolfees-contracts` — every error code and its user-facing
  message, kept in sync with `src/types.rs` by `scripts/check-errors.mjs`.
- `docs/events.md` in `schoolfees-contracts` — event layouts and the tests that
  assert them.
- `docs/design/interface-v0.md` in `schoolfees-contracts` — the approved
  interface draft, including the defaults this page describes.
- `docs/decisions/0001-openzeppelin-and-token-dependencies.md` — why v0 uses
  `soroban_sdk::token` directly and no OpenZeppelin crates.
