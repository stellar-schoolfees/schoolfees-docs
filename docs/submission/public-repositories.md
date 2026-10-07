# Public visibility and existing CI

Unauthenticated GitHub API checks on October 7, 2026 returned HTTP 200 and
`private: false` for all five shortlisted repositories. These checks do not
verify Drips GitHub app installation or account application slots.

| Repository | Latest returned workflow result | Revision covered |
|---|---|---|
| [SchoolFees contracts](https://github.com/stellar-schoolfees/schoolfees-contracts) | [Success](https://github.com/stellar-schoolfees/schoolfees-contracts/actions/runs/36830432663) | `d664c3827c01144652ac59fe74659a2a2376171b` |
| [EventBadges contracts](https://github.com/stellar-eventbadges/eventbadges-contracts) | [Success](https://github.com/stellar-eventbadges/eventbadges-contracts/actions/runs/36958258639) | `2c3881291a834ac4ddf3f5c7189a664a133fbade` |
| [SchoolFees app](https://github.com/stellar-schoolfees/schoolfees-app) | [Success](https://github.com/stellar-schoolfees/schoolfees-app/actions/runs/36945600418) | `d4cf3440931d421c1e2ff65f9f8cdfff29686eea` |
| [EventBadges app](https://github.com/stellar-eventbadges/eventbadges-app) | No runs returned | Not established |
| [InvoicePay contracts](https://github.com/stellar-invoicepay/invoicepay-contracts) | [Success](https://github.com/stellar-invoicepay/invoicepay-contracts/actions/runs/37108578998) | `f437c6454019ee0bed33479c1dd881852d68c678` |

These are existing remote runs, not validation of this update's dirty worktrees.
EventBadges contracts' returned remote revision differs from the local HEAD.
Do not treat either revision as interchangeable with the local source snapshot.
After reviewing and publishing the final changes, confirm successful CI on each
exact submitted commit. Public visibility and latest runs can change.
