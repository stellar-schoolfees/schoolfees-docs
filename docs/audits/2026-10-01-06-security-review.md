# Audit — Security review (2026-10-01)

Report only. **No code was changed by this audit.** Each verified finding has a
draft in the repository it belongs to; the two decisions that are not mine to take
are recorded in `docs/arsenal-gap-map.md` §9 ("Decisions needed from Tim").

Prompt used: `build-arsenal/06-ai-agent-prompts/06-security-review.md` — *"Review
against SECURITY.md and the threat model. Check secrets, auth, authorization,
inputs, APIs, logging, dependencies, and data handling. Report severity and
fixes."*

## 1. Scope, and the two documents it was reviewed against

| Artefact | Reviewed against |
|---|---|
| `schoolfees-contracts` (`src/`, `Cargo.toml`, `.gitignore`, CI workflow, deploy script) | its new `docs/SECURITY.md`, plus `schoolfees-docs/src/threat-model.md` |
| `schoolfees-app` (`src/`, `index.html`, `package.json`, built bundle) | its new `docs/SECURITY.md`, plus the same threat model |
| Dependency trees | `npm audit` for the app; `cargo audit` **is not installed**, so the Rust tree had no vulnerability scan |

## 2. What was checked

Secrets (in source, in config, in the built output) · authentication and
authorization per contract function · input validation on both sides · cross-contract
and RPC trust · error handling and what reaches the user · logging and what the app
persists · third-party requests and scripts · dependency review, licences and
advisories · data handling and the student-data rule.

## 3. Verified issues

### SEC-01 — 19 dependency advisories, all transitive through the wallet kit

- **Severity: medium**
- **Evidence:** `npm audit` in `schoolfees-app`, run for the first time on
  2026-10-01:

  ```
  19 vulnerabilities (13 low, 6 moderate)
  ```

  Every entry resolves to `@creit.tech/stellar-wallets-kit@2.7.0`:
  `@hot-wallet/sdk@1.0.11` → `@near-js/*` → `secp256k1` → **`elliptic@6.6.1`**
  (GHSA-848j-6mx2-7j84); `@solana/web3.js@1.99.0` → `jayson@4.3.0` →
  **`stream-json@1.9.1`** (GHSA-528h-pc64-c93x); **`uuid@8.3.2`**
  (GHSA-w5hq-g745-h8pq).
- **Aggravating factor:** the only fix `npm audit` offers is
  `npm audit fix --force`, which **downgrades the wallet kit to 1.5.0** — a
  breaking change to the one dependency that makes the app function.
- **Also:** `@hot-wallet/sdk@1.0.11` declares **no licence** at all (empty
  `license` field), which is a real, if small, legal uncertainty for an MIT
  project that ships it.
- **Mitigating facts, stated without overclaiming:** none of the four direct
  runtime dependencies is implicated; the flagged code is NEAR and Solana
  multi-chain wallet code that a Stellar-only app most likely never executes; and
  the NEAR/Solana `keystore`/`signer` paths in particular need a wallet flow this
  app does not offer. That is a **plausibility argument, not a proof of
  unreachability** — the code is bundled and shipped.
- **Suggested fix:** choose deliberately — (a) document and accept, with the
  reachability reasoning written down; (b) override/pin a patched transitive
  version where possible; or (c) narrow the wallet kit to a Stellar-only module
  set, which removes the multi-chain tree entirely and also shrinks the ~1 MB
  bundle.
- **Tracked as:** `schoolfees-app/docs/issue-drafts/17-wallet-kit-dependency-advisories.md`
  (and `02-code-split-wallet-kit.md` for the bundle half). The decision is
  recorded in `docs/arsenal-gap-map.md` §9.4.

### SEC-02 — Opening the wallet picker contacts third-party hosts, and the README said it did not

- **Severity: low** (privacy of an IP address, plus a documentation-accuracy problem)
- **Evidence:** grepping the production bundle (`dist/assets/index-DlLH7UZT.js`)
  found per-module remote icon URLs:

  ```
  https://stellar.creit.tech/wallet-icons/freighter.png   (and albedo, lobstr, rabet,
  xbull, hana, klever, bitget, fordefi, cactuslink)
  https://scopuly.com/img/logo/icon.png
  https://uni.onekey-asset.com/static/logo/onekey.png
  ```

  `src/lib/wallet.ts` initialises the kit with `defaultModules()`, and the model
  renders one icon per wallet — so these are fetched **when the wallet picker is
  opened**, not on page load.
- **What the repositories claimed:** `schoolfees-app/README.md` said *"The built
  page makes no network request other than to the Stellar RPC endpoint from
  `.env`."* That is true of a page load and false the moment the connect flow is
  used. For a project whose privacy argument rests on telling users exactly what
  leaves their browser, the wrong version of this claim is worse than a smaller
  accurate one. The icon host learns that someone opened the app, and from which
  IP.
- **Related fact checked:** the bundle contains **no** WalletConnect/Reown code
  (`grep -i` for `walletconnect` and `reown` across the built assets: zero
  matches), despite both being in the kit's dependency tree — so no relay
  connection is made by this build. That is a property of the current bundle, not
  a guarantee.
- **Suggested fix:** the wording has been corrected in the audit's own companion
  work (`README.md`, and the app `docs/SECURITY.md` §8); the open decision is
  whether to keep the icon hosts (and add them to a future CSP) or configure a
  narrower, local-icon module set. That is a privacy decision, not an agent's.
- **Tracked as:** `schoolfees-app/docs/issue-drafts/15-correct-the-outbound-request-claim.md`;
  decision recorded in `docs/arsenal-gap-map.md` §9.5.

### SEC-03 — No CSP or security headers, and no host configuration to put them in

- **Severity: low** (informational at this stage)
- **Evidence:** nothing is deployed, so no headers exist. The app's own
  `docs/SECURITY.md` §9 records this, and
  `schoolfees-app/docs/PRODUCTION_QUALITY.md` §5 writes out the policy this app
  would want (`script-src 'self'`, `connect-src` limited to the RPC URL,
  `img-src` limited to self plus the icon hosts from SEC-02, `frame-ancestors
  'none'`, no `unsafe-eval`).
- **Why it is recorded:** so the policy is not invented at deploy time, and so the
  `img-src` decision in SEC-02 is visibly connected to it.
- **Suggested fix:** set the documented headers when the host is chosen (a
  maintainer step in `DEPLOYMENT_CHECKLIST.md` §5). No draft: it is a deployment
  step, not contributor work.

### SEC-04 — Bounded RPC retries and timeouts are specified but not implemented

- **Severity: low**
- **File:** `schoolfees-app/src/lib/contract.ts` (`buildTransaction` `:100-108`,
  `assemble` `:113-129`, `read` `:131-145`, `submit` `:193-221`)
- **Evidence:** every RPC call is a single attempt. `TransactionBuilder.setTimeout(60)`
  (`:106`) bounds the transaction's own validity window; nothing bounds the HTTP
  call, and `TRY_AGAIN_LATER` (`:201`) is reported as "the network is busy" with
  no retry.
- **Why it matters, and why it is not simply "add a retry":** reads are idempotent
  and a poll of a known hash is safe, but a retry around `sendTransaction` is
  exactly how a duplicate payment happens. The requirement in the app's
  `docs/SECURITY.md` §5 is therefore for **bounded** behaviour that treats the two
  classes differently — and the current code has neither timeouts nor retries.
- **Suggested fix:** a pure, unit-tested helper for timeout plus bounded
  exponential backoff, applied to `getAccount`, `simulateTransaction` and poll
  only; never auto-retry `sendTransaction`; keep reporting an unknown outcome with
  the transaction hash.
- **Tracked as:** `schoolfees-app/docs/issue-drafts/11-bound-rpc-retries-and-timeouts.md`.

### SEC-05 — Duplicate submission is prevented by the disabled button only

- **Severity: low** (financial impact if it triggers)
- **File:** `schoolfees-app/src/hooks/useAction.ts:18-38`
- **Evidence:** the guard is the re-render that follows `setBusy(true)` plus
  `fieldset disabled={busy}` on each form. `run` itself has no in-flight ref and
  no generation counter, so a second invocation from anywhere other than the click
  path, or from a second tab, is not rejected. There is no idempotency key
  on-chain either: a duplicate `pay` is a second real payment.
- **Suggested fix:** an in-flight guard inside `useAction`, with a unit test that
  asserts an overlapping second `run` does not execute the task.
- **Tracked as:** `schoolfees-app/docs/issue-drafts/13-guard-against-duplicate-submission.md`.

### SEC-06 — The contract's `paid_total ≥ refunded_total` invariant is guaranteed by ordering, not by a check

- **Severity: informational**
- **File:** `schoolfees-contracts/src/fee.rs:38-41` (`net_paid`) and `:167-178` (`refund`)
- **Evidence:** `net_paid` computes `fee.paid_total - fee.refunded_total` with a
  plain subtraction. It cannot underflow *today* because `refund` checks
  `amount <= record.paid - record.refunded` (`:181-184`) and updates both the
  payer record and the fee total in the same call, and the release profile sets
  `overflow-checks = true` so a violation would trap rather than wrap. The
  property therefore holds by construction — and is stated as such in
  `src/architecture.md` §7 — but **no aggregate or property-based test proves it
  under arbitrary call sequences**.
- **Assessment:** not a bug; a missing proof. The contract's own
  `docs/TESTING.md` §3 lists it honestly.
- **Suggested fix:** saturating or checked arithmetic would make the invariant
  explicit; the property test that would catch a regression is already drafted.
- **Already tracked by:** `schoolfees-contracts/docs/issue-drafts/06-property-based-invariants.md`
  (no new draft).

## 4. What was checked and found clean

Positive verification, so the short list above is evidence and not an omission.
Each item was read in the source, not assumed.

**Contract**

- **Authorization is correct and per function**: `require_auth` on the school for
  `create_fee`, `close_fee` and `refund`, and on the payer for `pay`; there is a
  test per caller, including a payer signed by someone else.
- **No custody, by construction**: `pay` and `refund` call the token contract's
  `transfer` directly between payer and school in the same invocation as the
  record update. There is no pooled balance, no sweep function and no code path
  where the contract holds a balance.
- **The admin has no power**: `initialize` records an address and `admin()` returns
  it; no fee function reads `DataKey::Admin`. Compromising the admin key cannot
  move funds, change a fee, pause or upgrade anything.
- **Input validation is complete and ordered before writes**: `total > 0`, a
  future `due_at`, a unique `(school, reference)`, `amount > 0`,
  `amount <= remaining`, and a refund capped at what the payer still has paid —
  each with an error-path test that triggers the real failure.
- **Checked arithmetic** (`add`, the fee-id counter) and **no loops, no lists, no
  unbounded inputs** anywhere.
- **TTL arithmetic cannot panic**: `saturating_add` / `saturating_sub`, a
  `u32::try_from` with `unwrap_or(u32::MAX)`, and a clamp to
  `env.storage().max_ttl()`.
- **Secrets**: none in the contract, and no key handling at all — the deploy
  script reads an identity name from `STELLAR_ACCOUNT` and never touches a secret.
- **Dependency surface is one crate** (`soroban-sdk = "28"`), pinned to a major
  version with `Cargo.lock` committed, and the decision not to use OpenZeppelin is
  recorded in `docs/decisions/0001`.

**App**

- **No secret exists to leak**: no keypair, no mnemonic, no API key, no server.
  The four values in `.env` are public (network name, RPC URL, contract id,
  explorer base) and the `.env` files were **never read** by this audit.
- **The bundle was checked for secrets by pattern** (Stellar seed keys, PEM
  headers, key-style assignments) as part of audit 09: no hits in tracked files or
  in the full history.
- **The app writes no storage and sets no cookies of its own**: `grep` across
  `src/` and `index.html` for `localStorage`, `sessionStorage`, `document.cookie`,
  `fetch(` and `XMLHttpRequest` returns **nothing**. The five
  `@StellarWalletsKit/*` keys in `localStorage` are written by the kit and hold an
  address, a module selection and hardware-path state — no key material.
- **No logging at all**: there is no `console.*` call in `src/`, so no payer data
  and no error detail is logged anywhere.
- **Network safety is the strongest part of the app**: the passphrase is pinned
  from the SDK, a non-testnet `VITE_STELLAR_NETWORK` stops the app rendering any
  page, the wallet's own network is re-read **before** every write and a
  non-testnet wallet aborts before a transaction is built, and a wallet that
  cannot report its network is treated as untrusted. Each of those refusals is unit
  tested.
- **Input validation is complete and pure**: contract ids and account addresses via
  `StrKey`, fee ids as digits ≥ 1, amounts as whole positive `bigint`, and the
  reference restricted to exactly 64 hex characters — which is what makes an
  accidental name, phone number or id impossible to enter through the UI.
- **Error handling is honest**: reviewed `ERRORS.md` wording for known codes, a
  generic message that names an unknown code, the real message passed through for
  non-contract failures, and never a success report for an unconfirmed
  transaction.
- **XSS has no foothold**: React escapes everything rendered, there is no
  `dangerouslySetInnerHTML`, no `innerHTML`, no third-party script and no `eval`.
- **The bundle contains no analytics or tracker code**, and no WalletConnect/Reown
  code.

## 5. Decisions this audit cannot make

Recorded in full in `docs/arsenal-gap-map.md` §9; repeated here because they are
security decisions, not implementation details:

1. Accept, wait for, or narrow around the wallet-kit advisories (SEC-01).
2. Accept the remote wallet-icon requests, or configure a local-icon module set
   (SEC-02), and the CSP that follows from that choice.
3. The data-protection questions in `src/legal-compliance.md` — including whether
   a hash of a school-internal id is personal data where the school holds the
   mapping.
4. Who holds the admin, school and payer keys at deployment, given that the
   contract has no upgrade path and no pause.

## 6. What was NOT checked

- **`cargo audit` was not run, because it is not installed.** No dependency
  vulnerability scan exists for the Rust side. Nothing was installed to change
  that.
- **Exploitability.** The advisories in SEC-01 were identified, not exploited. No
  proof-of-concept, no reachability analysis of the bundler output, no dynamic
  testing.
- **Runtime behaviour.** No page was rendered, no wallet was connected, no RPC call
  was made, no transaction exists. Every chain-facing claim remains unverified.
  See the app's `README.md`, "What is proven vs assumed".
- **The wallet kit's internals.** It is a third-party dependency whose code was
  not reviewed; only its declared dependency tree and its presence in the bundle
  were examined.
- **Supply-chain integrity.** No signature or provenance check, no SBOM, no
  licence-compliance scan, no review of CI action versions beyond reading them.
- **`.env` contents** — off-limits by rule, and never read.
- **The host's configuration**, because no host has been chosen.
- **The other four Drips repositories**, per the task's scope.
