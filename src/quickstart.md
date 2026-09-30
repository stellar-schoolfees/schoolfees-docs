# Quickstart

There is no deployed contract, so there is nothing to try on-chain yet. This
page shows what *does* work today: running the contract's checks, running the
app's checks (and seeing why the app cannot send anything yet), and reading the
intended fee flow in plain words.

## For developers: run the real checks

Everything below runs against the Rust contract in
[`schoolfees-contracts`](https://github.com/stellar-schoolfees/schoolfees-contracts).
It needs Rust and Node.js. It does **not** need a Stellar account, a wallet, or
any testnet funds.

```bash
git clone https://github.com/stellar-schoolfees/schoolfees-contracts.git
cd schoolfees-contracts

rustup target add wasm32v1-none   # the build target for Soroban contracts

cargo test                        # the contract's own tests
cargo clippy --all-targets -- -D warnings
cargo fmt --all --check
node --test                       # tests for the ERRORS.md checker script
node scripts/check-errors.mjs     # fails if ERRORS.md drifts from the code
stellar contract build            # produces a .wasm file
```

The same six checks run in CI on every push (`.github/workflows/contract.yml`).
If they are green in CI, the contract code, its error table and the build all
agree with each other.

You can also build **this book** if you have [mdBook](https://rust-lang.github.io/mdBook/)
installed (`cargo install mdbook`, then `mdbook serve` from this repository).
mdBook is not installed on the maintainer's machine on purpose; the book build
is verified by CI, and locally you can always run the link checker:

```bash
node scripts/check-links.mjs      # every page link and SUMMARY entry resolves
node --test                       # tests for the link checker
```

## For developers: run the app's checks

The web app in
[`schoolfees-app`](https://github.com/stellar-schoolfees/schoolfees-app) is
implemented, and its pure logic is unit tested. You can run those checks
today:

```bash
git clone https://github.com/stellar-schoolfees/schoolfees-app.git
cd schoolfees-app
npm install

npm run lint        # oxlint
npm run typecheck   # TypeScript, strict
npm test            # unit tests for the pure logic
npm run build       # production build
```

You can also start it with `npm run dev`, but **it cannot do anything end to
end yet**: there is no deployed contract, so the app has no real contract id to
use. Without one it shows its configuration notice and refuses to build any
transaction. Nothing in the app has ever run against a deployed contract or a
real wallet — the [proven vs assumed](proven-vs-assumed.md) page lists exactly
what is and is not verified.

## What the fee flow looks like

This is the flow the contract implements, and the calls the app builds for it.
The app has never run any of it against a deployed contract, so the flow is
described here, not demonstrated.

1. **The school records a fee.** It signs a transaction that stores: the school's
   address, the token the fee is in, an **opaque 32-byte reference** (never a
   name — see below), the total owed, and a due date. The contract returns a
   small integer **fee id** starting at 1.
2. **A payer pays.** Anyone with an address can pay part or all of the amount.
   The tokens move straight from the payer to the school's token balance; the
   contract records who paid and how much.
3. **Anyone can read the record.** `get_fee` returns the stored totals and
   `status` returns `Open`, `Paid`, `Overdue` or `Closed`.
4. **The school closes the fee** once nothing is owed or nothing was paid, or
   **refunds a payer** from its own balance, up to what that payer paid.

## About the reference

The reference is the only free-form piece of data the contract stores, and the
contract cannot check what is inside it. It must be **opaque** — for example a
hash the app computes from the school's own internal identifier. Never put a
name, phone number, email address, student or member id, or anything about a
child into it. In this book's examples the reference is an obviously fake
placeholder such as `ref_0001`; in the tests it is a synthetic 32-byte value
(`src/test_helpers.rs::synthetic_reference`).

## What you cannot do yet

- There is no deployed contract address, so there is nothing to call on testnet.
- The app implements the wallet flow, but with no contract deployed it cannot
  complete a single flow end to end. It also has no receipt export and no
  reminder.
- Deployment is gated: it waits until a real school or tutorial centre has
  agreed to try the flow. See the [pilot playbook](pilot-playbook.md).
