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

   > **Research note (2026-10-01), not verified by a qualified person.** Under
   > the Nigeria Data Protection Act 2023, a child is anyone under 18 (consistent
   > with the Child's Rights Act), and Section 31 requires parent or guardian
   > consent with age and consent verification mechanisms. One source treats
   > children's data as warranting the care given to sensitive data, and Section
   > 31(5) deems a child under 13 incapable of consenting — which commentators
   > flag as inconsistent with the under-18 definition. Sources:
   > [cert.gov.ng](https://cert.gov.ng/ngcert/resources/Nigeria_Data_Protection_Act_2023.pdf),
   > [FIJ](https://fij.ng/article/how-nigerias-data-protection-law-created-regulator-then-weakened-it/),
   > [Cookie-Script](https://cookie-script.com/privacy-laws/nigeria-data-protection-act-2023).
3. **`TODO(legal review)` — a hash is not automatically "not personal data".**
   Under many data-protection regimes, a value that can be linked back to a
   person by someone who holds the mapping (here: the school, which holds the
   reference → student mapping) is still personal data, or pseudonymous personal
   data. Whether hashing a student identifier is enough must be answered by
   someone qualified, not assumed by this project.

   > **Research note (2026-10-01), not verified by a qualified person.** NDPA
   > Section 65 defines personal data to include identification numbers and
   > online identifiers, and defines pseudonymisation as processing where data
   > cannot be attributed to a person without separately kept additional
   > information. The school holds that additional information, so the on-chain
   > reference may fall under the school's pseudonymised processing. Source:
   > [LawGlobalHub — Section 65](https://www.lawglobalhub.com/section-65-nigeria-data-protection-act-2023/).
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

> **Research note (2026-10-01), not verified by a qualified person.** The
> General Application and Implementation Directive (GAID) 2025 lists an article
> on consent to cookies and other tracking tools, and a duty to provide privacy
> and cookie notices on the homepage. Secondary sources say necessary cookies
> that process no sensitive or financial data need no consent. Whether the
> wallet kit's five `localStorage` keys count as necessary, and whether this
> project is a controller at all, are open questions. Sources:
> [DPO-India](https://dpo-india.com/Resources/privacy_laws_in_africa_nations/Nigeria(NDP-Act)(GAID)2025.pdf),
> [Manfield Solicitors](https://manifieldsolicitors.com/nigeria-data-protection-act-general-application-and-implementation-directive-gaid-2025-what-every-business-needs-to-know-about-nigerias-data-protection-directive/).

> **Maintainer inference (2026-10-01), not legal advice.** Opening the wallet
> picker contacts outside icon hosts (`https://stellar.creit.tech/wallet-icons/…`,
> plus `https://scopuly.com` and `https://uni.onekey-asset.com`), which reveals
> the user's IP address — an online identifier under the NDPA definition. This
> supports moving to local icons (app step 4), which would remove the icon
> requests entirely.

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
  > **Research note (2026-10-01), not verified by a qualified person.** The
  > NDPC's General Application and Implementation Directive 2025 (GAID 2025),
  > issued 20 March 2025, is reported effective 19 September 2025 and is
  > reported to replace the 2019 regulation. Sources:
  > [Mondaq](https://www.mondaq.com/nigeria/data-protection/1684204/unlocking-gaid-2025-answers-to-all-your-burning-questions),
  > [Afriwise](https://www.afriwise.com/blog/key-updates-from-the-nigeria-data-protection-act---general-application-and-implementation-directive-gaid-2025).
- **Federal Competition and Consumer Protection Act (FCCPA, Nigeria)** — touches
  how a service is described to consumers, including fee handling and anything
  that could read as a misleading claim. The app's rule "testnet only, no real
  money, no pilot has happened" is written with that in mind, but whether that is
  sufficient for a public pilot page is a legal question.
  > **Research note (2026-10-01), not verified by a qualified person.** FCCPA
  > Section 125 prohibits false, misleading or deceptive representations. Whether
  > a free testnet pilot counts as trade or marketing is for a qualified person.
  > Source: [LawGlobalHub — FCCPA 2018](https://www.lawglobalhub.com/federal-competition-and-consumer-protection-act-2018-nigeria/).
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
  > **Research note (2026-10-01), not verified by a qualified person.** The
  > GAID 2025 lists an article on consent to cookies and other tracking tools
  > and a duty to provide privacy and cookie notices on the homepage. Secondary
  > sources say necessary cookies that process no sensitive or financial data
  > need no consent. Do NOT add a banner here. Whether the wallet kit's five
  > `localStorage` keys count as necessary, and whether this project is a
  > controller at all, are open questions — see section 2. Sources:
  > [DPO-India](https://dpo-india.com/Resources/privacy_laws_in_africa_nations/Nigeria(NDP-Act)(GAID)2025.pdf),
  > [Manfield Solicitors](https://manifieldsolicitors.com/nigeria-data-protection-act-general-application-and-implementation-directive-gaid-2025-what-every-business-needs-to-know-about-nigerias-data-protection-directive/).
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

## Data Privacy Impact Assessment (DPIA) — research note

> **Research note (2026-10-01), not verified by a qualified person.** A
> secondary summary reports that the GAID lists educational records and digital
> financial services among cases requiring a data privacy impact assessment,
> signed by a certified data protection officer and following a GAID schedule.
> Whether a school pilot triggers one, and whose duty it is (school or
> maintainer), is an open question.

## Registration thresholds — research note

> **Research note (2026-10-01), not verified by a qualified person.** A
> secondary source reports volume thresholds of 200, 1,000 and 5,000 data
> subjects for controllers of major importance. **These figures are unverified.**
> Question to ask each pilot school: does it reach a threshold or fall under an
> exemption. Source:
> [Regulations.AI](https://regulations.ai/regulations/RAI-NG-NA-GAIGNXX-2025).

## EU guidance — research note (NOT Nigerian law)

> **Research note (2026-10-01), not verified by a qualified person. NOT Nigerian
> law — persuasive only.** The EDPB's Guidelines 02/2025 on blockchain (final
> version 2.0, adopted 7 July 2026) say hashed personal data is still personal
> data, recommend salted or keyed hashes with the original kept off-chain, advise
> against registering clear, encrypted or hashed personal data on a chain, and
> treat keeping data off-chain so that erasing it makes the on-chain value
> unlinkable as the practical answer to erasure requests. Sources:
> [Bird & Bird](https://www.twobirds.com/en/insights/2026/netherlands/edpb-adopts-final-guidelines-on-blockchain-and-personal-data-a-practical-guide-for-organisations),
> [EDPB](https://www.edpb.europa.eu/documents/guideline/guidelines-02-2025-on-processing-of-personal-data-through-blockchain_en).

> **What was NOT found (2026-10-01).** No NDPC guidance specific to blockchains
> or public ledgers, and none specific to schools, was found in this research.
> This is a record of absence, not a claim that none exists.

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

> **Maintainer's design idea (not a decision, not legal advice).** The school
> could generate a random 32-byte reference that is not derived from any
> student data, and keep the reference → student mapping off-chain. This avoids
> the brute-forcing risk noted in section 1 item 4. Whether hashing or random
> generation is better, and whether this is sound, is for a qualified person.

7. **`TODO(legal review)` — Does a school pilot trigger a DPIA?** A secondary
   summary reports educational records and digital financial services among the
   cases requiring a data privacy impact assessment, signed by a certified data
   protection officer. Whose duty is it — the school or the maintainer?
8. **`TODO(legal review)` — Does the school reach a controller registration
   threshold?** Secondary sources report volume thresholds of 200, 1,000 and
   5,000 data subjects (unverified). Does the school fall under a threshold or
   an exemption, and what is its controller status?
9. **`TODO(legal review)` — Who obtains and verifies parental consent?** Under
   the NDPA 2023, a child is anyone under 18 and Section 31 requires parent or
   guardian consent with verification mechanisms; Section 31(5) deems a child
   under 13 incapable of consenting. Who obtains parental consent for a school
   fee record, and who verifies it?
10. **`TODO(legal review)` — Do the wallet kit's five `localStorage` keys and
    the (now local) icon setup require a storage/cookie notice, or are they
    necessary with no consent required?**
11. **`TODO(legal review)` — Should hashed or random references be on-chain at
    all?** The design option above is one idea; the broader question is whether
    a 32-byte random reference (not derived from student data, mapping kept
    off-chain) is the right shape, and whether a school or the maintainer is
    the controller for the on-chain record.

Until those are answered, the project's position is: **testnet only, no real
money, no pilot, nothing deployed**, and no legal commitment of any kind.

## Research log

- **Date:** 2026-10-01
- **What was searched:** Nigeria Data Protection Act 2023 (child consent,
  definitions, registration thresholds); NDPC General Application and
  Implementation Directive 2025 (GAID 2025); cookie and storage consent under
  the NDPA; FCCPA Section 125; EDPB blockchain and personal data guidance;
  data privacy impact assessment thresholds in Nigerian law.
- **Method:** independent web search of publicly available secondary summaries
  and one secondary copy of the GAID text, using the URLs below. The primary
  Nigerian legal texts were not read in full.
- **Sources:**
  - cert.gov.ng — Nigeria Data Protection Act 2023:
    https://cert.gov.ng/ngcert/resources/Nigeria_Data_Protection_Act_2023.pdf
  - FIJ — "How Nigeria's Data Protection Law Created Regulator, Then Weakened
    It": https://fij.ng/article/how-nigerias-data-protection-law-created-regulator-then-weakened-it/
  - Cookie-Script — Nigeria Data Protection Act 2023:
    https://cookie-script.com/privacy-laws/nigeria-data-protection-act-2023
  - LawGlobalHub — Section 65 NDPA 2023:
    https://www.lawglobalhub.com/section-65-nigeria-data-protection-act-2023/
  - Mondaq — "Unlocking GAID 2025":
    https://www.mondaq.com/nigeria/data-protection/1684204/unlocking-gaid-2025-answers-to-all-your-burning-questions
  - Afriwise — Key Updates from the NDPA / GAID 2025:
    https://www.afriwise.com/blog/key-updates-from-the-nigeria-data-protection-act---general-application-and-implementation-directive-gaid-2025
  - DPO-India — Nigeria (NDP-Act)(GAID)2025:
    https://dpo-india.com/Resources/privacy_laws_in_africa_nations/Nigeria(NDP-Act)(GAID)2025.pdf
  - Manfield Solicitors — GAID 2025 guidance:
    https://manifieldsolicitors.com/nigeria-data-protection-act-general-application-and-implementation-directive-gaid-2025-what-every-business-needs-to-know-about-nigerias-data-protection-directive/
  - Regulations.AI — GAID 2025 registration thresholds:
    https://regulations.ai/regulations/RAI-NG-NA-GAIGNXX-2025
  - Bird & Bird — EDPB final guidelines on blockchain and personal data:
    https://www.twobirds.com/en/insights/2026/netherlands/edpb-adopts-final-guidelines-on-blockchain-and-personal-data-a-practical-guide-for-organisations
  - EDPB — Guidelines 02/2025 on blockchain:
    https://www.edpb.europa.eu/documents/guideline/guidelines-02-2025-on-processing-of-personal-data-through-blockchain_en
  - LawGlobalHub — FCCPA 2018:
    https://www.lawglobalhub.com/federal-competition-and-consumer-protection-act-2018-nigeria/
- **Limits:** these are secondary summaries, not primary Nigerian legal texts.
  One secondary copy of the GAID text was read but not treated as authoritative.
  Nothing on this page is legal advice, and no source was verified by a qualified
  person. Every conclusion remains `TODO(legal review)`.
