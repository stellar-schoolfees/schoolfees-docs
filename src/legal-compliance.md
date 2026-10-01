# Legal and privacy checklist

> **This is a project checklist, not legal advice.** Nobody qualified has
> reviewed anything on this page. It is written to make the questions visible so
> that a person who can answer them sees exactly what is at stake. Every open
> item is marked `TODO(legal review)`.

This page concerns **student data**, which means it concerns children. It is
deliberately blunt and it commits the project to nothing. In particular: there is
**no privacy policy, no terms of use, no cookie banner and no privacy contact**
in this project, and none is invented here. Whether any of those is required is
one of the questions below.

## 1. What the contract stores — and what that means

The only free-form field anywhere on-chain is the `reference`.

| Stored on-chain | Value | Personal data? |
|---|---|---|
| `reference` | `BytesN<32>`, opaque. The app accepts only 64 hexadecimal characters | **It must not be.** The contract cannot check what is inside those 32 bytes; keeping it opaque is a client responsibility |
| `school`, `payer` | Stellar addresses (public keys) | Public by nature; not a name, but potentially linkable to one out of band |
| `token` | the SEP-41 token contract address | No |
| `total`, `paid_total`, `refunded_total`, `due_at`, `closed` | amounts and timestamps | No, but financial information about a family's fee |
| Per-payer records | what each payer paid and was refunded | No, but it is payment history |
| Events (`FeeCreated`, `FeePaid`, `FeeRefunded`, `FeeClosed`) | the same values, published | Same as above |

What matters legally, in plain words:

1. **The record is permanent and public.** Anyone can read a fee, its amounts,
   its due date, its payment history and both addresses. There is no way to
   delete it: the contract has no delete function, and a blockchain cannot
   forget. Testnet can be reset by Stellar, but that is not a deletion right and
   must never be presented as one.
2. **The design keeps the child out of it.** Names, phone numbers, emails and
   student or member ids are forbidden on-chain by rule in all three
   repositories, and the app accepts only a 64-character hex value with a
   plain-words warning next to the field. But:
3. **`TODO(legal review)` — a hash is not automatically "not personal data".**
   Under many data-protection regimes, a value that can be linked back to a
   person by someone who holds the mapping (here: the school, which holds the
   reference → student mapping) is still personal data, or pseudonymous personal
   data. Whether hashing a student identifier is enough must be answered by
   someone qualified, not assumed by this project.
4. **`TODO(legal review)` — a hash of an id can be brute-forced.** If the school
   hashes a short, guessable internal id with a plain SHA-256 and no secret, the
   published hash can sometimes be reversed by guessing. The project does not
   currently tell schools how to derive a reference, and it should not invent a
   scheme without advice.
5. **`TODO(legal review)` — the published record is still financial information
   about a household.** Even with no name attached, a fee's total, due date and
   payment history are that family's business, and on a public ledger anybody can
   watch them.

## 2. What the app stores — audited, not assumed

Checked on 2026-10-01 by reading the source and the production bundle, not from
memory. The result is narrower than the app's own README claimed in one place —
that discrepancy is recorded below rather than smoothed over.

| Thing | Found? | Detail |
|---|---|---|
| `localStorage` writes **by this app's code** | **no** | a search of `src/` and `index.html` for `localStorage` returns nothing |
| `sessionStorage` | **no** | same |
| Cookies set by the app | **no** | no `document.cookie`, no cookie library |
| **`localStorage` written by the wallet kit** | **yes, five keys** | `@StellarWalletsKit/activeAddress`, `@StellarWalletsKit/selectedModuleId`, `@StellarWalletsKit/usedWalletsIds`, `@StellarWalletsKit/hardwareWalletPaths`, `@StellarWalletsKit/wcSessionPaths`. They hold a public address, the wallet the user picked, and hardware-wallet path state. No key material, no student data, nothing about a payment |
| Any other persistence by the app | **no** | no IndexedDB, no cache API, no service worker |
| Analytics, tag managers, pixels | **no** | nothing in `package.json` and nothing in the built bundle |
| Third-party **scripts** | **no** | `src/index.html` loads one module, our own |
| **Third-party requests** | **yes, two places** | (a) the Stellar RPC endpoint from `.env`; (b) when the wallet picker is opened, the kit fetches wallet icons from `https://stellar.creit.tech/wallet-icons/…`, and two entries reference `https://scopuly.com` and `https://uni.onekey-asset.com`. So a page load makes no third-party request, but **opening the picker does** |
| Web fonts or other font services | **no** | system font stack; no font is downloaded |
| Images or media | **no** | the app ships no images of its own |
| Server-side anything | **no** | no backend, so the project never receives, stores or processes data on a server |
| Console logging of user data | **no** | the app contains no `console.*` call at all |

The consequence for a privacy notice, if one is ever needed: **this project
holds no personal data at rest anywhere** — no database, no account, no server,
no log. The data that exists lives (a) on the public chain, as above, and (b) on
the user's own device, in the wallet kit's `localStorage`.

`TODO(legal review)` — whether the wallet kit's five `localStorage` keys require
a storage/cookie notice, and whether the remote icon requests make the wallet-icon
host a "recipient" that must be disclosed, are questions for someone qualified.
The honest mitigation available in code is to configure the kit with a narrower
local-icon module set, which would remove the icon requests entirely; that is
tracked as a decision in the gap map and as app
[draft 15](https://github.com/stellar-schoolfees/schoolfees-app/blob/main/docs/issue-drafts/15-correct-the-outbound-request-claim.md).

## 3. Where student identity is expected to live

Stated once, plainly, because everything else depends on it:

- **The school holds the mapping** from an opaque reference to a student — in its
  own records, paper or school system. That mapping is **never on-chain and never
  in any repository of this project**.
- **This project never receives a student's identity.** There is no sign-up, no
  rota, no class list, no import. A school could put a name in the reference field
  and it would go on-chain — the app refuses the format, but the app is not the
  only way to call a contract, and the contract cannot tell.
- **Pilot paperwork is the boundary.** [Pilot readiness](pilot-readiness.md) §6
  records that agreeing where the school keeps that mapping is an unticked
  prerequisite, and `pilot-playbook.md` says how a pilot participant is named in
  the record (only with consent, and a participant may choose not to be named).
- **`TODO(legal review)`** — whether a pilot school needs a written data-sharing
  or processing arrangement with the maintainer before the first deployment, and
  who the data controller is for the on-chain record (the school, or this
  project), is a legal question. The project assumes nothing.

## 4. Laws to check (`TODO(legal review)`)

Named because the pilot target is Nigerian schools, and flagged because this
project cannot interpret them. **No conclusion is drawn here.**

- **Nigeria Data Protection Act 2023** — the framework for processing personal
  data in Nigeria, and the basis of most of the questions above: lawful basis,
  purpose limitation, data minimisation, the rights of a data subject, and how
  they interact with an immutable public ledger.
- **Current NDPC guidance and instruments** — the Nigeria Data Protection
  Commission issues guidance and registration requirements that have changed
  over time, including anything specific to children's data. Check the current
  version; do not rely on a summary, including this one.
- **Federal Competition and Consumer Protection Act (FCCPA, Nigeria)** — touches
  how a service is described to consumers, including fee handling and anything
  that could read as a misleading claim. The app's rule "testnet only, no real
  money, no pilot has happened" is written with that in mind, but whether that is
  sufficient for a public pilot page is a legal question.
- **Anything the real deployment later touches**: which country the payer is in,
  whether a school is publicly funded, and whether the host of a published site
  brings additional obligations.

`TODO(verify)` — the descriptions of these instruments above are summaries of
what they cover, not statements of current legal text. Confirm the current
position with a qualified person before relying on any of it.

## 5. What this project deliberately does not have

Not an omission — a decision, because an invented legal document is worse than
none:

- **No privacy policy, no terms of use, no cookie banner, no consent flow.** A
  policy has to describe a real data practice, a real controller and a real
  contact. This project has none of those yet, and must not invent any.
- **No privacy contact.** `TODO(legal review)` — if one is required, the
  maintainer supplies it. Nothing here fabricates an address, an email or a
  postal address.
- **No retention schedule.** The on-chain record cannot be deleted, so a
  retention period would be a claim the project cannot honour. The off-chain
  mapping is the school's to manage.
- **No refund/cancellation policy for money.** There is no money: testnet tokens
  have no value. A refund in the contract is a technical function, not a
  consumer-rights policy.
- **No claim of compliance** with any law or standard, and no badge or
  certification.
- **No accessibility statement.** The app targets WCAG 2.2 AA
  ([the accessibility baseline](https://github.com/stellar-schoolfees/schoolfees-app/blob/main/docs/ACCESSIBILITY.md)),
  but no audit has been done, so there is nothing truthful to declare yet.

## 6. Questions for a qualified person

1. Is a privacy notice required at all for a testnet pilot that stores nothing
   server-side, and if so, who is the controller and what is the lawful basis?
2. Is a hash of a school-internal student identifier personal data where the
   school holds the mapping? If yes, what has to change?
3. Are the wallet kit's five `localStorage` keys and the wallet-icon requests
   something a user must be told about, and how?
4. Does a pilot need a written agreement with the school, and what must it say
   about the on-chain record and about naming participants?
5. Under the FCCPA and NDPC guidance, what must a public page about this pilot
   say — and what must it not claim?
6. Is publishing the pilot site publicly (rather than unlisted) acceptable before
   any of the above is settled?

Until those are answered, the project's position is: **testnet only, no real
money, no pilot, nothing deployed**, and no legal commitment of any kind.
