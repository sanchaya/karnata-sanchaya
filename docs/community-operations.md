# Community operations and release handoff

Updated: 2026-10-19

This is the operating checklist for the live MariaDB portal. It keeps community work permanent and reviewable while keeping the GitHub Pages site a deliberate, read-only release. The role-specific public workflow is documented in [user-guide.md](user-guide.md). Account recovery uses one-time, expiring, hashed tokens; production email delivery must be configured and exercised before inviting contributors.

## Daily reviewer workflow

1. An administrator reviews pending accounts and appoints reviewers or verification officers only after checking affiliation and role suitability.
2. Contributors submit a stable record ID, bilingual change, rationale and at least one HTTP(S) citation. The proposal remains in MariaDB as `draft` until submitted.
3. A reviewer opens the queue, chooses a proposal from another contributor, checks the source locator and evidence, and records a public decision comment. Kannada translations additionally require all six scholarly checks.
4. Verification officers separately review institution ID requests. Documents remain encrypted and private; the verified badge is the only public result.
5. Approved proposals earn ledger points and remain linked to the review. The record is not public until it is included in an administrator-approved dataset revision.
6. Evidence-board assignments are coordinated in `#evidence`. Researchers may set assignee, independent reviewer, due date, status and review note. The saved status history is operational metadata; it does not change the historical record's review status by itself.
7. Returned contributions remain editable by their original contributor. Saving a revision increments its version, returns it to `draft`, and requires a deliberate resubmission.
8. Campaign coordinators use the Administration workspace to create a bilingual research campaign, including optional record-type and district scope. Approved contributors may join an active campaign and associate a draft with it. The schema retains `draft`, `active`, `closed` and `archived` lifecycle states plus coordinator/participant membership roles.
9. Contributor and reviewer decisions generate persistent MariaDB notifications; opening a notification marks only that user's copy as read.

## Bulk research staging

Approved contributors can stage CSV or KML files from the contribution workspace. The browser parses the supplied file, shows the row count, and sends at most 500 sanitized rows to `research_import_batches`. These batches are private operational records: they are not merged into the canonical dataset and are not included in the GitHub Pages build.

A reviewer or administrator must inspect the preview and approve, reject or request changes with a written note. Approval means that the batch is suitable for a later controlled canonical import; it does **not** publish the rows automatically. This separation prevents a spreadsheet or KML from bypassing stable IDs, evidence validation and record-level editorial review.

The initial staging formats are CSV and point-based KML. Image uploads remain outside this workflow until the project approves licence, consent, retention and moderation rules.

## Administrator release gate

Before a static release, open the admin dashboard and check the **Live community handoff** panel:

- pending accounts and institution verifications have an owner;
- submitted contributions are either reviewed or intentionally held;
- at least one qualified reviewer is appointed;
- the latest MariaDB revision has passed validation;
- evidence assignments marked complete have a reviewer different from the assignee when the task requires independent review;
- the last static publication is known, or the release is explicitly the first publication.

Then run `npm run export:approved`, inspect `public/data/approved-community.json`, run `npm run check`, and publish the static build. Never copy the live database, sessions, private review notes or encrypted uploads to GitHub Pages.

Migration `011_v029_community_operations.sql` adds notifications, scoped campaigns, campaign membership and private research-import batches. It intentionally retains future-safe account/system notification kinds and the `staged` import state; these values are inexpensive schema capacity and must not be removed without a data-migration review. `scripts/update-live.sh` runs `npm run db:migrate`; verify the migration appears in `schema_migrations` before testing these panels.

## Recovery and audit

- Run `sudo ./scripts/backup-live.sh --app-dir /srv/karnataka-atlas` from a protected maintenance host. It writes a compressed MariaDB dump, an encrypted `private-uploads` archive and `SHA256SUMS` under `/var/backups/karnataka-atlas/<UTC timestamp>/`.
- Restore drills must use a separate MariaDB database and temporary upload directory: verify the checksum, import the dump, decrypt one test document with the production key, and record the restored dataset revision. Never test restoration by overwriting production.
- Back up MariaDB and `var/private-uploads` independently, and test restoration before inviting contributors.
- Keep the dataset revision number and published snapshot hash in the release log.
- Run `npm run privacy:cleanup` daily so institution documents reach their deletion deadline.
- If a revision conflict occurs, reload the server revision, reconcile the record-level change, validate again and save as a new revision. Do not overwrite a newer revision blindly.

The admin dashboard reads `/api/administration/release-readiness` for the counts above. This endpoint is administrator-only and never exposes contributor email, private notes or document data.

## Atlas v0.30 reviewer pilot

The Admin readiness panel now reports only facts that the live service can verify: required migrations, password-reset mail configuration, approved cohort sizes, active campaign membership, independent evidence assignment and a permanent dataset revision. It also shows pending staged files and evidence-review counts. It deliberately does not claim that a backup restored successfully, a real email arrived or a static release was inspected; those remain manual operator checks.

Run the bounded pilot in [`v030-reviewer-pilot.md`](v030-reviewer-pilot.md) before opening general registration. The initial campaign should cover Sannati, Maski and the first eight-district heritage batch. Each scholarly task must have a contributor and a different reviewer.
