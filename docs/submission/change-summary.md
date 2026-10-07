# Submission-window changes

SchoolFees and EventBadges actions now ignore abandoned async results and keep
the synchronous duplicate guard until the original task settles. Wallet session
and network results cannot restore a disconnected session; reconnect is blocked
while disconnecting. Deferred-promise regressions exercise these races.

SchoolFees has one connection control in the shell, accurate Home guidance and
visible fee-status explanations. Its wallet adapter imports eight Stellar
modules lazily with local icons. The largest JavaScript chunk fell from the
historical 1,045.82 kB/263.24 kB gzip to 799.26 kB/188.53 kB gzip. The large-chunk
advisory and installed dependency advisories remain. Testing, accessibility,
security, deployment and dependency documentation now describe actual evidence.

EventBadges guards browser hashing and preparation before both creation and
claim submission. A successful organizer ticket bundle remains tied to its
original event across retries and failures; a new success replaces it.
Verification submits with Enter and removes stale results/CSV after input edits
or failed retries. The preexisting attendee camera-test changes were preserved.

InvoicePay contracts now renew the receipt's payer-index TTL during repeat
payments and refunds. The new regression failed before the fix, then passed with
the complete contract suite. Token movement, authorization and entrypoints did
not change. Its frontend identity/error mappings are corrected, but it remains
an incomplete starter excluded from the shortlist.

The workspace runner explicitly selects the five-repository submission shortlist
and distinguishes configured commands from passing checks. Source snapshots,
18 synthetic narrow-screen checks, public-repository checks, application copy
and nine contributor issue drafts accompany the validation evidence.

Ajo, DuesTreasury and the complete InvoicePay frontend remain deferred. No
deployment, real-wallet run, pilot, dependency upgrade, commit, push, issue
publication or Drips application was performed. Review and publish the final
commits, verify their CI, confirm account slots and the actual application cutoff,
then submit using [the checklist](README.md).
