# schoolfees — docs

The documentation for `schoolfees`, written as an [mdBook](https://rust-lang.github.io/mdBook/).
`schoolfees` is a Stellar/Soroban pilot that records a school fee obligation
against an opaque reference and lets payers settle it, without personal data
ever going on-chain. **Testnet only. Nothing is deployed, and no pilot has
happened yet.**

Part of the schoolfees project, which is three repositories:
[`schoolfees-contracts`](https://github.com/stellar-schoolfees/schoolfees-contracts)
(the Rust contract), `schoolfees-app` (the web app, not built yet) and this one.

## The book

| Page | What it covers |
|---|---|
| [Introduction](src/introduction.md) | What the project is, in plain language |
| [Quickstart](src/quickstart.md) | How to run the real checks yourself today |
| [Architecture](src/architecture.md) | The contract, point by point, from the real code |
| [Known limitations](src/limitations.md) | What is not proven and not handled |
| [Threat model](src/threat-model.md) | A STRIDE walk-through, with honest gaps |
| [Pilot playbook](src/pilot-playbook.md) | How a pilot will be run, and the deployment gate |
| [Pilots](src/pilots/README.md) | The record of real pilots (currently: none) |
| [FAQ](src/faq.md) | Short answers to common questions |

## Working on the book

```bash
node scripts/check-links.mjs   # every link and every SUMMARY entry resolves
node --test                    # tests for the link checker
```

CI runs both of those, then installs mdBook and runs `mdbook build`
(`.github/workflows/docs.yml`). mdBook is deliberately **not** installed on the
maintainer's machine, so the book build is verified in CI only.

To preview the book locally you need mdBook:

```bash
cargo install mdbook
mdbook serve --open
```

## Layout

```text
├── book.toml                 # mdBook configuration
├── src/
│   ├── SUMMARY.md            # table of contents
│   ├── introduction.md
│   ├── quickstart.md
│   ├── architecture.md
│   ├── limitations.md
│   ├── threat-model.md
│   ├── pilot-playbook.md
│   ├── faq.md
│   └── pilots/               # one real pilot per file; a note until then
├── scripts/
│   ├── check-links.mjs       # link + SUMMARY checker (no dependencies)
│   └── check-links.test.mjs  # its tests
├── docs/issue-drafts/        # drafts for contributors (never created on GitHub for you)
├── AGENTS.md                 # rules for AI agents working in this repo
└── ROADMAP.md                # what is next, and what is deliberately not built
```

## Rules this book follows

The full set is in [AGENTS.md](AGENTS.md). The short version:

- Describe only what the code does. Anything not built is marked as such.
- Every technical claim points at a real file, function, test or command in
  `schoolfees-contracts`.
- Never invent addresses, transaction hashes, testers, schools or outcomes. No
  pilot is recorded until it really happens.
- Never put personal data in examples — only obvious placeholders such as
  `ref_0001`.
- Never soften the pilot-evidence boundary or the production boundary.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). The plan for what comes next is in
[ROADMAP.md](ROADMAP.md).

## License

MIT — see [LICENSE](LICENSE).
