# Contributing

Thanks for helping with the `schoolfees` documentation. This repository is a
small mdBook, and most contributions are corrections, clearer explanations, or
new pages that describe something the code really does.

**Read [AGENTS.md](AGENTS.md) first.** It is the rulebook for this repo, for
people and for AI agents alike. This page is a shorter orientation.

## Before you change anything

- **Testnet only.** Never write anything that suggests mainnet use.
- **Nothing is deployed and no pilot has happened.** Do not describe a
  deployment, a contract address, a school, a tester or a result that does not
  exist.
- **No personal data, ever.** Not in examples, not in links, not in commit
  messages. Use obvious placeholders such as `ref_0001`.

## Checks you can run locally

```bash
node scripts/check-links.mjs   # every link and every SUMMARY.md entry resolves
node --test                    # the link checker's own tests
```

Both run in CI (`.github/workflows/docs.yml`), followed by `mdbook build`. If
you want to preview the book locally, install mdBook yourself with
`cargo install mdbook` and run `mdbook serve`.

If you add a page, add it to `src/SUMMARY.md` — the link checker fails if a
SUMMARY entry has no page, and CI fails if the link checker fails.

## Writing rules

- **Describe only what the code does.** Mark anything unbuilt as "Not
  implemented yet".
- **Point at something checkable.** Every technical claim should name a file,
  function, test or command in `schoolfees-contracts` (or, later,
  `schoolfees-app`). If you cannot point at it, remove it or mark it
  `TODO(verify)`.
- **Quote error wording, never paraphrase it.** The user-facing message column
  of `ERRORS.md` in `schoolfees-contracts` is the single source of truth.
- **Plain language first.** Explain any Stellar or Soroban term the first time
  it appears; readers include non-developers.
- **Never soften the boundaries.** The pilot-evidence boundary and the
  production boundary in [limitations](src/limitations.md) stay as blunt as they
  are.
- **Do not invent investor-style material** (funding asks, hiring plans,
  competitive positioning) unless the maintainer asks for it.

## Commits

- Small commits with clear messages.
- No `Generated with ...` or co-author trailers.
- Do not rewrite history, change remotes, or push on someone else's behalf.

## Ideas and unimplemented work

Record unimplemented work in [ROADMAP.md](ROADMAP.md), and as a draft under
`docs/issue-drafts/` using the template in `AGENTS.md`. Do **not** open a GitHub
issue for it yourself — the maintainer decides what becomes an issue.

## Pilots

A pilot file (`src/pilots/{name}.md`) is written only after a real pilot, from
what actually happened, with real transaction links. Never add one in advance,
and never name a participant more specifically than they agreed to. See the
[pilot playbook](src/pilot-playbook.md).

## License

By contributing you agree your work is licensed under the MIT license in
[LICENSE](LICENSE).
