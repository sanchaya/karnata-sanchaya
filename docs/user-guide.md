# Community user guide

Updated: 2026-10-19

The public atlas is readable without an account. An account is needed only to submit, review or administer research. All edits are saved in MariaDB; the browser is never the research-data source of truth.

## ಖಾತೆ ತೆರೆಯುವುದು / Create an account

1. Open **Contribute / ಕೊಡುಗೆ ನೀಡಿ**, choose **Register**, and provide your name, email, profession and affiliation.
2. Choose a password of at least 12 characters and explicitly accept the community and privacy policies.
3. Sanchaya reviews the request. A pending account may sign in and complete its profile, but cannot submit research until approved.
4. If you forget the password, choose **Forgot password?**. The one-time link expires after the configured interval and invalidates existing sessions when used.

Never send a password or reset link to an administrator. Administrators cannot read passwords.

## Finding the right workspace

- **Research tasks / ಸಂಶೋಧನಾ ಕಾರ್ಯಗಳು (`#research-tasks`)** is the public task marketplace. Search by subject, district, priority or evidence gap before choosing work.
- **Contribute / ಕೊಡುಗೆ ನೀಡಿ (`#contribute`)** contains only contribution work: a new guided submission, your drafts/submissions and collaboration proposals.
- **Profile / ಪ್ರೊಫೈಲ್ (`#profile`)** contains identity, affiliation, verification, notifications, contribution history and certificates.
- **Evidence workflow / ಸಾಕ್ಷ್ಯ ಕಾರ್ಯವಿಧಾನ (`#evidence`)** is divided into Overview, Priorities and Tasks so the whole evidence board is not shown at once.
- **Review queue / ಪರಿಶೀಲನಾ ಸರದಿ (`#reviews`)** appears only for reviewers and administrators.
- **User operations / ಬಳಕೆದಾರ ನಿರ್ವಹಣೆ (`#operations`)** appears only for administrators and contains account approval, identity verification and research-campaign controls.
- **Data administration (`#admin`)** is the separate permanent dataset editor. Use it for records, sources, citations, relationships, imports, validation and MariaDB revisions—not for user approvals.
- **India research (`#india-research`)** is the broad discovery index. Its imported leads are not promoted to the Karnataka atlas until independently verified.

Old `#community` bookmarks continue to open the focused Contribution workspace.

## Guidance by role

### Student or member of the public

- Explore the timeline, district pages and citations before proposing a change.
- Use the contextual **Contribute** action so the stable record ID is carried into the form.
- Explain what should change and cite a durable source with a page, inscription or catalogue locator.

### Teacher, lecturer or faculty member

- Share a URL containing the selected year and map location with a class.
- Ask students to join a scoped research campaign created by an administrator.
- Treat research candidates as questions to verify, not settled claims.

### Researcher or contributor

- Save a draft before submitting it for review.
- Provide the narrowest defensible date, exact or explicitly approximate coordinates, source publication and locator.
- Respond to a request for changes by editing and resubmitting the same contribution; do not create a duplicate.
- Institution-ID verification is optional. Uploaded documents remain private and follow the retention policy.

### Reviewer

- Check the cited edition or authority source independently.
- Verify the claim, place, date, people/dynasty relationships and Kannada/English meaning.
- Approve, request changes or reject with a useful public note. Never approve your own submission.
- A completed review is not automatically a public release; it enters the approved dataset workflow.

### Verification officer

- Review institution verification in the restricted queue.
- Record only the decision and necessary note. Do not copy identity-document details into public fields.
- Follow the document-deletion schedule in the governance policy.

### Administrator

1. Open **User operations / ಬಳಕೆದಾರ ನಿರ್ವಹಣೆ → Account approvals**.
2. Check the applicant's name, profession and affiliation; approve or reject the account.
3. Appoint reviewer or verification-officer roles only after confirming competence and scope. Grant export access sparingly.
4. Manage campaigns from User operations; imported CSV/KML batches and rows remain in the Contribution and Review workspaces and still require review.
5. Use the separate Review queue for moderation and Data administration for canonical records, citations and release readiness. Publish only a validated, approved MariaDB revision.

Suspending an account blocks sign-in without deleting its historical audit record. Re-approving reactivates it.

## Password-recovery operations

Production requires `RESEND_API_KEY`, `MAIL_FROM`, `APP_ORIGIN` and `PASSWORD_RESET_MINUTES`. Reset tokens are random, stored only as SHA-256 hashes, expire, work once and invalidate all active sessions. Local development returns a preview link when mail is not configured; production never exposes it.

## Troubleshooting

- **Contribution service unavailable:** you are viewing the static GitHub Pages edition or the live API is offline. Continue browsing, then use the live portal to contribute.
- **Account pending:** wait for Sanchaya approval; keep your profile and affiliation accurate.
- **Reset email absent:** check spam, confirm the production mail settings and retry after the rate-limit window. The response never reveals whether an email is registered.
- **Reviewer/admin tab absent:** the approved account has not been appointed to that role. An administrator must assign it.

See [community governance](community-governance.md), [community operations](community-operations.md) and [live deployment](live-deployment.md) for policy and operator procedures.
