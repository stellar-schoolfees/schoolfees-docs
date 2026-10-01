# Audit — Design review (2026-10-01)

Report only. **No code was changed by this audit.**

Prompt used: `build-arsenal/06-ai-agent-prompts/08-design-review.md` — *"Compare
implementation against DESIGN_GUIDELINES.md. Flag generic patterns, inconsistent
spacing, weak hierarchy, fake proof, clutter, and broken responsive behavior."*

## 1. Scope, and the standard it was reviewed against

The app (`schoolfees-app`) against its own
[`docs/DESIGN_GUIDELINES.md`](https://github.com/stellar-schoolfees/schoolfees-app/blob/main/docs/DESIGN_GUIDELINES.md),
which was written from this codebase on the same day, plus the Build Arsenal design
system files that apply (`DESIGN_GUIDELINES_TEMPLATE`, `TOKENS`, `TYPOGRAPHY`,
`COMPONENTS`, `MOTION`) and the `PRODUCTION_QUALITY_TEMPLATE`.

**A browser was run**, so layout, hierarchy and spacing were judged from rendered
pages, not from the stylesheet alone:

| Method | Detail |
|---|---|
| Build | `npm run build`, then `vite preview` on `127.0.0.1:5201` |
| Viewports | **390×844** (reference phone) and **1280×900** |
| Measurement | `getBoundingClientRect()` for every visible button; `scrollWidth` vs viewport; element counts; the shape and order of every section |
| Static reading | `index.html`, `src/index.css` (all 500 lines), every component and page |

## 2. What passed

| Check | Evidence |
|---|---|
| **No framework starter content** | no `src/assets/`, no `vite.svg` / `react.svg` reference, no starter copy; the shell is the real app (`p.app-title` "schoolfees") |
| **No fake proof** | no testimonials, no user counts, no partner logos, no ratings, no statistics, no "trusted by" — verified by reading every rendered string |
| **No generic AI-product patterns** | no chat bubbles, no sparkles, no gradient CTA, no skeleton loaders, no "coming soon" |
| **No decorative clutter** | one card shape, one notice shape, one badge shape; the only "decoration" is a thick left border on notices that carries meaning |
| **Restrained motion** | colour transitions only; `prefers-reduced-motion` disables them |
| **Tokens, not ad-hoc values** | one `:root` block: neutral ramp, one accent, one tone per status, radius, two shadows, one max width, one padding unit |
| **Typography** | system font stack (no web font, no font licence, no third-party font request); one body size; `clamp()` for `h1`; mono where a value must be copied |
| **Hierarchy** | exactly one `h1` per page, `h2` only inside cards; the status badge sits in the fee's heading; secondary copy is smaller and muted |
| **Responsive at 390px** | `scrollWidth` 374 vs viewport 390 — no horizontal overflow; nav wraps; actions go full-width; long mono values wrap with `overflow-wrap: anywhere` |
| **Responsive at 1280px** | content is centred in a 46rem column, the banner spans the full width and sticks to the top; deliberately narrow reading measure |
| **States exist** | hover, focus, disabled and error are all styled; loading is a label swap (`Loading…` / `Connecting…`) with a disabled control; "connect a wallet first" is a designed state on every page that needs it |
| **Honest content** | the footer, the "What has not happened yet" card and the reference warning all state limits plainly — the design supports the project's honesty rules rather than working against them |

## 3. Verified issues

### DR-01 — The Home page offers the connect control three times

- **Severity: medium** (design and accessibility; the most visible flaw in the app)
- **Files:** `schoolfees-app/src/App.tsx:58` (the header's `WalletBar`),
  `schoolfees-app/src/pages/ConnectPage.tsx:22` (a second `WalletBar` on the page
  itself), `:24` (the `ConnectPrompt`)
- **Measured in the rendered Home page:**
  - `.wallet-bar` elements: **2**; visible `Connect wallet` buttons: **3**, at
    y≈124 (141×46, in the header), y≈540 (342×46, in the page), y≈768 (303×46, in
    the prompt card).
  - On the other four pages the count is **2** (header + prompt), which is defensible.
- **Why it matters:** three identical actions at three vertical positions inside one
  screen is the opposite of a clear primary action. The middle one is a duplicate
  that exists because the page re-renders a control the shell already renders, and
  it sits immediately above a card that does the same job again. For a screen
  reader it is also three identical "Connect wallet" buttons, announced once each.
- **Suggested fix:** drop the `WalletBar` from `ConnectPage` entirely (the shell's
  header instance is always visible), and keep exactly one prominent in-page
  affordance — the prompt card — so the page has one clear call to action. If the
  wallet state is wanted inside the page, render a *status* rather than a second
  control.
- **Tracked as:** recorded in the app's `docs/DESIGN_GUIDELINES.md` §7 (known
  deviations). Small enough to ride with the focus work in
  `issue-drafts/14-focus-management-on-page-change.md`, which touches the same
  shell; **no separate draft**, to avoid a filler issue for a deletion.
- **Status:** Not fixed — three `Connect wallet` buttons are still present on the Home page (header, page, and prompt card).

### DR-02 — A view is not a URL, so nothing can be shared, linked or reloaded into

- **Severity: low** (high value for a pilot, though: a school's first instinct is to
  send someone a link)
- **File:** `schoolfees-app/src/App.tsx:33` (`useState<PageId>`), `:63-83`
- **What happens:** the five views are React state. There is no path per view, the
  browser's back button leaves the app, reloading returns to Home, and there is one
  `<title>` for the whole app. This is the one Flowtick section (routing and
  metadata) that is simply not implemented.
- **Why it matters for this product:** "send the family a link to their fee" is a
  natural need, and today it is impossible. It also blocks per-view titles and a
  branded not-found view, and it will need a host rewrite rule the moment it lands.
- **Suggested fix:** real paths with `popstate` handling, per-view titles, a
  branded unknown-path view, and the documented host rewrite. `docs/PRODUCTION_QUALITY.md`
  §1–§2 and `docs/DEPLOYMENT_CHECKLIST.md` §5 already say what will become required.
- **Tracked as:**  `schoolfees-app/docs/issue-drafts/12-url-routing-and-deep-links.md`.
- **Status:** Not fixed — no URL routing; views remain React state.

### DR-03 — The initial bundle is about 1 MB, on a mobile-first app

- **Severity: low**
- **Evidence:** the production build reports
  `dist/assets/index-DlLH7UZT.js 1,045.82 kB │ gzip: 263.24 kB`, with Vite's own
  warning that chunks exceed 500 kB. Rendered pages work fine on the machine that
  measured them; the concern is a phone on a slow connection, which is exactly the
  audience.
- **Why it matters:** the design promise is "calm and fast on a phone"; 263 kB
  gzipped before the wallet kit's own lazy needs is a first-paint cost, and the kit
  is the cause (its multi-chain module set — see audit 06, SEC-01 and SEC-02, which
  propose the same fix).
- **Suggested fix:** code-split the wallet kit so the initial page does not pay for
  it, and narrow the module set to Stellar wallets while doing so.
- **Tracked as:** `schoolfees-app/docs/issue-drafts/02-code-split-wallet-kit.md`
  (and SEC-01's draft 17 for the dependency half).
- **Status:** Partially addressed in `29c6d13` — the wallet kit is narrowed to Stellar wallets, removing the multi-chain tree from the picker, but the initial bundle is still ~1 MB; code-splitting remains open in draft 02.

### DR-04 — No favicon, so a tab and a bookmark show a blank icon

- **Severity: low**
- **File:** `schoolfees-app/index.html` (no `<link rel="icon">`); there is no
  `public/` directory
- **Evidence:** the rendered page queries `link[rel*="icon"]: false`, and the
  browser falls back to requesting `/favicon.ico`, which the preview server has
  nothing to serve.
- **Why it matters:** pilot participants will have this open in a browser next to
  other tabs; an unbranded, unidentifiable tab is a small but real polish miss, and
  the fix needs no domain.
- **Suggested fix:** add a local SVG favicon linked from `index.html`.
- **Tracked as:**  `schoolfees-app/docs/issue-drafts/16-favicon-and-social-metadata.md`.
- **Status:** Fixed in `1034b5b` — `public/favicon.svg` added and linked from `index.html`.

### DR-05 — A write leaves the summary visibly unchanged

- **Severity: low** for design (medium as a code issue — see audit 05, CR-01)
- **Files:** `schoolfees-app/src/pages/PayPage.tsx:69-97`,
  `schoolfees-app/src/pages/SchoolActionsPage.tsx:73-104`
- **What happens:** after a payment, refund or close, the fee summary above the form
  keeps the pre-action numbers. Visually nothing confirms that the record changed
  except the success notice further down; the "Still owed" figure stays as it was.
- **Why it matters as design:** the screen's own story ("here is what is owed")
  stops being true at exactly the moment the user most needs it to update.
- **Suggested fix:** re-read the fee after a successful write, or mark the summary as
  pre-action in plain words.
- **Tracked as:**  `schoolfees-app/docs/issue-drafts/10-refresh-fee-data-after-a-write.md`
  (same finding as CR-01, not duplicated as a second draft).
- **Status:** Fixed in `cf9fbe0` — `PayPage` and `SchoolActionsPage` now re-read the fee after a successful write so the summary updates to post-transaction values (same fix as CR-01).

## 4. Observations that are not defects

Recorded so they are not "discovered" later as complaints:

- **The nav wraps at 390px**: four pills on the first row and "School actions" alone
  on a second (measured y=187 and y=243). It is tidy and readable; no action needed.
- **The banner is static on phones and sticky from 48rem up.** Measured
  `position: static` at 390px with the banner at the top of the flow; the CSS rule
  is deliberate and the comment explains why (it must not eat a phone's reading
  area).
- **The reading column is deliberately narrow (46rem)** on desktop. It leaves a lot
  of empty space at 1280px, which suits a form-and-record app.
- **Placeholders exist alongside real labels.** Redundant by design; see audit 07
  A11Y-04 for the contrast consequence.
- **The status badge's explanation is only in a `title`** — a real issue, but filed
  under accessibility (audit 07, A11Y-02) rather than duplicated here.

## 5. Metadata and production polish: what is deliberately deferred

Not gaps in the work, but decisions waiting on something real. None of them invents
a value:

| Item | Waiting for |
|---|---|
| canonical URL, `robots.txt`, `sitemap.xml` | a real domain, which does not exist |
| Open Graph / social card | an absolute public URL |
| per-view titles and descriptions | routing (`12`) |
| branded 404 | routing (`12`), and a host that serves SPA rewrites |
| source maps | a deliberate decision; none are shipped today, which is the right default for this app |
| hosting, cache headers, TLS, security headers | the host choice, which is the maintainer's (`DEPLOYMENT_CHECKLIST.md` §5, §7) |

## 6. What was NOT checked

- **Everything behind a wallet connection.** With no wallet connected, four of the
  five pages could only show the connect prompt; the fee summary, the forms, the
  error notices and the transaction result were **never rendered**, so their
  spacing, hierarchy and responsive behaviour were read but not seen. This is the
  single biggest limitation of this review.
- **The error, loading and empty states in their real conditions** — a real
  rejection, a real RPC failure, an archived record.
- **Any real content**: no fee exists, so no amounts, dates, references, hashes or
  explorer links were ever displayed at their true lengths.
- **Cross-browser rendering.** Chromium only. Firefox, Safari and iOS Safari were
  not run, and `clamp()`, `:focus-visible` and sticky positioning are exactly the
  properties worth checking there.
- **Performance measurement as a user feels it.** No Lighthouse, no throttled
  network, no Core Web Vitals, no first-paint timing. Only the bundle size is known.
- **Dark mode.** The app declares `color-scheme: light` and ships one light palette;
  no dark theme exists and none is claimed.
- **The mdBook's own visual design**, the other four Drips repositories, and any
  future deployed host — all out of scope for this task.
