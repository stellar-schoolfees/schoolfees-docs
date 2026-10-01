# Pilot outreach

**This page is a template, not a record.** No school or tutorial centre has been
contacted about a pilot through this template yet, no agreement exists, and
nothing here should be read as saying a pilot has started. The
[pilot playbook](pilot-playbook.md) sets the rules a pilot must follow; the
[pilots directory](pilots/README.md) stays empty until a real pilot has run.

The outreach itself is the maintainer's job and happens outside this repository.
What is recorded here — only after it happens — is the fact of an agreement,
never a contact's personal details. Nothing on this page unlocks deployment by
existing; the [pilot gate](pilot-playbook.md#the-gate) is unlocked by a real
agreement, and [pilot readiness](pilot-readiness.md) tracks when everything
else is actually ready.

## What we are honest about up front

Any outreach message must state these plainly. If a note cannot include them,
it should not be sent.

- The contract has **never been deployed**, and the app has **never run against
  a deployed contract or a real wallet**. Every chain-facing behaviour is listed
  as unproven in [proven vs assumed](proven-vs-assumed.md).
- The contract is **not audited**, and the pilot runs alongside no security
  review ([known limitations](limitations.md)).
- Everything happens on **Stellar testnet** with tokens that have no real
  value. No real money moves, and there is no plan for mainnet in this phase.
- The software is built by one person with no organisation behind it.

## Open questions the school may want to take advice on

The outreach should flag these rather than answer them. They are phrased as
questions on purpose; none of them has been settled, and none of the answers
below is legal advice.

- Which data-protection rules apply to a fee record that links a school-internal
  student reference to payments — Nigerian NDPA 2023, another law, or none?
  The research notes in [legal and privacy checklist](legal-compliance.md) are
  **not verified by a qualified person**. `TODO(legal review)`
- If the reference is a hash of a student's real identifier, is that hash itself
  personal data in the school's hands, given the school keeps the mapping?
  `TODO(legal review)`
- Whether the pilot needs a written data arrangement before the first
  deployment, and who may be named in the pilot record. `TODO(legal review)`
- Children: if any payer or student is under 18, a school will want to check
  consent and verification expectations under its own obligations before taking
  part. This project stores no contact details and cannot advise on the law.
  `TODO(legal review)`

The school should verify every claim in the letter independently — against the
linked repository, and with its own advisers.

## The invitation, in one paragraph

> We built an open-source tool that lets a school record a fee on the Stellar
> testnet blockchain and a parent pay it from a crypto wallet, with the payment
> moving directly from the payer to the school and no intermediary holding the
> money. It is early, unaudited, testnet-only, and we would like to watch two
> or three real people — one staff member recording a fee, one or two payers —
> attempt the real flow, so we can learn what actually confuses people. Nothing
> is deployed until a school agrees, the school keeps every key that matters,
> and either side can end the pilot at any time for any reason.

## A letter that could be sent

Sent as-is, the letter below asks for nothing that has not been built and
promises nothing that has not been tested. Square brackets are placeholders;
nothing bracketed is real.

```text
Subject: Would you help us test a school-fees payment tool? (testnet pilot,
no real money)

Dear [name],

I am working on schoolfees, a small open-source project that records a school
fee on the Stellar blockchain (testnet) and lets a parent pay it from a wallet
app. The payment goes directly from the parent to the school; the tool itself
never holds funds, stores no contact details, and has no backend.

I am asking whether you would help with a short pilot. What it involves:

- One staff member records a real fee (a real amount, in testnet tokens) using
  a page we provide, and shares the fee reference with a payer as they would
  normally share bank details.
- One or two payers attempt to pay part of that fee from a wallet, the way
  they would in real life.
- I watch, without helping, note where people hesitate, and afterwards we talk
  for fifteen minutes about what worked and what did not.
- In total roughly one hour per person, on a day you choose, at your pace.

What you should know before deciding:

- Everything runs on testnet. The tokens have no value and no real money is
  involved anywhere.
- The software has never been used by anyone outside the project, and the
  smart contract is not audited. That is exactly why I am asking for your help
  rather than claiming it is ready.
- The app itself stores nothing about you: no names, no phone numbers, no
  email addresses. The fee record holds an amount, a date, a reference the
  school chooses, and wallet addresses. How data-protection law applies to
  your side of the flow is a question for your own advisers; I cannot advise
  on it, and I have flagged the open questions here:
  [link to the docs book].
- You keep control: the school holds the keys that create fees and refunds,
  either side can stop at any time for any reason, and we agree in writing
  beforehand what ends the pilot early and who may be named in the write-up
  (or whether anyone is named at all).

If this sounds interesting, I would be glad to walk you through the tool
itself first, with no commitment. And if you know another school or a tutorial
centre that might be a better fit, I would be grateful for an introduction.

[Name]
[Role — e.g. independent developer]
[Contact]
[Link to the public repository and documentation]
```

## After an agreement exists

When a school or centre actually agrees:

1. Record the **fact of the agreement** (date, that it exists, what ends the
   pilot early) — not the contact's details — and tick the pilot gate in
   [pilot readiness](pilot-readiness.md).
2. Only then does the maintainer deploy, following
   [the deployment checklist](https://github.com/stellar-schoolfees/schoolfees-contracts/blob/main/docs/DEPLOYMENT_CHECKLIST.md).
3. The pilot runs as the playbook describes, and the write-up lands in
   [pilots/{name}.md](pilots/README.md) afterwards, from what actually
   happened — including what did not work.

Nothing else changes because this template exists. An interested conversation,
a verbal "that sounds useful", and an agreement to try are all steps towards a
pilot, not evidence from one.
