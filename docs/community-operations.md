# Community operations and release handoff

Updated: 2026-07-28

This is the operating checklist for the live MariaDB portal. It keeps community work permanent and reviewable while keeping the GitHub Pages site a deliberate, read-only release.

## Daily reviewer workflow

1. An administrator reviews pending accounts and appoints reviewers or verification officers only after checking affiliation and role suitability.
2. Contributors submit a stable record ID, bilingual change, rationale and at least one HTTP(S) citation. The proposal remains in MariaDB as `draft` until submitted.
3. A reviewer opens the queue, chooses a proposal from another contributor, checks the source locator and evidence, and records a public decision comment. Kannada translations additionally require all six scholarly checks.
4. Verification officers separately review institution ID requests. Documents remain encrypted and private; the verified badge is the only public result.
5. Approved proposals earn ledger points and remain linked to the review. The record is not public until it is included in an administrator-approved dataset revision.

## Administrator release gate

Before a static release, open the admin dashboard and check the **Live community handoff** panel:

- pending accounts and institution verifications have an owner;
- submitted contributions are either reviewed or intentionally held;
- at least one qualified reviewer is appointed;
- the latest MariaDB revision has passed validation;
- the last static publication is known, or the release is explicitly the first publication.

Then run `npm run export:approved`, inspect `public/data/approved-community.json`, run `npm run check`, and publish the static build. Never copy the live database, sessions, private review notes or encrypted uploads to GitHub Pages.

## Recovery and audit

- Run `sudo ./scripts/backup-live.sh --app-dir /srv/karnataka-atlas` from a protected maintenance host. It writes a compressed MariaDB dump, an encrypted `private-uploads` archive and `SHA256SUMS` under `/var/backups/karnataka-atlas/<UTC timestamp>/`.
- Restore drills must use a separate MariaDB database and temporary upload directory: verify the checksum, import the dump, decrypt one test document with the production key, and record the restored dataset revision. Never test restoration by overwriting production.
- Back up MariaDB and `var/private-uploads` independently, and test restoration before inviting contributors.
- Keep the dataset revision number and published snapshot hash in the release log.
- Run `npm run privacy:cleanup` daily so institution documents reach their deletion deadline.
- If a revision conflict occurs, reload the server revision, reconcile the record-level change, validate again and save as a new revision. Do not overwrite a newer revision blindly.

The admin dashboard reads `/api/administration/release-readiness` for the counts above. This endpoint is administrator-only and never exposes contributor email, private notes or document data.
