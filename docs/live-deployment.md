# Live portal deployment

The live portal is one same-origin service: Express serves the built React application and `/api`, with MariaDB on a private network. Put an HTTPS reverse proxy in front of port 8787. Do not expose MariaDB or the private upload volume.

## Initial setup

1. Copy `.env.example` to `.env` and set strong unique database passwords, the public HTTPS `APP_ORIGIN`, and a key generated with `openssl rand -base64 32`. Keep this file outside version control and back up the encryption key separately.
2. MariaDB's `max_allowed_packet` must be at least 32M before running `db:sync-dataset` (see below); a fresh install's default (sometimes 1M-4M on minimal distro packages) is too small for the bundled dataset (~10MB and growing) and the sync will fail with `ECONNRESET`.
3. Start MariaDB and the portal with `docker compose up -d --build`, or run MariaDB independently, then `npm run db:migrate`, `npm run db:sync-dataset`, `npm run build`, and `npm start`.
4. Create the first administrator by setting `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` and optionally `ADMIN_NAME_KN`, then run `npm run admin:create` inside the portal environment.
5. Schedule `npm run privacy:cleanup` daily. Schedule `sudo ./scripts/backup-live.sh --app-dir /srv/karnataka-atlas` daily; it creates a compressed MariaDB dump, an encrypted private-upload archive and SHA-256 checksums under `/var/backups/karnataka-atlas`. Copy that directory to separate durable storage and test restoration before inviting contributors.

### Setting `max_allowed_packet`

Check the current value on the MariaDB host: `mysql -u root -p -e "SHOW VARIABLES LIKE 'max_allowed_packet';"`. If it is below 32M, add `max_allowed_packet = 64M` under `[mysqld]` in the server's config (commonly `/etc/mysql/mariadb.conf.d/50-server.cnf` on Debian/Ubuntu) and `sudo systemctl restart mariadb`. `SET GLOBAL max_allowed_packet = 67108864;` is a faster way to unblock a one-off `db:sync-dataset` run but reverts on the next MariaDB restart, so still make the config-file change for a permanent fix.

## Updating an existing installation

Run `sudo ./scripts/update-live.sh` from the cloned repository. It fast-forwards `origin/main`, installs the locked dependencies, validates and builds the public application, applies every pending MariaDB migration, synchronizes installation seed records into a permanent dataset revision, restarts the service and checks `/api/health`.

For a reviewed static release, set `SNAPSHOT_PUBLISHER_ID` and run `npm run publish:static`. The release task exports both approved community contributions and the latest validated MariaDB dataset revision. The resulting `public/data/published-atlas.json` is a read-only publication artifact for GitHub Pages, never an editing source.

Public interface changes and bundled research-data changes become available on the live portal after that deployment. A release that does not add a file under `server/migrations/` needs no separate manual database command; the update script is still safe to run normally.

Existing administrator dataset snapshots are not overwritten during deployment. That separation protects edits already made on the live server: the public application uses the reviewed bundled release, while MariaDB keeps its own permanent revision history until an administrator deliberately imports, reconciles and saves a newer complete dataset revision.

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

Add verified-email/password-reset delivery, administrator MFA, a production secrets manager, central rate limiting, malware scanning for uploads, database least-privilege users, monitoring, backups, and final terms/privacy text. Run the service only behind HTTPS.
