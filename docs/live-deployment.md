# Live portal deployment

The live portal is one same-origin service: Express serves the built React application and `/api`, with MariaDB on a private network. Put an HTTPS reverse proxy in front of port 8787. Do not expose MariaDB or the private upload volume.

## Initial setup

1. Copy `.env.example` to `.env` and set strong unique database passwords, the public HTTPS `APP_ORIGIN`, a key generated with `openssl rand -base64 32`, and password-recovery mail settings (`RESEND_API_KEY` and `MAIL_FROM`). Keep this file outside version control and back up the encryption key separately.
2. MariaDB's `max_allowed_packet` must be at least 32M before running `db:sync-dataset` (see below); a fresh install's default (sometimes 1M-4M on minimal distro packages) is too small for the bundled dataset (~10MB and growing) and the sync will fail with `ECONNRESET`.
3. Start MariaDB and the portal with `docker compose up -d --build`, or run MariaDB independently, then `npm run db:migrate`, `npm run db:sync-dataset`, `npm run db:sync-research-discovery`, `npm run build`, and `npm start`.
4. Create the first administrator by setting `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` and optionally `ADMIN_NAME_KN`, then run `npm run admin:create` inside the portal environment.
5. Schedule `npm run privacy:cleanup` daily. Schedule `sudo ./scripts/backup-live.sh --app-dir /srv/karnataka-atlas` daily; it creates a compressed MariaDB dump, an encrypted private-upload archive and SHA-256 checksums under `/var/backups/karnataka-atlas`. Copy that directory to separate durable storage and test restoration before inviting contributors.

### Setting `max_allowed_packet`

Check the current value on the MariaDB host: `mysql -u root -p -e "SHOW VARIABLES LIKE 'max_allowed_packet';"`. If it is below 32M, add `max_allowed_packet = 64M` under `[mysqld]` in the server's config (commonly `/etc/mysql/mariadb.conf.d/50-server.cnf` on Debian/Ubuntu) and `sudo systemctl restart mariadb`. `SET GLOBAL max_allowed_packet = 67108864;` is a faster way to unblock a one-off `db:sync-dataset` run but reverts on the next MariaDB restart, so still make the config-file change for a permanent fix.

## Updating an existing installation

Run `sudo ./scripts/update-live.sh` from the cloned repository. It fast-forwards `origin/main`, installs the locked dependencies, validates and builds the public application, applies every pending MariaDB migration, synchronizes installation seed records into a permanent dataset revision, synchronizes the separate India-wide discovery queue without replacing Admin reviews, restarts the service and checks `/api/health`.

For a reviewed static release, set `SNAPSHOT_PUBLISHER_ID` and run `npm run publish:static`. The release task exports both approved community contributions and the latest validated MariaDB dataset revision. The resulting `public/data/published-atlas.json` is a read-only publication artifact for GitHub Pages, never an editing source.

Public interface changes and bundled research-data changes become available on the live portal after that deployment. A release that does not add a file under `server/migrations/` needs no separate manual database command; the update script is still safe to run normally.

Existing administrator dataset snapshots are not overwritten during deployment. That separation protects edits already made on the live server: the public application uses the reviewed bundled release, while MariaDB keeps its own permanent revision history until an administrator deliberately imports, reconciles and saves a newer complete dataset revision.

### Coolify deployment and discovery synchronization

Coolify builds the commit available on its configured remote branch. It cannot deploy local commits or uncommitted files that have not been pushed. Enable Coolify's Git webhook/automatic deployment if every push to `main` should create a new deployment; otherwise use **Redeploy** after pushing.

The current container startup command applies MariaDB migrations and starts the service. Repository dataset synchronization is a deliberate deployment operation, so run both synchronization commands from the **portal application container** after the new image is running:

```sh
cd /app
npm run db:migrate
npm run db:sync-dataset
NODE_OPTIONS=--max-old-space-size=1024 npm run db:sync-research-discovery
```

Do not run these commands in the MariaDB container or an old host clone. The application container should report `DB_HOST=database` when it uses the bundled Compose/Coolify MariaDB service:

```sh
printenv | grep -E '^(DB_HOST|DB_NAME|DB_USER)='
```

`db:sync-research-discovery` reads the approximately 19 MB generated discovery index and atomically upserts 35,061 records. It currently prints its summary only after all batches complete, so a quiet Coolify terminal does not necessarily mean the process has stopped. The expected corpus is:

| Intake | Records |
| --- | ---: |
| BharatRajya history discovery records | 25,579 |
| WhatIsIndia inscription/corpus records | 9,283 |
| WhatIsIndia failed-page repair leads | 152 |
| BharatRajya source catalogue | 47 |
| **Total** | **35,061** |

These are discovery leads stored separately in `research_discovery_records`, defaulting to `needs-review`. They do not change the Atlas schema version and do not become public historical claims until their underlying sources are independently verified and a reviewed canonical record is published. Repository refreshes update source payloads but retain Admin editorial metadata, citations and review decisions.

Verify the migration and row count against the exact database used by the application:

```sh
node --input-type=module -e "
import { pool } from './server/db.js';
const migrations = await pool.query(
  \"SELECT version FROM schema_migrations WHERE version='010_research_discovery_records.sql'\"
);
const rows = await pool.query('SELECT COUNT(*) total FROM research_discovery_records');
console.log({
  migrationApplied: migrations.length === 1,
  discoveryRecords: Number(rows[0].total)
});
await pool.end();
"
```

Expected: `migrationApplied: true` and `discoveryRecords: 35061`.

Common failures:

- `Missing script`: the container image predates the synchronizer or the terminal is not in `/app`.
- `research_discovery_records doesn't exist`: migration `010_research_discovery_records.sql` was not applied to this database.
- `ECONNREFUSED`: `DB_HOST` points to the wrong service; in the bundled deployment it is `database`.
- `ER_ACCESS_DENIED_ERROR`: the portal and MariaDB credentials do not match.
- packet-size errors: increase MariaDB `max_allowed_packet`; the bundled Compose service sets it to 1 GB.
- exit status `137`: raise the portal container memory limit and rerun with the `NODE_OPTIONS` value above.

The public `/api/dataset` endpoint is a separate canonical snapshot. `db:sync-dataset` advances that revision; `db:sync-research-discovery` only refreshes the private discovery/review queue. If the application container sees a newer dataset revision while the public endpoint still returns an old one, check that DNS and the reverse proxy route the domain to this Coolify service rather than a legacy systemd deployment.

## Reviewer and administrator operation

- Administrators approve accounts and appoint `reviewer`, `verification-officer` or `exporter` roles from the live administration API.
- Reviewers process `/api/reviews/queue`; a reviewer cannot approve their own contribution, and Kannada translations require all six scholarly checks.
- Evidence assignments are permanent MariaDB rows at `/api/evidence/assignments`; the browser is only a view/editor for the live service and does not become the source of truth.
- Every evidence task requires at least one source citation, added at `POST /api/evidence/assignments/:taskId/citations` and stored as its own permanent `evidence_task_citations` row. The server rejects a move to `awaiting-review` or `complete` (HTTP 422) until a task has one. Citations are add-only: there is no update or replace endpoint, so submitting a new reference never overwrites or removes one already recorded against that task.
- Evidence assignment history, reviewer notes, source citations and ready-for-promotion counts are live workflow aids. They help reviewers coordinate P1/P2 work but do not publish records without a validated dataset revision and approved static release.
- Keep at least two qualified reviewers active before accepting public submissions. Review the release-readiness panel before every publication.

## Release to the static site

The live administrator workspace stores complete dataset revisions in MariaDB. After reviewers approve community proposals and an administrator has reviewed the current dataset revision, set `SNAPSHOT_PUBLISHER_ID` to the releasing administrator and run `npm run publish:static`. This runs the approved-only export, validation and production build. Review `public/data/approved-community.json`, record the dataset revision and snapshot hash, then publish the resulting static build through the existing GitHub Pages workflow. The live database and private files are never deployed to Pages.

## Before public launch

Password-reset delivery is implemented with one-time hashed tokens and Resend's HTTPS API. Before launch, test delivery and expiry against the public `APP_ORIGIN`. Still add verified-email delivery, administrator MFA, a production secrets manager, central rate limiting, malware scanning for uploads, database least-privilege users, monitoring, backups, and final terms/privacy text. Run the service only behind HTTPS.

### Account-flow smoke test

After every authentication release: register a fresh address; verify its pending state; approve it from the Administration workspace; sign in and submit a draft; request a password reset; use the link once; confirm the old password and existing sessions no longer work; then suspend and reactivate the test account. Do not perform this test on a real contributor account.
