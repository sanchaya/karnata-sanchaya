# Atlas v0.30 — live reviewer pilot

Updated: 2026-10-19

This is the bounded production exercise for the existing community workflow. It adds no shortcut around evidence review and does not publish a contribution automatically.

## Entry gate

Open `#admin` on the live MariaDB deployment and find **Atlas v0.30 · Reviewer pilot**. Start only after all seven automated checks pass:

1. migrations `011_v029_community_operations.sql` and `012_password_reset.sql` are recorded in `schema_migrations`;
2. `RESEND_API_KEY` and `MAIL_FROM` are configured;
3. at least two approved users have the `reviewer` role;
4. at least three approved contributors exist;
5. an active campaign has at least three members;
6. at least one evidence task has different assignee and reviewer names;
7. a permanent MariaDB dataset revision exists.

The panel is diagnostic, not a security boundary. Server authorization remains the authority for every administrative and review action.

## Pilot scope

Create one bilingual campaign with the stable slug `v030-evidence-pilot`. Scope it to inscriptions and heritage in Kalaburagi/Sannati, Raichur/Maski, Kolar, Tumakuru, Chikkamagaluru, Ballari, Dharwad, Haveri and Davanagere.

Use the existing Evidence Workflow to assign:

- Sannati independent Kannada translation and authority/survey coordinate;
- Maski independent Kannada review, authority/survey coordinate and dated whole-site condition evidence;
- the first eight-district heritage batch's surveyed coordinates, managing authority, present condition and licensed dated photographs.

An assignee must not review their own task. A task marked complete in the operations board still does not promote the historical record until its canonical evidence gates and record review status are independently approved.

## Three manual drills

Record date, operator, result and corrective action outside the public dataset for each drill.

### 1. Backup and isolated restore

Run `npm run backup:live` on the protected host. Verify `SHA256SUMS`, restore the dump into a separate database, restore private uploads into a temporary directory, decrypt one test document and compare the latest dataset revision. Never restore over production.

### 2. Signup and recovery

Register a new Kannada-first contributor, approve the account, assign a role, request a password reset, confirm delivery, use the link once and confirm that reuse fails and previous sessions are invalidated.

### 3. Approved-only publication

Approve one harmless pilot contribution, set `SNAPSHOT_PUBLISHER_ID`, run `npm run publish:static`, inspect `public/data/approved-community.json`, verify that drafts/private notes/uploads are absent, and preview the production build before publishing.

## Exit gate

The pilot is complete when all automated checks pass, all three manual drills succeed, at least one contribution completes independent review, and any usability failures are recorded as issues. Only then invite a broader contributor cohort.
