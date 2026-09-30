# Introduction

`schoolfees` is a small pilot that lets a school or tutorial centre record a fee
obligation on the Stellar test network and let families settle it, without
putting anyone's personal details on a public ledger.

This book is the documentation for the project, written for two kinds of reader:

- **School or centre staff and parents** who want to know what the tool does,
  what it does not do, and what it costs them in trust.
- **Developers and reviewers** who want to check the claims against the real
  code.

You do not need to be a developer to read the first, second and last sections.
Every technical term is explained the first time it appears.

## The problem

Paying school fees in person means cash, paper receipts, and a record that only
exists in one office. When a parent and a school disagree about what has been
paid, neither side has a shared, tamper-evident record. `schoolfees` records
each fee and each payment as a fact that both sides can read from the same
public ledger.

## The three repositories

| Repository | What it is | Status |
|---|---|---|
| [`schoolfees-contracts`](https://github.com/stellar-schoolfees/schoolfees-contracts) | The Soroban smart contract, in Rust | Implemented, testnet only, not deployed |
| [`schoolfees-app`](https://github.com/stellar-schoolfees/schoolfees-app) | The small web app (wallet flow) | Not built yet |
| [`schoolfees-docs`](https://github.com/stellar-schoolfees/schoolfees-docs) | This book | This is what you are reading |

## Background terms

- **Stellar** is a public blockchain network. Transactions are public and
  permanent.
- **Soroban** is Stellar's smart-contract platform. A **contract** is a small
  program that runs on the network and owns its own storage.
- **Testnet** is Stellar's practice network. It is not the real ("mainnet")
  network, the tokens on it have no value, and the network can be reset. Nothing
  here touches mainnet.
- A **token** is an on-chain asset. Amounts in this project are denominated in a
  token the school chooses at the time it records a fee.
- An **address** is a public key. It is public, it is not a name, and it is the
  only identifier this project uses for a school or a payer.

## What this project is not

- It is **not deployed**. There is no contract address to try yet, on purpose:
  nothing is deployed until a real school or tutorial centre has agreed to try
  the flow. See the [pilot playbook](pilot-playbook.md).
- It **never holds money**. Payments move directly from a payer's token balance
  to the school's token balance, executed by the token contract. The fee
  contract only records the obligation and its history.
- It is **not a live product**. No pilot has happened yet, so nothing in this
  book is backed by evidence from real users. The
  [known limitations](limitations.md) page says exactly what that means.

## How to read this book

1. [Quickstart](quickstart.md) — how to run the real checks yourself today.
2. [Architecture](architecture.md) — what the contract does, point by point.
3. [Known limitations](limitations.md) — what is not proven, stated plainly.
4. [Threat model](threat-model.md) — a STRIDE walk-through of the risks.
5. [Pilot playbook](pilot-playbook.md) — how a pilot will be run, and when.
6. [Pilots](pilots/README.md) — the record of real pilots (currently: none).
7. [FAQ](faq.md) — short answers to common questions.
