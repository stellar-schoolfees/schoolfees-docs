# Validation evidence

Local checks executed October 7, 2026, with Node 24.19.0, Cargo/Rust 1.98.1,
Soroban SDK 28.0.0 and Stellar CLI 28.1.0. These are worktree results, not an
acceptance, security audit, deployment or pilot claim.

| Repository | Checks executed successfully | Result |
|---|---|---|
| SchoolFees contracts | fmt; locked clippy with warnings denied; locked Rust tests; Node tests; canonical errors; Stellar Wasm build | 34 Rust tests, 9 Node tests, 11 errors; optimized Wasm 13,794 bytes |
| EventBadges contracts | fmt; locked clippy with warnings denied; locked Rust tests; Node tests; canonical errors/events; Stellar Wasm build | 35 Rust tests, 23 Node tests, 9 errors, 4 events/14 fields; optimized Wasm 14,171 bytes |
| InvoicePay contracts | fmt; locked clippy with warnings denied; locked Rust tests; Node tests; canonical errors; Stellar Wasm build | 30 Rust tests, 9 Node tests, 11 errors; optimized Wasm 16,461 bytes |
| EventBadges app | lint; typecheck; full single-worker suite; production build | 36 files/314 tests passed; large-chunk advisory remains |
| SchoolFees app | lint; typecheck; full single-worker suite; production build | 26 files/168 tests passed; large-chunk advisory remains |
| SchoolFees docs | Node link-checker tests; relative-link checker | 13 tests; 117 links across 31 Markdown files |
| EventBadges docs | Node link-checker tests; relative-link checker | 13 tests; 74 links across 22 Markdown files |
| Workspace check runner | Node tests | 6 tests passed |
| Browser page fixtures | Nine isolated pages at 320px and 390px; keyboard verification/edit | 18 layout checks passed; synthetic only |

App raw check logs and audit reports are in [logs/](logs/). Contract results
were observed in the tool session (no separate raw log retained). Their commands
are reproducible with `node scripts/check-projects.mjs --submission --area contracts`.
Browser evidence and its limits are in [UI review](ui-review.md).

InvoicePay's new `repeat_pay_and_refund_renew_the_receipt_index` regression
failed at the repeat-payment renewal assertion before the fix and passed after
renewing the index on repeat payments and refunds. The complete 30-test contract
suite passed afterward. No contract ABI or token-transfer policy changed.

EventBadges' initial parallel app run timed out at the existing 15-second maximum
Merkle-tree test. The complete one-worker rerun passed with that timeout unchanged.
Both apps retain large-chunk warnings and unresolved dependency advisories:
SchoolFees 19 (13 low/6 moderate); EventBadges 19 (12 low/7 moderate). No forced
package downgrade was applied. Bundle scans are not security audits.

Optimized Wasm SHA-256 values printed by the actual builds:

- SchoolFees: `016df1942fa7f02a9a2402bc0854d75c0393ba3ae6d39b2de858d040b996afbb`
- EventBadges: `671a29a1cc65df5b7de8952b276b765db3b5a2e048cfacd7d8ae707f4bfb62bf`
- InvoicePay: `df77525063bda9e74fd183547895be59a3c7efd50b039cc8241d4313b316f709`

Final HEAD, dirty status and source snapshot identities are recorded in
[source-snapshots.json](source-snapshots.json). After publication, rerun or match
CI on the final submitted commit. Existing remote visibility and CI are recorded
separately in [public repositories](public-repositories.md).

Required contracts: fmt, clippy with warnings denied, locked tests, Node checker
tests, error synchronization, event synchronization where configured, and Stellar
contract build. Required apps: lint, type checking, full tests and production build.
Docs link tests are supporting checks. mdBook build is CI-only if unavailable.

No deployment, real wallet flow, pilot, current-update remote CI pass or audit is established by
local checks. InvoicePay app is incomplete and intentionally excluded.
