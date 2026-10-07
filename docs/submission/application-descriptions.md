# Draft application descriptions

Record the final published commit before submitting; local validation describes
the source snapshots in `validation.md`. These are
product descriptions, not claims of deployment, adoption, audit or acceptance.

## SchoolFees contracts

SchoolFees is a Stellar/Soroban testnet contract for school fee collection with
partial payments, payer-level refunds and receipt accounting. It uses opaque
references instead of student identities and moves tokens directly between the
payer and school. Its contribution opportunities focus on payment invariants,
record lifetime maintenance and test coverage. No live school pilot is claimed.
Setup and contract entrypoints: `stellar-schoolfees/schoolfees-contracts/README.md`.
Local validation: 34 Rust tests and 9 checker tests; formatting, clippy,
error synchronization and Wasm build passed. Source identity: `validation.md`.
Enter the final published commit before submitting.

## EventBadges contracts

EventBadges is a Stellar/Soroban testnet attendance credential contract for event
organizers and attendees. Organizer awards and attendee claim tickets lead to
nontransferable attendance records that others can verify. This addresses event
attendance rather than invoices or fee payments. Contributor work includes
bounded batch awards, privacy-conscious metadata and cross-event pagination.
No live event pilot is claimed.
Setup: `stellar-eventbadges/eventbadges-contracts/README.md`.
Local validation: 35 Rust tests and 23 checker tests; formatting, clippy,
error/event synchronization and Wasm build passed. Source identity: `validation.md`.
Enter the final published commit before submitting.

## SchoolFees app

A React and TypeScript testnet wallet interface for the SchoolFees contract.
It presents school and payer workflows, plain-language contract errors and
transaction references. This window's changes focus on stale asynchronous
results, wallet races, reliable interaction states and accessibility. The app
supports the contract repository; submit separately only if permitted slots
and an independent frontend contribution case justify it. No live pilot claimed.
Setup: `stellar-schoolfees/schoolfees-app/README.md`.
Local validation: lint, type checking, all 168 tests and production build passed.
Source identity: `validation.md`. Enter the final published commit before submitting.

## EventBadges app

A React and TypeScript testnet wallet interface for organizers preparing claim
tickets, attendees claiming badges and users verifying attendance. This window
improves action concurrency, ticket retention and keyboard verification states.
Submit separately only if account slots permit and frontend work provides an
independent contributor opportunity. No live event or wallet outcome claimed.
Setup: `stellar-eventbadges/eventbadges-app/README.md`.
Local validation: lint, type checking, all 314 tests and production build passed.
Source identity: `validation.md`. Enter the final published commit before submitting.

## InvoicePay contracts - conditional

InvoicePay is a Stellar/Soroban testnet invoice contract for freelancers and
clients, with optional client restriction, partial payment, cancellation before
payment, payer-level refunds and receipts. Tokens transfer directly between the
parties. Its app remains incomplete and is excluded from this submission window.
Contributor work includes randomized accounting tests, record lifetime upkeep
and measured resource limits. No live invoice or client pilot is claimed.
Setup: `stellar-invoicepay/invoicepay-contracts/README.md`.
Local validation: 30 Rust tests and 9 checker tests; formatting, clippy,
error synchronization and Wasm build passed, including the new payer-index
retention regression. Source identity: `validation.md`. Enter the final published
commit before submitting; apply only if account slots permit.
