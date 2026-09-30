# Pilot readiness

What must be true before the first testnet deployment. Every item is marked
**Done** or **Not done**. Most are **Not done**, and that is the honest state of
this project: the code and the book are finished, and nothing has been deployed.

Nothing on this page is a promise or a plan with a date. It is a checklist for
the maintainer, and it is here so that "ready" means something specific.

## 1. The pilot agreement

- [ ] **Not done.** A real school or tutorial centre has agreed to try the flow.
      No agreement exists. This is the gate: nothing is deployed before it.
- [ ] **Not done.** At least one named contact at that school who will act as
      the school side of the flow, and who knows which fee reference belongs to
      which student.
- [ ] **Not done.** A short written record of what was agreed, including how the
      participant has agreed to be named (a name, the group's name, or neither).
      The [pilot playbook](pilot-playbook.md) has the rules for that record.

## 2. Keys and accounts

- [ ] **Not done.** Decide which address is recorded by `initialize(admin)`, and
      who holds its key. (In v0 the admin has no power over fees — no fee
      function reads it — but the address still has to exist.)
- [ ] **Not done.** Decide which address is the **school**: it creates fees,
      receives every payment, authorises refunds and closes fees. Its key must
      be held by the school side, not by the maintainer.
- [ ] **Not done.** Decide which address is the **payer** for the pilot, and
      confirm the payer holds its own key.
- [x] **Done (as a rule).** All keys are testnet keys, and the project never
      asks for, stores or logs a secret key or seed phrase (`AGENTS.md`,
      `src/lib/wallet.ts`; the deploy script reads `STELLAR_ACCOUNT`, and the
      wallet signs).

## 3. Token and funding

- [ ] **Not done.** Choose the exact SEP-41 token the fees will be denominated
      in, and record its contract address. There is no whitelist: the school
      names any token, so the choice must be checked out of band.
- [ ] **Not done.** Confirm the school account **holds that token**. A refund is
      paid from the school's own balance, so without tokens the school cannot
      refund anything.
- [ ] **Not done.** Confirm the payer account has enough of that token for the
      pilot amounts, plus testnet XLM for transaction fees.
- [x] **Done (as a rule).** Testnet only; testnet tokens have no value and the
      network can be reset. The app pins the testnet passphrase and refuses
      other networks.

## 4. Wallet and network

- [ ] **Not done.** Choose the wallet to test. No wallet has ever connected to
      this app, so nothing about signing is proven yet (see
      [todo: verify](todo-verify.md)).
- [ ] **Not done.** Connect with that wallet, confirm it reports testnet, and
      sign one real transaction from it.
- [ ] **Not done.** Confirm a participant can install and use that wallet on the
      device they will actually use.
- [ ] **Not done.** Confirm the RPC endpoint and explorer base the app will use.
      `.env.example` documents placeholder values; none has been exercised.

## 5. Deployment

- [ ] **Not done.** Clear the gate in section 1, then run
      `schoolfees-contracts/scripts/deploy-testnet.sh` with `PILOT_CONFIRMED=yes`
      as the maintainer. The script exists and has never been run.
- [ ] **Not done.** Set `VITE_CONTRACT_ID` (and the network/explorer values) for
      the app, locally and in any deployment environment. `.env` is never
      committed.
- [ ] **Not done.** Record the real contract id and explorer links in this book,
      and in the app's README. Only real values, never invented ones.
- [ ] **Not done.** Decide what happens on the day a pilot participant finds a
      contract bug: there is **no upgrade path and no pause** in v0, so the only
      options are to stop using the instance and deploy a new one.

## 6. What stays off-chain, and where it lives

- [ ] **Not done.** Agree where the school keeps the mapping from an opaque
      reference to a student — its own records, paper or school system. That
      mapping is never on-chain and never in this project's repos.
- [x] **Done (as a rule).** Only an opaque 32-byte reference goes on-chain. The
      contract cannot check what is inside it, so this is a client
      responsibility; the app accepts 64 hexadecimal characters and warns in
      plain words that names, phone numbers, emails and student ids must never
      be entered (`src/lib/reference.ts`, `AGENTS.md`).
- [x] **Done (as a rule).** Amounts, due dates and addresses are public by
      design, and that is stated in [known limitations](limitations.md).
- [ ] **Not done.** Confirm the people in the pilot understand, in their own
      words, which parts of the record are public.

## 7. Walking people through it

- [x] **Done (as a plan).** The method: give participants a real task rather than
      a tour, watch where they hesitate, and write down what did not work
      ([pilot playbook](pilot-playbook.md)).
- [ ] **Not done.** Plain-language pages a parent or staff member can follow:
      connect a wallet, record a fee, pay, refund, close. They do not exist yet
      (draft `02-app-and-pilot-documentation.md`).
- [ ] **Not done.** Decide who answers questions during the pilot, and what the
      participants are told to do if something looks wrong.

## 8. Stop conditions, agreed in advance

- [ ] **Not done.** Agree what ends the pilot early — for example a payment to
      the wrong address, personal data appearing in a reference, or the school
      asking to stop.

## 9. After the pilot

- [ ] **Not done.** Save the real testnet transaction links for every step.
- [ ] **Not done.** Write `pilots/{name}.md` from what actually happened,
      including what did not work, and only with the naming consent from
      section 1.
- [ ] **Not done.** Update [known limitations](limitations.md) and the
      [threat model](threat-model.md) with whatever the pilot revealed.
- [x] **Done.** The boundary the write-up must respect: a pilot is not evidence
      of safety, load, longevity or mainnet readiness, and it is not a security
      review ([pilot playbook](pilot-playbook.md)).

## Reading this page

If any item above is **Not done**, the first deployment is not ready. When every
box is ticked, the deployment still lands on testnet only: the
[production boundary](limitations.md#production-boundary) is a separate,
independent-review question that a testnet pilot does not answer.
