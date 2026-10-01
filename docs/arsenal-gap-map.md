# Build Arsenal and Flowtick gap map — schoolfees

Status of every item in the Build Arsenal core docs, the design system, the
security arsenal, the production-launch arsenal and the Flowtick engineering
playbook, against the three real repositories.

- Date: 2026-10-01
- Repos in scope: `schoolfees-contracts`, `schoolfees-app`, `schoolfees-docs`.
- Sources (read-only, outside any repository, never committed or modified):
  `Drips/_reference/build-arsenal/` and `Drips/_reference/flowtick/`.
- Profiles applied: **crypto** (risk: high) and **education-platform** (student
  data). The AI-app, SaaS, ecommerce, marketplace, dashboard, landing-page,
  portfolio and mobile material was deliberately ignored.
- This file lives outside `src/`, so mdBook does not build it and it is not in
  `SUMMARY.md`.

**Status meanings**

| Status | Meaning |
|---|---|
| **exists** | The item is covered by something already in the repository. Named. |
| **partial** | Partly covered, or covered in a weaker form. The gap is stated. |
| **missing** | Not covered. Either created by this task, or recorded as a draft. |
| **n/a** | Not applicable, with the reason. Never dropped silently. |

Flowtick text is **not** copied verbatim anywhere in this task: every artefact
created from it is rewritten for a Soroban contract, a Vite/React/TypeScript
testnet app and an mdBook.

---

## 1. Core project documents (`build-arsenal/01-core-project-docs`)

| Item | contracts | app | docs |
|---|---|---|---|
| `PRD_TEMPLATE` | partial — scope lives in `README.md` + `docs/design/interface-v0.md`; no one-page PRD | partial — `README.md` + `ROADMAP.md` describe scope, no PRD | **created:** `src/prd.md` |
| `ARCHITECTURE_TEMPLATE` | **created:** `docs/ARCHITECTURE.md` (pointer + what the template asks for that only exists here) | partial — "Structure" and "What is proven vs assumed" in `README.md`; no boundaries section | exists — `src/architecture.md`, the single source of truth for the system |
| `DESIGN_GUIDELINES_TEMPLATE` | n/a — no UI in this repo | **created:** `docs/DESIGN_GUIDELINES.md` | n/a |
| `LEGAL_COMPLIANCE_TEMPLATE` | partial — privacy rules in `AGENTS.md`; no checklist | partial — privacy rules in `AGENTS.md`; no checklist | **created:** `src/legal-compliance.md` (marked not legal advice) |
| `PRODUCTION_QUALITY_TEMPLATE` | n/a — no web artefact | **created:** `docs/PRODUCTION_QUALITY.md` | n/a — the book's own output is built in CI; publishing is draft `01` |
| `DEPLOYMENT_CHECKLIST_TEMPLATE` | **created:** `docs/DEPLOYMENT_CHECKLIST.md` | **created:** `docs/DEPLOYMENT_CHECKLIST.md` | n/a — publishing the book is draft `01` |
| `SECURITY_TEMPLATE` | **created:** `docs/SECURITY.md` | **created:** `docs/SECURITY.md` | n/a — describes no code; contract security is linked, not repeated |
| `TESTING_TEMPLATE` | **created:** `docs/TESTING.md` | **created:** `docs/TESTING.md` | **created:** `docs/TESTING.md` (doc-set checkers only) |
| `README_TEMPLATE` | exists — status banner, what works, limitations first | exists — same shape, plus "proven vs assumed" | exists |
| `RESOURCES_TEMPLATE` | partial — `Cargo.lock` pins one dependency and decision `0001` records why; no table | **created:** `docs/RESOURCES.md` | partial — one dev-time checker, documented in `README.md` |
| `AGENTS_TEMPLATE` | exists — extended by this task | exists — extended by this task | exists — extended by this task |

## 2. Project-type profiles (`02-project-type-templates`, `08-project-profiles`)

### 2.1 Crypto profile — risk: HIGH

| Item | Status per repo |
|---|---|
| Wallet connection | app: **exists** — `src/lib/wallet.ts` (Stellar Wallets Kit), `src/hooks/useWallet.ts` |
| Chain detection, testnet validation | app: **exists** — `src/lib/network.ts` pins the passphrase, `src/lib/flow.ts` re-checks the wallet's network before every write, `checkWalletNetwork` refuses anything else |
| Address and contract-id validation | app: **exists** — `src/lib/validation.ts`, `StrKey.isValidEd25519PublicKey` / `isValidContract` |
| Transaction confirmation UX (hash + explorer link) | app: **partial** — hash and explorer link after every write (`TransactionResult.tsx`); the label says "submitted" although the code only returns after `pollTransaction` reports `SUCCESS`, and there is no distinct pending/confirmed state or re-check of the record afterwards |
| Contract configuration from the environment | app: **exists** — `.env` only, through `src/config.ts` |
| RPC failure handling | app: **partial** — every failure is surfaced as a message, but there is **no bounded retry and no explicit timeout** (`src/lib/contract.ts`); recorded as draft `11` |
| Gas / fee handling | app: **partial** — `BASE_FEE` plus `assembleTransaction`, so the resource fee is computed by simulation; the fee is never shown to the payer before signing |
| Never request or store seed phrases or private keys | **exists** in all three: contract never holds keys (`require_auth` only), app rules in `AGENTS.md` + `src/lib/wallet.ts`, docs rule in `AGENTS.md` |
| Testnet-only separation | **exists** in all three: pinned passphrase, visible banner, CI builds, pilot gate |

### 2.2 Education-platform profile — student-data privacy

| Item | Status |
|---|---|
| User roles | **n/a** — there are no accounts or sessions in v0. The roles that exist are on-chain addresses (school, payer, admin), and the contract cannot tell whether an address is a school (`src/fee.rs` `require_auth` only). Recorded honestly rather than mapped onto a roles feature that does not exist. |
| Course/content model, progress, assessment rules, content permissions, moderation | **n/a** — schoolfees records one fee obligation; it has no courses, content or submissions. Moderation is genuinely absent: anyone can create a fee and there is no blocklist (stated in `limitations.md` and in the contract `ROADMAP.md`). |
| Accessibility | app: **partial** — labelled, semantic, mobile-first markup is built in; no screen-reader or keyboard audit and no render tests. `docs/ACCESSIBILITY.md` created, audit `07-accessibility-review` run this task, existing draft `07` tracks the test suite. |
| Student-data privacy | **exists in rules, partial in artefacts** — the verbatim rule is in all three `AGENTS.md`; the app accepts only 64 hex characters and warns in plain words (`src/lib/reference.ts`); the contract stores opaque `BytesN<32>` only. A written compliance checklist was missing and is now `src/legal-compliance.md`; the legal questions themselves are logged under "Decisions needed from Tim". |

## 3. Design system (`03-design-system`)

| Item | Status |
|---|---|
| Tokens | app: **exists** — one `:root` block in `src/index.css` (colour ramp, one accent, per-status tones, radius, shadows, one width); documented now in `docs/DESIGN_GUIDELINES.md` |
| Typography | app: **partial** — system font stack, no web fonts (so no font licence to verify); the type scale is implicit in CSS rules rather than written down; recorded in `docs/DESIGN_GUIDELINES.md` |
| Components | app: **partial** — `Field`, buttons, notices and badges exist with hover/focus/disabled/error states; loading states are text swaps on the button, not a component; states now written down in `docs/DESIGN_GUIDELINES.md` |
| Motion | app: **exists** — short colour transitions only, plus `@media (prefers-reduced-motion: reduce)` disabling both transitions and animations |
| Accessibility baseline | app: **partial** — see §2.2. `docs/ACCESSIBILITY.md` created |

## 4. Security arsenal (`04-security-arsenal`)

| Item | Status |
|---|---|
| `SECURITY_TEMPLATE` items | contract: **created** `docs/SECURITY.md` (auth per function, no custody, token trust, input validation, TTL/archival risk, dependency review, out of scope). app: **created** `docs/SECURITY.md` (wallet, network shown before signing, validation, rejected signatures, bounded RPC, duplicate submission, no client secrets, dependency review). docs: **n/a** — the threat model is the doc-side security artefact and is the single source of truth for threats. |
| Identity: authentication / authorization / MFA / session expiry | contract: **exists** — `require_auth` per function, one test per caller, no admin power in v0. app: **n/a for accounts** — no login, no session; authorization is a wallet signature. MFA: n/a. |
| Inputs and APIs: validate input, XSS/injection, CSRF, rate limiting, quotas, timeouts, bounded retries | contract: **exists** for validation (checked arithmetic, bounded amounts, no loops, no lists); rate limiting and quotas are deliberately absent and documented in `ROADMAP.md` ("Rate limiting or blocklisting fee creation — there is no registry and no identity layer in v0"). app: **partial** — all form input is validated in `src/lib/validation.ts` / `reference.ts` / `amount.ts`; React escapes rendered values, so no `dangerouslySetInnerHTML` anywhere; timeouts and bounded retries are **missing** (draft `11`); CSRF is **n/a** — no cookies, no session, no server. |
| Secrets and data: no frontend secrets, scoped env vars, least privilege, sensitive logs, retention, backup/restore | app: **exists** for the first four — no secret in the bundle, `.env` read in one module, no logging at all in `src/`, nothing persisted by the app itself. Retention: **n/a** — the app stores nothing; the kit's own `localStorage` keys are documented in `src/legal-compliance.md`. Backup/restore: **n/a** as a database item; the on-chain analogue is TTL archival, documented and tracked by drafts `07`/`08`. |
| Dependencies: lockfile committed, vulnerability review, unused dependencies removed | contract: **partial** — `Cargo.lock` committed, one direct dependency, decision `0001` explains why OpenZeppelin is not used; `cargo audit` is **not installed**, so no vulnerability scan has been run. app: **missing** — `package-lock.json` committed, but `npm audit` had never been run; it now has been, and reports 19 advisories (13 low, 6 moderate) reached through the wallet kit. See audit `06-security-review` and draft `17`. |
| `THREAT_MODEL_TEMPLATE` | docs: **exists** — `src/threat-model.md`, a STRIDE walk-through with honest "not applicable, because…" entries. Linked from both new `SECURITY.md` files, never duplicated. |
| `CRYPTO_SECURITY.md` rules | app: **exists/partial** as itemised in §2.1; now written down in `docs/SECURITY.md` |
| `AI_SECURITY.md` | **n/a** — no AI features, no model calls, no prompts in any repository. The only AI use is build-time assistance, which is covered by the agent rules in each `AGENTS.md`. |

## 5. Production-launch arsenal (`05-production-launch-arsenal`)

| Item | contracts | app | docs |
|---|---|---|---|
| `RELEASE_RUNBOOK` | **created** as `docs/DEPLOYMENT_CHECKLIST.md` | **created** as `docs/DEPLOYMENT_CHECKLIST.md` | n/a — no runtime artefact; the book build runs in CI |
| `PRELAUNCH_CHECKLIST` | n/a — no end-user product | **created** as `docs/DEPLOYMENT_CHECKLIST.md` + `docs/PRODUCTION_QUALITY.md`; environment, banner, state handling and duplicate submission are all in the checklist | n/a |
| `SEO_TEMPLATE` | n/a | **partial, deliberately deferred** — title and meta description exist in `index.html`; canonical, sitemap, robots and social cards wait for a real domain, which does not exist and must never be invented. No per-view titles or descriptions because there is no routing. Recorded in `docs/PRODUCTION_QUALITY.md` | n/a |
| `OBSERVABILITY` | n/a — no service to monitor; the ledger is the log | **partial** — there is no error logging, no monitoring and no incident owner, and that is a deliberate v0 choice (no analytics, no third-party scripts). What exists instead: the transaction hash is always shown, so a failure is checkable. Documented in `docs/DEPLOYMENT_CHECKLIST.md` | n/a |
| Uptime/backup-restore | **n/a** — no server, no database; records can archive on-chain, which drafts `07`/`08` track | **n/a** — same reason | n/a |

## 6. Flowtick engineering playbook

### 6.1 Git discipline and project setup

| Item | Status |
|---|---|
| `git status --porcelain`, `git diff` / `git diff --staged` before every commit | partial — the commit rules in each `AGENTS.md` said one logical change and "every commit must pass this repo's checks", but did not require reading `git status` and the staged diff. **Added** to all three `AGENTS.md` and to all three `CONTRIBUTING.md`. |
| Stage explicitly, never `git add -A` | missing → **added** to all three `AGENTS.md` and `CONTRIBUTING.md` |
| Secret scan before committing | missing → **added** as a written step to all three `CONTRIBUTING.md`; executed for real in audit `09-git-readiness` (tracked files **and** full history) |
| Exactly one `.gitignore` set: dependencies, build output, env files, editor dirs, OS files | **partial** — app and contracts cover all of it; `schoolfees-docs/.gitignore` covers `/book/`, `/node_modules/` and OS/editor files but **not** `.env`, `.env.local`, `.stellar/` or `*.key`. Reported in audit `09` and recorded as draft `04` in the docs repo; not changed, because the audits in this task are report-only. |
| Conventional commit format `type: imperative summary`, subject ≤72 chars | missing — the previous rule said "Subject line: 100 characters or fewer, in the imperative mood". **Replaced** in all three `AGENTS.md` with the conventional format and the 72-character limit; the 100-character rule is now the wider of the two and is not weakened for other prose. |
| README with what it is, stack, install/run/build | exists in all three |
| Lockfile matches the package manager in use | exists — `package-lock.json` → npm; `Cargo.lock` → cargo |
| One commit per logical change | exists (rule) and followed in this task's own commits |
| No debug code (`console.log`, debugger) | exists — `src/` contains no `console.*`, no `debugger`, no `localStorage` access of its own |
| `.freebuff/` ignored | n/a — the agent directory lives at the Drips workspace root, not inside any of the three repositories |
| Retry a failed push without force-pushing | n/a for an agent — agents must not push at all; the human-run push command is in the handoff |

### 6.2 Data and state

| Item | Status |
|---|---|
| One clear source of truth per piece of state | app: **exists for the app's own state** — `useAction` owns busy/error/result, `useWallet` owns wallet state, pages own form state; no derived value is stored twice (`remaining()` and `net` are computed). The one piece of persisted state is written by the wallet kit, not by the app. |
| Treat persisted data as untrusted, guarded parse, shape validation | app: **n/a for app-owned data** — the app parses nothing it persisted. The kit's `localStorage` values are the kit's own concern; the app never reads them. contract: **exists** — `load_fee` returns a typed error for a missing record instead of panicking. |
| Versioned, app-prefixed storage keys | **n/a** — the app writes no storage. Stated in `src/legal-compliance.md` rather than inventing a key scheme. |
| Stable semantic IDs, never array index | app: **exists** — React keys are `fee.id` (`item.id` in nav) and lists are static; the contract uses a monotonic `u64` fee id, never a position. |
| Empty and loading states, per filter | app: **partial** — every button that does work shows a `Loading…` label and disabled state; every page has a designed "connect a wallet first" state; every lookup failure has reviewed wording from `ERRORS.md`. There is **no** empty-state variant for "nothing yet" versus "no results", because each page looks up one record by id and a failure is an error, not an empty list. There are no lists in v0 (listing is draft `06`). Written up in `docs/TESTING.md` + `docs/DESIGN_GUIDELINES.md`. |
| Honest UI about data | app: **exists** — `Unknown` status is shown rather than guessed; a missing return value is stated plainly rather than inferred. |

### 6.3 Accessibility and UI

| Item | Status |
|---|---|
| Semantic HTML (real buttons, one `h1`, landmarks, skip link) | app: **exists** — `<button>` everywhere, `<nav aria-label="Main">`, `<main id="main">`, `<header>`, `<footer>`, one `<h1>` per page, skip link in `App.tsx` |
| Keyboard and focus: visual order, Enter/Escape, focus returns somewhere sensible, never lost | app: **partial** — focus order and `:focus-visible` outlines (3px, offset) are good; there is **no focus management on page change** (clicking a nav item re-renders `<main>` and leaves focus on the nav button) and no return-focus after a write. Recorded as draft `14`. |
| Screen readers: `aria-pressed`, `aria-live`, `aria-label` on icon-only buttons, `aria-hidden` on decoration | app: **partial** — `aria-live="polite"` on the banner (via `role="status"`), `aria-current="page"` on nav, `role="alert"` on field errors and notices, `aria-describedby`/`aria-invalid` in `Field`. Gaps: the status badge conveys its meaning only in a `title` attribute, and the shortened hash/address are `title`-only. Reported in audit `07`. |
| Motion respects `prefers-reduced-motion` | app: **exists** |
| Responsive, mobile-first, no horizontal overflow | app: **exists** — mobile-first CSS, 44px button targets, 46px inputs, verified at 390px in a browser during development |
| Touch targets ≥ 44×44px | app: **partial** — body buttons and inputs meet it; `nav button` is `min-height: 40px`, below the project's own target. Reported in audit `07`. |

### 6.4 Routing and metadata

| Item | Status |
|---|---|
| Every view is a URL; deep links work on first load | app: **missing** — navigation is five `useState` tabs; there is no URL, so a view cannot be linked to, shared or reloaded into. `index.html` is a single page with one `<title>`. Recorded as draft `12`. |
| Router behaviour: `popstate`, modifier clicks preserved, scroll reset | **n/a while there is no routing** — the browser's back button leaves the app entirely. Not applicable rather than partly done. |
| Per-view title and description | app: **n/a while there is no routing**; the single title ("schoolfees (testnet)") and description do describe the page. |
| Branded 404 | app: **n/a** — a single-file app with no client routes cannot reach an unknown route. The nearest equivalent, a broken configuration, has its own designed screen (`ConfigNotice`). Static-host rewrite rules are **n/a** until routing exists. |

### 6.5 Deploy and QA

| Item | Status |
|---|---|
| Production build passes locally and in CI; `.gitignore` covers output and env | app: **exists** (`npm run build`, `web.yml`); contracts: **exists** (`stellar contract build`, `contract.yml`); docs: **exists** (`mdbook build` in `docs.yml` only) |
| Deep-link refresh works on the deployed site | **n/a** — nothing is deployed and there are no client routes |
| Production smoke test: core flow end to end, reload, mobile viewport, cleared storage, network tab | **missing** — nothing is deployed, so none of it has run. The app's own release smoke test is now written down in `docs/TESTING.md` and `docs/DEPLOYMENT_CHECKLIST.md` for the day it exists. |
| Deploy from `main` only; revert rather than hotfix live files | **partial** — the release discipline is written down; `main` is the only branch and no deploy has happened |
| Verify the deployed site, not the local one | **missing** — no deployment. Testnet-only and gated on a real pilot. |

### 6.6 Scoping and process

| Item | Status |
|---|---|
| One-page spec before code; explicit MVP and non-MVP lists | **partial** — the approved interface draft (`contracts/docs/design/interface-v0.md`) played this role for the contract and `ROADMAP.md` carries the non-goals, but there was no single PRD. `src/prd.md` now fills the gap retrospectively, written strictly from what exists. |
| Low-risk details: assume, state, move on. High-stakes: surface the decision and wait | **partial** — the existing rules cover "never invent" well; the explicit low-risk/high-stakes split and the collaboration rules (`lead with the result`, `call out incorrect assumptions plainly`, `ask before destructive/legal/security/payment/irreversible changes`) were **added** to all three `AGENTS.md`. |
| Deferring without inventing (domain, contact, brand) | **exists** — no invented domain; `PRODUCTION_QUALITY.md` records the deferral with the reason |
| Honest completion: what was tested, what was NOT tested, defects found | **partial** — `proven-vs-assumed.md` and `todo-verify.md` already do this better than most projects; the rule is now **added** to all three `AGENTS.md` so it applies to every task, and `docs/TESTING.md` in contracts and app carries the tested / not-tested split. |
| Working with AI/agents: give the spec, review every diff, the spec decides | **partial** — `AGENTS.md` already binds agents; the spec-first and diff-review half is now in each `CONTRIBUTING.md` (for humans) and in the collaboration rules in `AGENTS.md` |
| Universal rules: never claim untested work; surface high-stakes unknowns | **exists** — the truthfulness and evidence rules in all three `AGENTS.md` are stronger than the generic version; the one addition is the explicit "ask before" list |

## 7. Tool arsenal and master workflow (`07-tool-arsenal`, `09-master-build-arsenal`)

The tool arsenal is advisory ("use a tool because it solves a specific problem,
not because it is available"). No tool was installed in this task: no new
dependency, no global install, no `sudo`. Nothing in the tool matrix is required
by a static testnet app with no backend, so the whole section is **n/a** here,
with one exception: browser automation (Playwright) and a runtime console
check are the two things that would move the "assumed" rows in
`proven-vs-assumed.md`, and they are already tracked by app drafts `04` and `07`.

The master workflow (profile → core docs → PRD → AGENTS → plan → build →
review → test → Git checkpoint → deploy → production audit) is being applied
**retrospectively** to a project that is already built, minus the last two steps
(deploy and production audit), which the pilot gate blocks.

## 8. Explicitly not applicable, with reasons

Each is a real checklist item in the arsenal; none of them can apply to a
testnet-only, backend-less, database-less project. They are listed so that
nobody later reads their absence as an oversight.

| Item | Why it is not applicable |
|---|---|
| API rate limits | There is no API. The contract is called through Stellar RPC, which has its own limits; the app is a static bundle. The contract deliberately has no rate limit on fee creation and that is documented as a design boundary in `schoolfees-contracts/ROADMAP.md`, not as pending work. |
| Spending caps | The project never spends on behalf of a user. Every payment is a direct transfer the payer signs; there is no allowance, no custodian and no pooled balance to cap. |
| Database indexes | There is no database. Storage is keyed on-chain (`DataKey::Fee`, `DataKey::Payer`, `DataKey::Reference`), and every lookup is a keyed read with no scans or queries to optimise. |
| Pagination | There are no list-returning functions in v0 (stated in `contracts/docs/design/interface-v0.md` §6). A paginated school listing is a *future feature with its own draft* (`contracts/docs/issue-drafts/05-paginated-school-listing.md`), not an unmet requirement of anything that exists. |
| Upload compression and size limits | Nothing is uploaded. The app has no file input, no multipart request and no storage service. The only user-supplied field is a fixed-length 64-character reference. |
| API caching | There is no API and no cache layer. The app makes a live RPC call per action; caching a fee record would risk showing a stale balance, which is the opposite of what the UI promises. |
| Payment duplicate-prevention (fiat) | No fiat payment, no card processor, no webhook, no idempotency key — the project never touches fiat. The **on-chain** analogue does apply and is treated as applicable, not as n/a: preventing a duplicate transaction submission is listed in the app `docs/SECURITY.md`, in `docs/DEPLOYMENT_CHECKLIST.md`, and as app draft `13`. |
| Backup restoration | There is no database to back up and restore. The nearest real risk is an on-chain record archiving, which is documented in `limitations.md` and tracked by `contracts/docs/issue-drafts/07-extend-ttl-entrypoint.md` and `app/docs/issue-drafts/08-restore-archived-fee-record.md`. |
| Uptime and performance monitoring | There is no service to monitor. The append-only ledger and the transaction hash are the record. Adding monitoring would mean adding a third-party script, which the app rules forbid. |
| Cookie or storage policy banner | The app sets no cookies and writes no storage of its own; the only stored values are the wallet kit's own `localStorage` keys (enumerated in `src/legal-compliance.md`). There is no tracking to consent to. Whether a notice is still legally required is a legal question, not a technical one, and it is logged under "Decisions needed from Tim". |
| Webhooks, admin operations, file uploads, sessions, MFA | None of these exist in the project. There is no backend, no login and no admin console. |
| Mainnet anything | Out of scope by rule in every repository. |

## 9. Decisions needed from Tim

High-stakes items that must not be guessed. Everything else in this task was
carried through to completion; these are recorded and left open.

1. **Legal review of `schoolfees-docs/src/legal-compliance.md`.** It concerns
   student and (potentially) minor data and Nigerian data-protection law. It is
   written as a checklist marked *not legal advice*, and it flags the Nigeria
   Data Protection Act 2023, current NDPC guidance and the FCCPA as
   `TODO(legal review)`. A qualified person must confirm: whether a privacy
   notice is required at all; who the data controller is (the school, or this
   project); the lawful basis; retention; and whether a cookie/storage notice is
   needed for the wallet kit's `localStorage` keys.
2. **Whether to publish a privacy contact at all.** No contact has been
   invented and none will be. If one is wanted, Tim must supply the address and
   agree that it may be public and scraped.
3. **Whether a student-data policy beyond the on-chain rule is needed.** The
   project's rule is that only opaque references go on-chain, and the off-chain
   mapping is held by the school. Whether the project also needs its own written
   policy, and whether a pilot school must sign something before the first
   deployment, is a decision for Tim, not for the code.
4. **The dependency posture on the wallet kit.** `npm audit` reports 19
   advisories (13 low, 6 moderate), all reached through
   `@creit.tech/stellar-wallets-kit` (which pulls multi-chain wallet SDKs: NEAR,
   Solana, `elliptic`, `uuid`, `stream-json`). None of the flagged packages is
   part of the app's own code, and the only non-breaking fix is a downgrade.
   Decide: accept and document the risk, wait for an upstream release, or drop
   to a narrower wallet module set (which would also cut the ~1 MB bundle).
   Draft `17` in the app repo tracks it; the choice is a security decision.
5. **Wallet choice for the pilot, and whether remote wallet icons are
   acceptable.** Opening the wallet picker fetches icons from
   `https://stellar.creit.tech` (and two other hosts, see audit `06`), which
   contradicts the README's "no request other than the RPC endpoint" claim.
   Decide whether to accept that, or to configure the kit with a narrower,
   local-icon module set. Draft `15` tracks it.
6. **Who holds which key at deployment** (admin, school, payer) and what happens
   if the school's key is lost. The contract has no upgrade path, no pause and
   no admin power, so this is a policy decision with no code escape hatch.
   `docs/DEPLOYMENT_CHECKLIST.md` lists the placeholders.
7. **Whether any deployment is legal before a written pilot agreement exists.**
   The repo rule is that a real school or tutorial centre must have agreed.
   Whether that agreement must be written, and what it must say, is Tim's call.

## 10. Artefacts this task added, and where each gap went

| Gap | Resolution |
|---|---|
| No PRD | `schoolfees-docs/src/prd.md` |
| No legal/privacy checklist | `schoolfees-docs/src/legal-compliance.md` (+ decisions 1–3 above) |
| No security doc for the contract or the app | `schoolfees-contracts/docs/SECURITY.md`, `schoolfees-app/docs/SECURITY.md` |
| No testing doc | `docs/TESTING.md` in all three repositories |
| No deployment checklist | `docs/DEPLOYMENT_CHECKLIST.md` in contracts and app |
| No architecture doc for the contract repo | `schoolfees-contracts/docs/ARCHITECTURE.md` (pointer, no duplication) |
| No design or accessibility doc | `schoolfees-app/docs/DESIGN_GUIDELINES.md`, `docs/ACCESSIBILITY.md` |
| No production-quality checklist | `schoolfees-app/docs/PRODUCTION_QUALITY.md` |
| No dependency register | `schoolfees-app/docs/RESOURCES.md` |
| No Git discipline for outside contributors | all three `CONTRIBUTING.md` |
| No "from the arsenal" section for the next project | `schoolfees-docs/TEMPLATE.md` §5 |
| Docs repo `.gitignore` gaps | `schoolfees-docs/docs/issue-drafts/04-docs-gitignore-hygiene.md` |
| Error wording quoted in the book is not checked automatically | recorded in `src/todo-verify.md`; the docs freshness draft (`03`) covers cited names, not quoted wording |
| App gaps found in the audits | app drafts `10`–`19`, each named in `ROADMAP.md`: refresh after a write (`10`), bounded RPC retries and timeouts (`11`), URL routing (`12`), duplicate-submission guard (`13`), focus management on page change (`14`), the outbound-request claim (`15`), favicon and social metadata (`16`), wallet-kit advisories (`17`), simulated reads never extending a record's life (`18`), and the unused `mapContractError` export (`19`) |
