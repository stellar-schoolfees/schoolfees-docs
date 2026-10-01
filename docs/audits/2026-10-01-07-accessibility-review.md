# Audit — Accessibility review (2026-10-01)

Report only. **No code was changed by this audit.** Each verified finding has a
draft; the items only a person can judge are listed in §6.

Prompt used: `build-arsenal/06-ai-agent-prompts/07-accessibility-review.md` —
*"Check keyboard navigation, labels, headings, focus, contrast, errors, alt text,
reduced motion, and mobile interaction. Report only verified issues."*

## 1. Scope, and how it was checked

Target: **WCAG 2.2 level AA**, as the app's `docs/ACCESSIBILITY.md` states.

Unlike a purely static review, **a browser was actually run**, so several items
below are measured rather than inferred:

| Method | Detail |
|---|---|
| Real page render | `npm run build`, then `vite preview` on `127.0.0.1:5201`, opened in the Chromium preview |
| Viewports | **390×844** (the project's reference phone) and **1280×900** |
| Runtime measurement | `getBoundingClientRect()` for every visible button, computed `scrollWidth` vs viewport, `document.querySelectorAll` for headings, live regions and focus targets, and `document.activeElement` before and after navigation |
| Contrast | the palette computed from the real hex values in `src/index.css` using the WCAG relative-luminance formula |
| Static reading | all of `src/` — components, pages, `index.css`, `index.html` |

The rendered page used the git-ignored `.env.local` placeholder contract id from
an earlier task, so the app rendered its real pages rather than the configuration
notice. Nothing was signed and no network call was made.

## 2. What passed, measured

Recorded so that the findings below are visibly a short list, not a summary:

| Check | Measurement |
|---|---|
| Horizontal overflow at 390px | `documentElement.scrollWidth` **374** vs viewport **390** — none |
| Heading structure | `h1, h2, h2` in order, exactly one `h1` per page |
| Landmarks | `<header>`, `<nav aria-label="Main">`, `<main id="main">`, `<footer>` all present |
| Skip link | present, `href="#main"`, target exists, visible on focus |
| `<html lang>` | `en` |
| Page title | `schoolfees (testnet)` |
| Body button size | every non-nav button measures **46px** tall (target ≥44) |
| Input size | 46px tall, full width, `inputmode` set where numeric |
| Live regions | the TESTNET banner is `role="status" aria-live="polite"`; field errors and notices use `role="alert"` |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables all transitions and animations |
| Alt text | there are **no images at all** in the app, so nothing is missing alt text |
| Colour contrast — text | ink on bg **16.11:1**; muted hint on white **7.69:1**; hint on bg **6.98:1**; field error **8.66:1**; all five status tones **7.2–9.5:1**; white on the accent button **6.70:1** |
| Colour contrast — banner | banner ink on `#7c2d12` **8.83:1**; the uppercase "TESTNET – NO REAL MONEY" tag **5.56:1** |
| Colour contrast — focus ring | `#1849a9` on white **8.19:1**, on `#f2f4f7` **7.43:1** — far above the 3:1 requirement |
| Colour never the sole signal | every status badge and notice carries words as well as a tone |

## 3. Verified issues

### A11Y-01 — Focus is not moved, and nothing is announced, when the page changes

- **Severity: medium**
- **Files:** `schoolfees-app/src/App.tsx:63-68` (the nav buttons and
  `onClick={() => setPage(item.id)}`), `:77-83` (the `<main>` that swaps)
- **Measured, in the rendered app:**

  ```
  before click : activeElement = BUTTON "View a fee"   (focused by the audit)
  after  click : activeElement = BUTTON "View a fee"   (unchanged)
  page changed : true  (h1 became "View a fee", aria-current moved)
  focus in main: false
  live regions : ["banner"]   (nothing else)
  ```

- **Why it matters:** a keyboard user who activates a nav item is left in the
  navigation, so the next Tab continues through the header instead of entering the
  page they just opened. A screen-reader user gets **no announcement at all** that
  the entire main region was replaced. This is a focus-order / change-of-context
  problem and it affects every navigation in the app.
- **Suggested fix:** on a page change, move focus to the new page's heading or
  `<main>` (with `tabIndex={-1}`), and announce the change politely. Keep the
  target free of a visible ring when the change came from a pointer click.
- **Tracked as:**  `schoolfees-app/docs/issue-drafts/14-focus-management-on-page-change.md`.
- **Status:** Fixed in `1911743` — `App.tsx` now moves focus to `<main>` (via `mainRef` + `tabIndex={-1}` on page change) and announces the change through an sr-only live region.

### A11Y-02 — A status badge's meaning is only in a `title` attribute

- **Severity: low**
- **File:** `schoolfees-app/src/components/StatusBadge.tsx:13`
  (`<span className={…} title={describeStatus(status)}>{status}</span>`)
- **What happens:** the badge renders the bare word — `Open`, `Paid`, `Overdue`,
  `Closed`, `Unknown` — and puts the explanation in `title`. A `title` is not
  reliably announced by screen readers, is not reachable by touch, and is not
  reachable by keyboard.
- **Why it matters:** the fee's state is the most important thing on the summary
  screen, and the sentence that explains it is the least accessible part of it.
- **Suggested fix:** put the explanation in visually-hidden text inside the badge
  (or an `aria-label`), keeping the `title` if it is still wanted for a mouse.
- **Tracked as:** part of `schoolfees-app/docs/issue-drafts/07-component-and-accessibility-tests.md`
  (which adds the automated check that would catch this class of issue) — recorded
  in the app's `docs/ACCESSIBILITY.md` §3 now that it is verified.
- **Status:** Fixed in `1911743` — `StatusBadge` now renders an sr-only `<span>` with the full `describeStatus(status)` text alongside the bare status word.

### A11Y-03 — Navigation pills are 40px tall, below the project's own 44px target

- **Severity: low**
- **File:** `schoolfees-app/src/index.css:232` (`nav button { min-height: 40px; }`)
- **Measured:** all five nav buttons report `height: 40` at 390px — Home 70×40,
  Create a fee 109×40, View a fee 98×40, Pay 52×40, School actions 126×40. Every
  other button measures 46px.
- **Why it matters, precisely:** this is **not** a WCAG 2.2 AA failure — 2.5.8
  requires only 24×24 CSS pixels, and 40px clears it. It is a failure against the
  project's own stated baseline in
  `schoolfees-app/docs/DESIGN_GUIDELINES.md` §6 and `docs/ACCESSIBILITY.md` §6
  ("touch targets at least 44×44px"). Two rules disagree; one should be changed.
- **Suggested fix:** either raise `nav button` to `min-height: 44px`, or amend the
  documents to say the target is 40px for chrome and 44px for primary actions, and
  say why.
- **Tracked as:** the app's  `docs/ACCESSIBILITY.md` §6 and
  `docs/DESIGN_GUIDELINES.md` §7 now record it; it is small enough to ride with
  A11Y-01's change if the maintainer prefers.
- **Status:** Fixed in `1911743` — `nav button` min-height raised from 40px to 44px to match the project's stated baseline.

### A11Y-04 — Placeholder text is about 2.58:1, below the 4.5:1 text minimum

- **Severity: low**
- **File:** `schoolfees-app/src/index.css:314-316`
  (`.field input::placeholder { color: var(--line-strong); }` → `#98a2b3`)
- **Measured contrast:** **2.58:1** on white, **2.34:1** on the page background.
  WCAG 1.4.3 requires 4.5:1 for normal text, and placeholder text is text.
- **Why the impact is low, honestly stated:** every field has a real `<label>` and
  a hint, so nothing is *only* available as a placeholder — no information is lost
  to a low-vision user. It is still a real deviation from the target.
- **Suggested fix:** use `--muted` (`#475467`, 7.69:1 on white) for placeholder
  text, or drop placeholders that only restate the label.
- **Tracked as:** recorded in the app's  `docs/ACCESSIBILITY.md` §4.
- **Status:** Fixed in `1911743` — placeholder color changed from `var(--line-strong)` to `var(--muted)` (7.69:1 on white), clearing the 4.5:1 minimum.

### A11Y-05 — Full hashes and addresses are available only through `title`

- **Severity: low**
- **Files:** `schoolfees-app/src/components/TransactionResult.tsx:24`,
  `schoolfees-app/src/components/FeeSummary.tsx:52-57,64-68`,  `schoolfees-app/src/components/WalletBar.tsx:20`

- **What happens:** a transaction hash, a school address, a token address and the
  connected wallet address are all shortened for display (`shorten(hash, 10)` etc.)
  with the full value in a `title` attribute.
- **Status:** Not fixed — full hashes and addresses are still available only through `title` attributes.
- **Why it matters:** `title` is not reliably announced and is unreachable on a
  touch device, so a screen-reader user reads a truncated value they cannot use.
  The impact is reduced because the token address has an explorer link and the
  transaction result links to the transaction — but the full hash is never
  available as text or as a copyable, screen-reader-readable value.
- **Suggested fix:** render the full value in visually-hidden text alongside the
  shortened one, or make the hash selectable/copyable text.
- **Tracked as:** recorded in the app's `docs/ACCESSIBILITY.md` §3.

### A11Y-06 — A write's result is rendered but never announced

- **Severity: low**
- **Files:** `schoolfees-app/src/components/TransactionResult.tsx:22-32`,
  `schoolfees-app/src/pages/PayPage.tsx:150-152`
- **What happens:** after a successful payment, refund or close, the result notice
  is inserted into the page as ordinary content. It carries no live region, so a
  screen-reader user is not told that the action succeeded, and focus stays on the
  button that started it. The only live region on the page is the TESTNET banner
  (measured above).
- **Why it matters:** the hash *is* the receipt; an unannounced success is the one
  thing that makes a repeated payment tempting.
- **Suggested fix:** wrap the result notice in a polite live region (or move focus
  to it), and do the same for the Create-a-fee fee-id notice.
- **Tracked as:** covered by the acceptance criteria of
  `schoolfees-app/docs/issue-drafts/14-focus-management-on-page-change.md`
  (announcement of dynamic changes), which is the natural place for it.
- **Status:** Not fixed — transaction results are still rendered as static content without a live region or focus move.

## 4. Static checks that also passed

- Every form control is a labelled `<input>` with `id`/`htmlFor`, and the hint and
  error are wired with `aria-describedby` plus `aria-invalid` and `role="alert"`
  (`src/components/Field.tsx:41-72`).
- Actions are real `<button type="button">`; navigation is a `nav` + `ul` + `li`
  structure with `aria-current="page"` on the active item.
- No `tabindex` other than the skip link and `main`; no dialogs, so no focus trap.
- No `outline: none` anywhere; focus is styled for buttons, links and inputs.
- No icon-only buttons and no images, so no missing accessible names of that kind.
- `prefers-reduced-motion` is honoured by a blanket rule, so nothing animates.
- The disabled state of every action is visible (opacity 0.55) *and* programmatic
  (`disabled` attribute on the button, `disabled` on the wrapping `fieldset`).

## 5. Not applicable to this app

Stated so that the absence of a check is not mistaken for a gap: no video or audio
(1.2.x, 1.4.2), no drag-and-drop or pointer gestures (2.5.1, 2.5.7), no time
limits (2.2.1), no authentication form or cognitive test (3.3.8), no CAPTCHA, no
orientation lock, no multi-column reflow, and no content that moves or blinks
outside the user's control.

## 6. What a person must check by eye

None of the following was done, and none can be settled by the tools used here.
This is the exact list for the maintainer:

1. **Screen-reader pass** (NVDA on Windows, VoiceOver on macOS): is the hint read
   before the error; is the fee summary comprehensible as a description list; does
   A11Y-02's badge explanation arrive now that it is noticed?
2. **Keyboard-only pass** on all five pages: tab order, visible focus, the skip
   link, and where focus lands after each navigation (expected today: A11Y-01).
3. **Tap comfort for the 40px nav pills** on a real phone, in daylight.
4. **Placeholder legibility** after A11Y-04 is addressed, and whether placeholders
   earn their place at all.
5. **200% zoom at 320px width** — not tested; expected to reflow, but unverified.
6. **Screen reader announcement of a real transaction result** — cannot be tested
   without a deployment.
7. **`prefers-reduced-motion` turned on at the OS level** — the CSS rule is there
   and correct; nobody has watched the app with it enabled.

## 7. What was NOT checked

- **A screen reader.** No assistive technology was run. ARIA wiring was verified by
  reading the DOM, not by listening to it.
- **An automated accessibility scan.** No axe, Lighthouse or pa11y run: none is
  installed, and nothing was installed. That automation is
  `schoolfees-app/docs/issue-drafts/07-component-and-accessibility-tests.md`.
- **Anything behind a wallet connection.** Without a connected wallet only the
  connect prompt renders on four of the five pages, so the forms, the fee summary,
  the error notices and the transaction result were **never rendered at all** —
  their markup was read, but not measured. This is the largest gap in this audit.
- **A real mobile device, touch, zoom, high-contrast mode, and Windows High
  Contrast.** Emulated viewport only.
- **The 320px breakpoint and 200% zoom.** The 390px case was measured; these were
  not.
- **Anything on-chain**, so no real error, hash or explorer link was ever shown.
- **The docs repo's mdBook output** (its default theme, keyboard navigation and
  contrast) and the other four Drips repositories, per the task's scope.
