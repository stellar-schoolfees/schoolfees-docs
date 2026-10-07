# Proven vs assumed

Claims distinguish execution evidence from workflow configuration:

- **Tested locally** - the command was executed locally; it does not prove remote CI.
- **Configured in CI** - a workflow includes the command; a successful run on the
  submitted revision still needs verification.
- **Assumed** - the behavior has not been exercised in the stated environment.

The October 7 local contract validation passed 34 Rust tests, 9 Node checker
tests, formatting, clippy with warnings denied, error synchronization and
`stellar contract build` using CLI 28.1.0. Local evidence and final source
identity are recorded in the workspace submission packet. The prior published SchoolFees app HEAD has a successful CI run; this does not
validate the changed worktree. mdBook is not installed locally.

If a claim is not in this table, do not assume it is proven. The
[known limitations](limitations.md) page says what the gaps mean in plain words,
and [todo: verify](todo-verify.md) lists the open items with what would verify
each one.

## The contract (`schoolfees-contracts`)

| Claim | Status | Evidence |
|---|---|---|
| The contract compiles for `wasm32v1-none` and builds a `.wasm` | Tested locally; configured in CI | `stellar contract build` in `.github/workflows/contract.yml` |
| 34 Rust unit tests pass | Tested locally; configured in CI | `cargo test` (23 lifecycle/happy-path tests in `src/test.rs`, 11 `error_path_*` tests in `src/error_paths.rs`) |
| Every `Error` variant has a test that triggers the real failure path | Tested locally; configured in CI | `src/error_paths.rs` + `AGENTS.md` rule |
| `ERRORS.md` matches `enum Error` (11 variants) | Tested locally; configured in CI | `node scripts/check-errors.mjs` (prints "in sync … 11 variants checked") and 9 checker tests via `node --test` |
| Formatting and clippy are clean with warnings denied | Tested locally; configured in CI | `cargo fmt --all --check`, `cargo clippy --all-targets -- -D warnings` |
| The events in `docs/events.md` are the events the code emits | Tested locally; configured in CI | `lifecycle_publishes_documented_events`, `initialize_publishes_an_initialized_event` in `src/test.rs` |
| Only the school can create/close/refund and only the payer can pay | Tested locally; configured in CI | `create_fee_requires_the_school_signature`, `close_fee_requires_the_school_signature`, `refund_requires_the_school_signature`, `pay_requires_the_payer_signature`, `pay_rejects_a_signature_from_someone_other_than_the_payer` |
| A payment moves tokens straight from the payer to the school | Tested locally; configured in CI | `pay_records_installments_until_the_fee_is_paid`, `refund_returns_tokens_and_reopens_the_fee` (real Stellar Asset Contract in tests) |
| Fee ids start at 1 and rise; one fee per `(school, reference)` | Tested locally; configured in CI | `create_fee_assigns_sequential_ids`, `create_fee_allows_the_same_reference_for_another_school`, `error_path_duplicate_reference` |
| Status is derived (`Open`/`Paid`/`Overdue`/`Closed`), and `Closed` is terminal | Tested locally; configured in CI | `status_is_open_up_to_the_due_date_and_overdue_after`, `pay_after_due_date_is_allowed_and_status_becomes_overdue_then_paid`, `error_path_fee_closed` |
| Records are extended toward `due_at + 30 days`, with a 7-day floor | Tested locally; configured in CI | `create_fee_extends_the_fee_and_reference_ttls`, `pay_extends_the_payer_record_ttl`, `get_fee_keeps_a_late_record_alive_with_the_floor_ttl`, `initialize_extends_the_instance_ttl`, `admin_read_extends_the_instance_ttl` |
| `fee.paid_total` always equals the sum of per-payer `paid` records | **Assumed** (holds by construction) | `src/fee.rs::pay` updates both in one call; no dedicated aggregate or property-based test — draft `06-property-based-invariants.md` |
| Test code is at least as large as implementation code | **Tested locally only** | Counted by hand at the handoff audit; no automated check — draft `08-coverage-gate.md` |
| CLI 28.1.0 builds the local contract Wasm | Tested locally | `stellar contract build` passed October 7; remote CI and published artifact identity remain unverified |

## The docs (`schoolfees-docs`, this book)

| Claim | Status | Evidence |
|---|---|---|
| Every relative link and every `SUMMARY.md` entry resolves | Tested locally; configured in CI | `node scripts/check-links.mjs` (prints the number of links and files) |
| The link checker itself behaves as documented | Tested locally; configured in CI | 13 tests via `node --test`, in `scripts/check-links.test.mjs` |
| The book builds as an mdBook | Configured in CI; execution unverified | `mdbook build` in `.github/workflows/docs.yml`; mdBook is deliberately not installed locally, and remote CI has not been inspected |
| Error wording quoted in [FAQ](faq.md) matches `ERRORS.md` | **Tested locally only** | Checked by hand at the handoff audit; the app's mapping is the automated copy, this book's quotes are not |
| The file, function and test names cited in the book still exist in the code repos | **Assumed** | Checked by hand once; nothing re-checks it — draft `03-docs-freshness-check.md` |

## The app (`schoolfees-app`)

October 7 final app validation passed lint, strict type checking, all 168 tests
across 26 files (`npm test -- --maxWorkers=1`, 187.94 seconds, unchanged test
timeouts), and production build (973 modules, 2.31 seconds). The main chunk is
799.26 kB / 188.53 kB gzip; Vite's 500 kB chunk warning remains. This is a size
measurement, not a performance benchmark or a resolved dependency audit.

| Claim | Status | Evidence |
|---|---|---|
| 168 tests pass across 26 files | Tested locally; configured in CI | `npm test` (vitest; the render tests run in happy-dom with an axe-core accessibility check per rendered tree; write paths use a mocked wallet module and a fake contract client, so nothing touches a network) |
| Error codes map to the exact wording from `ERRORS.md`, both directions | Tested locally; configured in CI | `src/lib/contractErrors.test.ts`; the comparison against `../schoolfees-contracts/ERRORS.md` runs only when that repo is checked out (it is skipped in CI) |
| The ScVal encodings round-trip against the real SDK | Tested locally; configured in CI | `src/lib/scval.test.ts` using the installed `@stellar/stellar-sdk` encoders |
| The app refuses any network that is not testnet, and incomplete config | Tested locally; configured in CI | `src/lib/network.test.ts`, `src/config.ts` |
| Lint, strict type-check and the production build pass | Tested locally; configured in CI | `npm run lint`, `npm run typecheck`, `npm run build` |
| The pages render and are reachable without a console error | **Tested locally only** | Isolated browser checks covered nine project pages at 320px and 390px (18 layouts), with synthetic mocked wallets and no external requests. These checks do not establish the complete app shell, screen-reader behavior, real wallets or network calls; no browser job runs in CI |
| A wallet connects, reports its network and signs | **Assumed** | No real wallet has ever connected to this app; `src/lib/wallet.ts` is unproven |
| Contract calls (build → simulate → assemble → submit → poll) work | **Assumed** | No contract is deployed; `src/lib/contract.ts` is unproven |
| A transaction result is read back, including a fee id and a `status()` value | **Assumed** | The `status()` encoding of the unit-variant enum was never verified against a deployed contract; the app decodes defensively and shows `Unknown` for anything unrecognised |
| A host error string (`Error(Contract, #N)`) is parsed correctly | **Assumed** | The regex in `src/lib/contractErrors.ts` matches the documented shape only; never seen on a real network |
| The app is accessible | **Tested locally only** | An automated axe-core check runs over every rendered component and page and fails on serious violations (`src/test/render.tsx`, added in `25958ab`/`ca27a2b`); the harness is itself tested against a deliberately broken label. Colour contrast is checked against the design tokens, not rendered styles, and no screen-reader or keyboard audit has been done — draft `07-component-and-accessibility-tests.md` |
| The wallet picker uses eight explicitly configured Stellar wallet modules | Tested locally; source reviewed | `src/lib/wallet.ts` lists the modules; the broad default module import was removed |
| Picker icons use local assets | Source reviewed | `public/wallet-icons/` and wallet module configuration replace remote icon URLs. This does not prove that wallet providers make no third-party requests |
| Dependency audit reports 19 advisories: 13 low and 6 moderate | Tested locally; unresolved | October 7 `npm audit`; narrower wallet imports do not remove packages from the lockfile. Reachability review and upstream remediation remain necessary |
| RPC calls are bounded with timeouts and retries, and `sendTransaction` is never auto-retried | **Tested locally only** | `retryRpc` helper with timeout + bounded exponential backoff in `src/lib/contract.ts` (`d9c6b6c`); applied to `getAccount`, `simulateTransaction` and poll only |
| Duplicate submission is prevented by an in-flight guard in `useAction`, not only the disabled button | **Tested locally; configured in CI** | `busyRef` + `generation` counter in `useAction.run` (`d9c6b6c`); unit test asserts overlapping `run` calls execute the task once |
| A write's result is re-read so the fee summary is current | **Tested locally only** | `PayPage` and `SchoolActionsPage` re-read the fee after a successful payment, refund or close (`cf9fbe0`) |

## What would change this table

The first testnet deployment and one pilot run would move most of the "assumed"
rows in the third table into evidence — or expose them as broken. Until that
happens, the app's chain-facing half and every claim about real users stay on
the assumed side, and the [todo: verify](todo-verify.md) page is the worklist.
