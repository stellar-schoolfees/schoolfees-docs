# Live synthetic testnet validation

Three existing deployments were exercised using CLI-managed synthetic identities and the official Stellar testnet RPC. No contract was redeployed. All **15 submitted transactions** were independently confirmed `SUCCESS` through RPC.

| Project | Successful transactions | Observed checks |
|---|---:|---|
| [SchoolFees](schoolfees-live-smoke.md) | 5 | Create, partial payment, refund, final payment and close; exact totals and native-token deltas adjusted for actual network fees; four expected contract rejections |
| [EventBadges](eventbadges-live-smoke.md) | 4 | Create, claim, revoke and award; badge presence/list/count after changes; invalid-proof and duplicate-claim rejections |
| [InvoicePay](invoicepay-live-smoke.md) | 6 | Create, partial payment, refund, final payment, separate unpaid invoice and cancellation; receipts, exact recipient balance changes and zero contract balance; four contract rejections and a direct RPC authorization rejection |

The reports link each actual transaction to Stellar Expert and include public machine-readable evidence. Negative cases were simulations and broadcast no transaction. EventBadges used a single-leaf tree and one synthetic organizer/attendee; SchoolFees and InvoicePay used distinct sender/recipient accounts and testnet native XLM. These are bounded smoke tests, not exhaustive security or token-compatibility testing.

## What is still unverified

**No browser-wallet end-to-end test has been completed.** CLI success does not prove wallet connection, wallet network reporting, signing prompts, rejection/cancellation behavior or the app's complete simulation/submission path. Existing automated app tests use wallet/RPC mocks; browser layout/accessibility checks used disconnected wallets.

Before describing an app as demonstrated end to end, use a dedicated funded testnet browser wallet and the verified contract ID. Exercise its create/read/pay or claim flow, decline one signature, verify wrong-network refusal, and compare the app's displayed result and explorer link with the actual transaction. Keep keys and recovery phrases private; use only synthetic opaque hashes and test tokens.

Ajo and DuesTreasury remain undeployed and were not invoked. Their human custody-review requirement remains in force. No real pilot, audit, mainnet use or Drips acceptance is claimed.

Local DNS intermittently failed. A temporary loopback relay reached the same official testnet hostname using an observed IPv4 address with normal HTTPS/TLS verification. It logged no requests and automatically retried no writes; it was stopped after the smoke tests.

The correct readiness statement is: **public, CI-passing v0 repositories with verified synthetic contract flows for these three projects; browser-wallet validation still pending.**
