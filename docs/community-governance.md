# Community governance

## Roles and review path

1. A visitor registers with a name, profession, affiliation and institution details. Every new account remains `pending` until Sanchaya approves it.
2. An approved account receives the contributor role. Contributors create proposals; they never write directly to the published atlas.
3. Sanchaya administrators may appoint qualified people or institutional nominees as reviewers and verification officers.
   Administrators may separately grant the exporter role to approved members who need structured JSON worklists or dataset handoff files. Export permission is not implied by contributor, reviewer or verified-badge status.
4. A reviewer sees submitted proposals from other people only. Approval, change requests and rejection require a public review comment and are retained in the audit trail.
   Kannada translation approvals additionally require six recorded checks: source match, semantic fidelity, names and dates, historical terminology, line completeness and reviewer attestation. A draft cannot approve itself or bypass these checks through the API.
5. Approved proposals enter the MariaDB approval set. A named administrator deliberately creates the privacy-safe static export used by a release.

## Identity verification and privacy

- Institution ID submission is optional and is used only for the verified badge.
- Accepted formats are JPEG, PNG and PDF, limited to 5 MB.
- Documents are encrypted with AES-256-GCM before private storage and are never included in API lists, leaderboards, exports or GitHub Pages.
- Only verification officers and administrators can retrieve a document. Retrieval is sent with `no-store` caching.
- After a decision, the document is scheduled for deletion after 30 days. Run `npm run privacy:cleanup` daily from cron/systemd.
- The production privacy notice and consent text must be reviewed under applicable Indian law before public launch.

## Karma and certificates

- Approved contribution: 20 points, plus 2 points per valid citation up to five citations.
- Approval review: 5 points. Self-review is prohibited.
- Points are entries in an auditable ledger, not an editable total.
- Administrators may issue a bilingual certificate for a defined period. Its public verification code remains valid unless the certificate is revoked.
- Points recognise participation; they are not a statement that every historical interpretation is final.

## Publication rule

`npm run export:approved` writes only approved proposal content, public contributor/reviewer names, badge state, citations and the public structured review decision to `public/data/approved-community.json`. It refuses to export an approved Kannada translation without its complete scholarly assessment. It excludes email addresses, identity documents, private review notes, sessions and private audit metadata. GitHub Pages continues to deploy a read-only Vite build.
