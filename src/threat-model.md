# Threat Model

A first, honest pass for the v0 contract. It is written to be reviewed before a
pilot, not to reassure anyone. Where a category does not apply, it says why
rather than being skipped. This model covers the **contract**; the app does not
exist yet and is covered only as a named gap.

## Assets

| Asset | Why it is worth attacking |
|---|---|
| The school's token balance | It receives real (testnet) value; `refund` can move it out. |
| The payer's token balance | `pay` moves tokens out of it. |
| The integrity of a fee record | If totals or the `closed` flag could be forged, the shared record becomes worthless. |
| The opacity of the reference | A reference that leaks a name, phone number or id would put personal data on a permanent public ledger. |
| The school's ability to be recognised | Because anyone can create a fee, a convincing fake fee can borrow a real school's credibility — or damage it. |
| The project's reputation | A pilot that misrepresents what the contract proves would be worse than no pilot. |

## Adversaries

- **A malicious or careless payer** — pays the wrong address, overpays, or
  claims a payment that happened is theirs.
- **A malicious or careless school** — creates fees that are not real, refuses
  legitimate refunds, or misuses the reference field.
- **A stranger with no special access** — creates spam fees, or creates a fee
  addressed to look like a known school.
- **The administrator of the contract** — holds the `Admin` address recorded by
  `initialize`.
- **Anyone who can read the ledger** — every record and event is public.

## STRIDE walk-through

### Spoofing — acting as another address

- **Applies.** Signatures are the only identity mechanism. `src/fee.rs`
  calls `Address::require_auth` on the school in `create_fee`, `close_fee` and
  `refund`, and on the payer in `pay`. Without a valid signature from that
  address, the host rejects the invocation before the contract logic runs
  (`src/test.rs::create_fee_requires_the_school_signature`,
  `pay_requires_the_payer_signature`, `close_fee_requires_the_school_signature`,
  `refund_requires_the_school_signature`,
  `pay_rejects_a_signature_from_someone_other_than_the_payer`).
- **Mitigation is real but partial.** The contract cannot tell whether an
  address *is* a school, so spoofing at the identity layer is not solved:
  anybody can create a fee and present it as a school's. The payer must verify
  the school's address, token, reference and amount out of band. This is the
  single most important limitation for a real pilot, and it is stated again in
  [known limitations](limitations.md).
- **Not applicable:** there is no username, email or session to hijack — the
  contract has no accounts of its own.

### Tampering — changing stored data

- **Applies, and is contained.** Only this contract's code can write its
  storage; there is no external writer, no admin override and no update
  entrypoint. The `reference` index is written once and never moved, so a
  duplicate cannot be forged. `closed` goes one way and is checked before any
  change, so a closed fee's totals cannot move
  (`src/error_paths.rs::error_path_fee_closed`).
- **Not applicable:** there is no client-side state that matters. A client can
  display anything it likes, but it cannot change what the ledger says. Once the
  app exists, only the app's *display* becomes tamperable, not the record.

### Repudiation — denying an action afterwards

- **Applies, partially mitigated.** Four events (`FeeCreated`, `FeePaid`,
  `FeeRefunded`, `FeeClosed`) plus the token contract's own `transfer` events
  give a public trail; their layouts are in `docs/events.md` and asserted in
  `src/test.rs::lifecycle_publishes_documented_events`. Anyone can replay them
  from the ledger.
- **Not mitigated.** There is no indexer in this project, so today nobody
  *automatically* reconstructs a fee's history from events; a party would have
  to query the ledger. Events are also not a substitute for identity: because
  the contract does not bind an address to a person, someone can deny being the
  person behind an address, and the contract cannot settle that dispute. On
  testnet the whole trail can be erased by a network reset.
- **Not applicable:** no "who created this fee" claim is stored beyond the
  school address, so there is no separate authorship claim to repudiate.

### Information disclosure — private data becoming public

- **Applies by design.** Everything on a public ledger is public: addresses,
  totals, due dates, payment and refund amounts, and every event. The only
  non-numeric free-form field is the `reference`, and the contract **cannot**
  check what is in it. If a client puts a name, phone number, id or anything
  about a child into those 32 bytes, that data is on the ledger forever.
- **Mitigation is procedural, not enforced.** The rule is to hash an off-chain
  identifier before calling, as stated in `src/types.rs`, `AGENTS.md`, and the
  [privacy note in the quickstart](quickstart.md#about-the-reference). Nothing
  in the code prevents a mistake, which is exactly why it is listed as a
  limitation.
- **Not applicable:** the contract holds no secrets, no keys and no private
  configuration, so there is no secret for it to leak.

### Denial of service — one user blocking others

- **Mostly not applicable, and why.** The contract has **no loops and no
  lists**. Every function does a keyed lookup (`DataKey::Fee`, `DataKey::Payer`,
  `DataKey::Reference`) and returns; `src/storage.rs` and
  [architecture §3](architecture.md#3-core-protocol-objects) describe the keys.
  There is therefore no unbounded iteration for one caller to blow up, and fees
  are independent entries, so one school's activity cannot slow another's calls.
- **Applies, in three narrow ways.**
  1. **Spam.** Anyone can create fees without limit, bloating contract storage.
     The caller pays the transaction fees for what it writes, so the abuse is
     bounded by cost, but it is not prevented.
  2. **Archival.** A fee nobody touches can archive after roughly
     `due_at + 30 days`, and v0 has no restore user interface. The TTL policy
     (top up toward the deadline plus a 30-day margin, 7-day floor) reduces the
     risk; every read and write re-extends the entries it touches
     (`src/storage.rs` in `schoolfees-contracts`). It does not eliminate the
     need for manual recovery of a long-idle record.
  3. **A hostile or broken token.** If the school picks a token whose contract
     fails or is malicious, `pay` and `refund` fail. The fee's own storage is
     unaffected, but the fee cannot be settled.
- **Not applicable:** no cross-contract call besides the token transfer, and no
  recursion, so there is no reentrancy-style DoS against the fee logic.

### Elevation of privilege — a non-admin performing an admin action

- **Not applicable, and that is deliberate.** The only privileged thing in the
  contract is the `Admin` address recorded by `initialize`, and **no fee
  function consults it** (`initialize` and `admin` live in `src/lib.rs`;
  `src/fee.rs` never reads `DataKey::Admin`). There is no admin-only entrypoint
  to escalate into. Compromising the administrator key would only let the
  attacker read `admin()` and emit `Initialized` once on a fresh instance.
- **Consequence for the pilot:** because the admin has no power, the contract
  also has no way to intervene — no pause, no fix, no removal of a bad fee. That
  is a limitation of the design, not a privilege path.

## Out of scope (honest limits)

This model does **not** cover:

- **Front-running or transaction-ordering games.** On a public network, someone
  can see a payment coming. Nothing in v0 depends on ordering for safety, but no
  analysis has been done.
- **Key management and wallet compromise.** If a school's or payer's signing key
  is stolen, the thief can sign as them. The contract cannot help.
- **The `schoolfees-app`.** It is not built. When it exists, it will need its own
  review for phishing, misleading display, error handling and reference
  generation.
- **The token contract.** Its security is not this project's to analyse; this
  contract trusts whatever SEP-41 token the school names.
- **Social engineering.** Given open fee creation and no registry, the most
  likely real-world attack is a person being persuaded to pay a fee that is not
  theirs, or to the wrong address. The contract cannot detect this; only
  out-of-band verification by the payer can.
- **Network-level attacks** on Stellar itself, and anything specific to mainnet
  — this project is testnet only.
