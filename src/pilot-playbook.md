# Pilot Playbook

How a `schoolfees` pilot will be run. This is a plan, not a record: **no pilot
has happened yet.** The record of what actually happened goes in
`pilots/{name}.md` after it happens — see [Pilots](pilots/README.md).

## Purpose

A pilot exists to test two things an internal demo cannot:

1. **Demand** — does a real school or tutorial centre actually want families to
   settle fees this way?
2. **Real usability** — can the people who would use it get through the flow
   without being coached?

`schoolfees` is built by one person. That changes the logistics of running a
pilot (there is no team to split tasks with and no budget to absorb a bad week),
but it does not change the standard: a pilot uses people outside the project,
gives them a task rather than a tour, and ends with a written note of what
happened, including what did not work.

## The rule

**An interested person is not a completed pilot.** A completed pilot is someone
who actually ran the flow. A conversation, a verbal "that sounds useful", and an
agreement to try are all steps *towards* a pilot, not evidence from one.

Name a participant only at the level of detail they agreed to — their name,
their group's name, or neither. Never name a school or centre, or a person, that
has not agreed to be named.

## The gate

Deployment is gated on a real group, and this is separate from the build:

> **No testnet deployment until a real school or tutorial centre has agreed to
> try the flow.**

Recruitment runs in parallel with development. The maintainer reaches out
directly to schools and tutorial centres; nothing is recorded in this repository
until someone actually agrees, and no interested party is written down here on
the strength of a conversation. When an agreement is reached, the fact of the
agreement (not the contact's personal details) unlocks the first testnet
deployment, and the per-pilot file starts from the day the pilot is planned.

## Minimum flow for a pilot

1. **Recruit at least three real users with a real reason to use this** — for
   example, a parent who owes a fee, and the staff member who records it. One
   group can supply several. If only one person is available, run it anyway and
   say plainly in the write-up that it was a single participant.
2. **Give them a task, not a tour.** The task is a real one: record a real fee
   for a real amount, and pay part of it. Watch what they do. Do not coach, do
   not reach for the keyboard, and write down the first place they hesitate.
3. **Record, with consent:** who took part (at the level they agreed to), what
   they tried, what worked, what confused them, and what changed afterwards
   because of it. If something failed and was fixed, say what the fix was.
4. **Save the real transaction links.** A pilot write-up cites the actual testnet
   transactions. If a transaction cannot be linked, the write-up says so rather
   than paraphrasing it.

## Recording a pilot

One file per real pilot: `pilots/{name}.md`, written **after** the pilot, from
what actually happened. It records the purpose, what each side was responsible
for, what happened (with real links), and — in one or two sentences — what the
pilot does not prove. The [Pilots](pilots/README.md) page links to the directory
and explains why it is currently empty.

Never invent a tester, a school, a quote, a date or a result. A pilot file that
cannot be traced to real transactions does not belong in this repository.

## What a pilot is not

- It is **not** evidence of safety for mainnet.
- It is **not** evidence of behaviour under load, or of robustness against
  adversarial input — anything from a hostile payer to a fake school address.
- It is **not** proof of long-term use. Three people completing a flow once is
  not months of ordinary use.
- It is **not** a security review. A pilot runs alongside no audit; see
  [known limitations](limitations.md).

These limits are repeated in [known limitations](limitations.md) on purpose: the
boundary belongs in the durable document, not only in the pilot write-up.
