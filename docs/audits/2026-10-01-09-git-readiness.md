# Audit — Git readiness (2026-10-01)

Report only. **No file was changed by this audit**, and no finding below was
fixed here; each real finding has a draft.

Prompt used: `build-arsenal/06-ai-agent-prompts/09-git-readiness.md` — *"Run git
status, secret scan, build, and relevant tests. Check ignored/generated/debug
files. Do not commit until review is approved."*

## 1. Scope

The three repositories `schoolfees-contracts`, `schoolfees-docs` and
`schoolfees-app`: working-tree state, what is tracked, what is ignored, and
whether anything secret-looking exists in tracked files or anywhere in history.

## 2. What was checked, and how

| Check | Command |
|---|---|
| Working tree and branch | `git status --short --branch` in each repo |
| Tracked file inventory, filtered for build output, env files and key material | `git ls-files \| grep -Ei '(^\|/)(dist\|target\|node_modules\|coverage\|\.env\|test_snapshots)/?\|\.key$\|\.pem$\|secret'` |
| **Secret scan, tracked files** | `git grep -nIE 'S[A-Z2-7]{55}\|-----BEGIN\|(PRIVATE[_ ]?KEY\|SEED\|MNEMONIC\|API[_]?KEY\|SECRET[_]?KEY\|PASSWORD\|ACCESS[_]?TOKEN)\s*[:=]'` |
| **Secret scan, entire history** (every object on every ref) | `git log --all -p \| grep -nIE '<same pattern>'` |
| Ignore rules actually applied | `git check-ignore -v .env local.env node_modules/x dist/x target/x app.key .stellar/x` |
| Line-ending policy | contents of `.gitattributes` |
| Debug code | `grep -rnE 'println!\|dbg!\|eprintln!\|console\.log\|debugger'` over `src/` |
| History size | `git rev-list --count HEAD` |

The scan pattern covers Stellar secret seeds (`S` + 55 base32 characters), PEM
headers, and `KEY=`/`TOKEN=`-style assignments. It is a **pattern scan**, not a
proof of absence.

## 3. Result: no secret findings

| Repo | Tracked-file scan | Full-history scan |
|---|---|---|
| `schoolfees-contracts` (14 commits, 35 tracked files) | **no hits** | **no hits** |
| `schoolfees-docs` (9 commits, 28 tracked files) | **no hits** | **no hits** |
| `schoolfees-app` (10 commits, 75 tracked files) | **no hits** | **no hits** |

`schoolfees-app/.env.example` is the only match for the word `env` in any tracked
file, and it is a placeholder template with `YOUR_DEPLOYED_TESTNET_CONTRACT_ID` —
the file whose entire purpose is to be copied and never committed.

Also verified:

- **No build output is tracked**: no `dist/`, `target/`, `coverage/`,
  `node_modules/`, `book/`, `test_snapshots/` or `*.tsbuildinfo` in any index.
- **No untracked-but-committed surprises**: the ignored directories that *do*
  exist on disk (`schoolfees-app/dist/`, `node_modules/`, `schoolfees-contracts/target/`,
  `test_snapshots/`, `schoolfees-docs/book/` does not exist) are all correctly ignored.
- **No debug code**: `console.*`, `debugger`, `println!`, `dbg!` and `eprintln!`
  return **zero matches** across all three repositories' source trees.
- **No `unwrap()`/`expect()`** in the contract's non-test production modules
  (`src/fee.rs`, `src/lib.rs`, `src/storage.rs`), matching the rule in `AGENTS.md`.
  The release profile sets `overflow-checks = true` and `panic = "abort"`.
- **`.gitattributes`** is present in all three with `* text=auto eol=lf`, so the
  repository content is LF on every platform regardless of the machine's
  `core.autocrlf`.
- **History has never been rewritten** in any of the three: every repo has a
  single linear `main` with commits dated 2026-09-30/10-01, and no force-push
  evidence (no reflog inspection was possible on a fresh checkout — see §6).

## 4. Verified issues

### GR-01 — `schoolfees-docs/.gitignore` does not ignore env files or key material

- **Severity: low**
- **File:** `schoolfees-docs/.gitignore` (whole file, 9 lines)
- **What is missing:** `.env`, `.env.local`, `.stellar/`, `*.key`. Present today:
  `/book/`, `/node_modules/`, `.DS_Store`, `Thumbs.db`, `*.swp`.
- **Evidence:** `git check-ignore -v .env local.env .stellar/x app.key` inside
  `schoolfees-docs` prints **nothing** for any of them, while the same command in
  `schoolfees-app` reports `.gitignore:9:.env`, `:15:*.key` and `:14:.stellar/`,
  and in `schoolfees-contracts` reports `.gitignore:9:.env`, `:10:*.key` and `:6:.stellar/`.
- **Why it matters, honestly:** this repository has no code that reads an
  environment file, no CLI that writes `.stellar/` and no key of its own, so the
  realistic outcome is a contributor dropping a scratch file here by mistake
  rather than a leak. The project rule is nonetheless project-wide, and three
  repositories with three different answers is how a rule erodes.
- **Suggested fix:** add the four patterns with a short comment, copying the
  comment style from `schoolfees-app/.gitignore`.
- **Tracked as:**  `schoolfees-docs/docs/issue-drafts/04-docs-gitignore-hygiene.md`.
  Not fixed here: this audit is report-only.
- **Status:** Fixed in `53c158d` — `.env`, `.stellar/`, `*.key` added to `schoolfees-docs/.gitignore` with a comment matching the app's style.

### GR-02 — a pre-existing unstaged modification in the app repo

- **Severity: informational**
- **File:** `schoolfees-app/package-lock.json` (working tree, `M`)
- **Evidence:** `git status --short` in `schoolfees-app` reports `M package-lock.json`;
  the other two repositories are clean. The change is a net removal of ~70 lines
  of extraneous nested `typescript` entries under `@coinbase/cdp-sdk` and
  `@creit.tech/stellar-wallets-kit`.
- **Why it is recorded:** so that nobody later mistakes it for part of this
  task's work, and so the eventual commit is deliberate. It was **not** staged,
  reverted or inspected in detail by this audit — it predates it and belongs to
  the  maintainer.
- **Status:** Not fixed — informational; the pre-existing `package-lock.json` modification remains unstaged and untouched (belongs to the maintainer).
- **Suggested fix:** decide whether the lockfile change is wanted (if it came from
  a `npm install` with a different npm version, `npm ci` will surface the
  difference), then stage it by name as its own commit.

## 5. Housekeeping notes (not issues)

- Both `schoolfees-app/.env` and `schoolfees-app/.env.local` exist on disk and are
  ignored. **Neither was read by this audit** — `.env` contents are off-limits by
  rule. `.env.local` is documented elsewhere in this task as a git-ignored local
  preview file with a placeholder contract id.
- `schoolfees-contracts/test_snapshots/` exists on disk and is ignored, which is
  correct: `cargo test` regenerates it.
- The `.freebuff/` directory lives at the `Drips/` workspace root, outside all
  three repositories, so the Flowtick advice to ignore it does not apply inside
  any of them.

## 6. What was NOT checked

- **The reflog and any rewritten history before this clone.** A full-history
  content scan was done, but proving history was never rewritten would need the
  reflog or a remote audit, and no remote was contacted.
- **Remotes and hosted settings** (branch protection, who can push, whether any
  secret is set as a repository secret). Out of scope for a local audit and
  untouched by rule.
- **Other branches.** All three repositories have only `main`.
- **Binary files and large blobs.** The pattern scan is text-oriented; a secret
  stored inside a committed binary would not be matched.
- **`.gitignore` completeness beyond the named classes** (for example editor
  directories other than the ones listed).
- **The Git history of the other four Drips projects**, deliberately: they are
  out of scope for this task.
- **Build and tests.** The prompt also asks for a build and a test run; those are
  reported in Phase D of this task and were not re-run here.
