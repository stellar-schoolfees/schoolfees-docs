# Remaining-project completion — October 8, 2026

The previously unfinished Ajo, DuesTreasury and InvoicePay app/docs now have implemented, locally checked v0 workflows. This report supplements the October 7 preparation packet; it does not claim Drips acceptance or a real pilot.

| Project | Implemented workflows | Final local checks |
|---|---|---|
| Ajo | Create and inspect circles; authorized contributions; fully funded round settlement; fixed payout rotation and isolated accounting | App: lint, typecheck, 33 tests, production build. Contract: fmt, clippy with warnings denied, 24 Rust tests, 9 checker tests, 11 synchronized errors, Wasm build. Docs: 13 tests and 13 relative links. |
| DuesTreasury | Create groups; current-period dues; proposals, signer approvals, threshold execution and cancellation; group/proposal/member views | App: lint, typecheck, 46 tests, production build. Contract: fmt, clippy with warnings denied, 32 Rust tests, 9 checker tests, 17 synchronized errors, Wasm build. Docs: 13 tests and 18 relative links. |
| InvoicePay | Create, inspect and pay opaque invoices; partial payments, cancellation, refunds and receipt lookup | App: lint, typecheck, 53 tests, production build. Docs: 14 checker tests and 29 relative links. Existing contract deployment and its predeployment checks are recorded separately. |

## Browser and reliability review

The configured app shells passed at **320, 390 and 1280 pixels**, without horizontal overflow, browser exceptions or automated axe WCAG 2 A/AA and 2.1 AA violations. The final Ajo/DuesTreasury forms were rechecked after review fixes. External network requests were blocked; wallets were disconnected. Ajo and DuesTreasury used a placeholder public contract address exclusively in temporary browser fixtures, never a deployed application.

Tests cover integer boundaries, contract error wording, testnet refusal, RPC-network mismatch, wallet account/session changes, delayed requests, immutable pending forms and ambiguous submission hashes. Unknown transaction outcomes retain explorer links and do not trigger blind retries. These mocked tests and disconnected browser checks do not establish a real-wallet end-to-end demonstration.

Root workspace evidence: `remaining-app-final-review.json`, `remaining-app-static-review.json` and `screenshots/remaining-apps/`. Reproduction commands and limitations are in each repository's README and testing documentation. Every one of the 15 repositories now has configured checks, contributor issue forms and a pull-request template.

## Contract artifacts

| Contract | Wasm bytes | SHA-256 |
|---|---:|---|
| Ajo | 11,299 | `bd221b7bfb9745f147a8dcd2a040a500a959359950c963c6ffb63578995636e2` |
| DuesTreasury | 13,072 | `265b4b71e2d15301226ca6d028a70b2677686e59194959bc8fa6935d7d3b7434` |

Ajo and DuesTreasury remain undeployed. Their repository instructions require a second human custody review before funded tests; this implementation and AI review do not satisfy that requirement. [SchoolFees, EventBadges and InvoicePay](testnet-demonstrations.md) have separately authorized and verified synthetic testnet deployments.

## Remaining limits

- No real pilot, security audit, browser-wallet business-flow verification, manual screen-reader review or mainnet deployment is claimed.
- All three new apps retain **19 dependency advisories: 13 low and six moderate, zero high or critical**. No forced upgrade was applied. Lockfile findings are documented in their repositories.
- Main JavaScript chunks exceed Vite's 500 kB warning: Ajo 776.99 kB, DuesTreasury 780.98 kB and InvoicePay 793.23 kB. Builds passed; bundle optimization remains contributor work.
- Ajo lacks cancellation/refunds and enforced payment deadlines; a missing contributor can lock a pot. DuesTreasury lacks mutable membership, proposal expiry and a browser flow coordinating multiple cancellation signers. The documented v0 boundaries remain explicit.
- mdBook is not installed locally. Book rendering is checked by the published GitHub Actions workflows; local link-check success alone does not prove rendering.
- Drips application submission, GitHub app installation, genuine partner agreements and acceptance remain human/application actions. October 9 is the maintainer's preparation target, not a verified official cutoff.

Publication and exact-commit CI results are recorded in the root workspace's `remaining-publication.json` and `remaining-ci-review.json` after publication; these are separate from local validation.
