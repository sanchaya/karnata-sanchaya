# Live portal deployment

The live portal is one same-origin service: Express serves the built React application and `/api`, with MariaDB on a private network. Put an HTTPS reverse proxy in front of port 8787. Do not expose MariaDB or the private upload volume.

## Initial setup

1. Copy `.env.example` to `.env` and set strong unique database passwords, the public HTTPS `APP_ORIGIN`, and a key generated with `openssl rand -base64 32`. Keep this file outside version control and back up the encryption key separately.
2. Start MariaDB and the portal with `docker compose up -d --build`, or run MariaDB independently, then `npm run db:migrate`, `npm run build`, and `npm start`.
3. Create the first administrator by setting `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` and optionally `ADMIN_NAME_KN`, then run `npm run admin:create` inside the portal environment.
4. Schedule `npm run privacy:cleanup` daily. Back up MariaDB and the encrypted private-document volume separately and test restoration.

## Release to the static site

After reviewers approve proposals, set `SNAPSHOT_PUBLISHER_ID` to the releasing administrator and run `npm run export:approved`. Review the generated JSON, run `npm run check`, and publish the resulting static build through the existing GitHub Pages workflow. The live database and private files are never deployed to Pages.

## Before public launch

Add verified-email/password-reset delivery, administrator MFA, a production secrets manager, central rate limiting, malware scanning for uploads, database least-privilege users, monitoring, backups, and final terms/privacy text. Run the service only behind HTTPS.
