# Drips Stellar submission packet

Prepared October 7, 2026. Target: finish validation by October 8, 20:00 WAT,
freeze feature work at 18:00, and retain October 9 as a submission buffer.
**The October 9 cutoff is user supplied and must be verified with Drips.**
The official wave page currently lists Wave 10 for October 15–22; this does
not confirm an application cutoff. See [repository research](repository-research.md).

This packet is preparation, not an application or an acceptance claim.
This copy preserves the pre-publication workspace packet in the SchoolFees docs
repository. Publication was requested afterward; statements about uncommitted
worktrees and unpublished changes describe the evidence capture, not current
GitHub state. Confirm the final commit and its CI when submitting.
The [workspace tools archive](workspace-tools.zip) contains the original scripts;
extract its `scripts/` directory into the multi-project workspace before running.
Local validation results belong in `validation.md`; pending checks must not
be presented as passed. Commit or worktree identity must accompany evidence.

## Priority and distinct value

| Priority | Repository | Audience and concrete use case | Boundary |
|---|---|---|---|
| 1 | SchoolFees contracts | Schools collect fee installments with payment/refund accounting and opaque student references. | Implemented testnet contract; no live pilot claimed. |
| 2 | EventBadges contracts | Organizers issue nontransferable attendance records; attendees claim and verifiers check them. | Attendance credentials, rather than payment collection. No live pilot claimed. |
| 3 | SchoolFees app | Schools and payers access the fee contract through a wallet interface and readable transaction states. | Supporting frontend; assess separately only if account slots permit. |
| 4 | EventBadges app | Organizers prepare claim tickets, attendees claim, and others verify attendance. | Supporting frontend; no live deployment outcome claimed. |
| 5 | InvoicePay contracts | Freelancers create invoices; clients pay partially; refunds and receipts retain accounting. | Optional only after all checks pass. Full app deferred. |

Ajo, DuesTreasury, InvoicePay app and unfinished docs are not readiness
candidates in this window. Similar finance use cases do not establish identical
implementations: explain each workflow and its users in its own application.
Supporting docs should not be submitted merely to increase repository count.

## Human submission steps

1. Verify the active wave, exact closing timestamp/timezone and account limits.
2. Review every diff, identify the final submitted revision, publish that revision,
   and confirm each selected GitHub repository is publicly readable.
3. Confirm GitHub CI passes on that exact revision. Local results do not prove CI.
4. Install or authorize the Drips GitHub app through the official application flow.
5. Check available application slots and repository/organization point budgets.
6. Review and publish only genuine, still-unimplemented contributor issues from
   `issues/`; drafts here are not open GitHub issues and are not contribution counts.
7. Submit the strongest repositories in priority order with the descriptions below,
   actual check results, limitations and reproducible setup links.
8. Record application links and confirmation timestamps. Do not claim acceptance.

No external publication, deployment, GitHub issue creation or application was
performed by this packet. Deployment remains a separate human decision with a
real pilot partner. Testnet only, no real money or personal data on-chain.

## Official rules to recheck at submission

- [Maintainer participation](https://docs.drips.network/wave/maintainers/participating-in-a-wave/)
- [Application limits](https://docs.drips.network/wave/maintainers/repo-application-limits/)
- [Points budgets](https://docs.drips.network/wave/maintainers/points-budgets/)
- [Terms and rules](https://docs.drips.network/wave/terms-and-rules/)
- [Maintainer FAQ](https://docs.drips.network/wave/maintainers/faq/)

The earlier accepted-repository review sampled the visible list; it did not
prove a universal acceptance pattern or guarantee approval. No published
uniqueness restriction was identified. Quality, genuine contributor work and
maintainer responsiveness still require evidence.
