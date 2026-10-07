# Browser layout and keyboard evidence

Executed October 7, 2026 with the already installed Chromium and Playwright
Core, using Vite servers bound to loopback. Environment-file loading was disabled.
All wallets and read results were synthetic doubles; external browser requests
were blocked. Screenshots visibly label the synthetic review.

Eighteen page/viewport checks passed: SchoolFees Home, Create, Lookup, Pay and
School Actions; EventBadges Home, Organizer, Claim and Verify; each at 390px and
320px. No document exceeded its viewport horizontally. The screenshots of
SchoolFees Lookup include a synthetic loaded fee and status explanation.

EventBadges Verify accepted Enter from the attendee address field, rendered the
synthetic successful result, then cleared that result when the event id changed.
The check ran at both viewport widths. Unit regressions also cover failed retry
and CSV result clearing.

Results: [ui-review.json](ui-review.json). Images: [screenshots/](screenshots/).
Examples: [SchoolFees lookup, 320px](screenshots/schoolfees-LookupFeePage-320.png)
and [EventBadges organizer, 320px](screenshots/eventbadges-OrganizerPage-320.png).

The browser harness lives in the machine's temporary directory at
`C:/Users/ADMIN/AppData/Local/Temp/drips-ui-review.mjs`. It reuses the existing
Playwright Core installation under the local NexaGear workspace; no package or
browser was installed for this review. Its first attempt served Vite's fallback
configuration page rather than the synthetic fixture; the middleware order was
corrected and the final run additionally required the synthetic marker on every
page. Only the corrected eighteen-check run is reported above.

This checks isolated page layouts and the verification interaction, not the app
shell navigation, real devices, screen readers, camera behavior, wallet prompts,
network submission, pilot usability or WCAG conformance. The apps' axe-backed
render tests remain automated checks rather than an accessibility audit.
