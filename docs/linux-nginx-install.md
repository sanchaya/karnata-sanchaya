# Linux + Nginx installation

`scripts/install-linux-nginx.sh` installs the live portal from an existing git clone. It builds the React bundle, runs the Express/MariaDB service under systemd, and adds one hostname-specific Nginx server block. Existing Nginx sites are not edited.

The live service listens only on loopback (default `127.0.0.1:8787`). Nginx owns ports 80 and 443. Requests are same-origin: the React application and `/api` are both proxied to Express, so `APP_ORIGIN` remains the public HTTPS URL.

## Prerequisites

- Debian/Ubuntu-style Linux with systemd and an existing Nginx installation.
- Node.js 22 or newer and npm.
- MariaDB already created and reachable by the database settings supplied to the script.
- DNS `A`/`AAAA` records for the hostname pointing to this server.
- Ports 80 and 443 reachable through the firewall.
- Certbot installed if using the Let’s Encrypt option.

The script does not install MariaDB, Certbot, or Node.js because those may already be shared by other applications. It validates their presence and stops before changing Nginx if a prerequisite is missing.

## Recommended HTTPS install

From the cloned repository, run as root or with `sudo`:

```bash
sudo -E DB_PASSWORD='use-a-long-database-password' \\
  ./scripts/install-linux-nginx.sh \\
  --app-dir /srv/karnataka-kingdoms-mvp \\
  --domain atlas.example.org \\
  --letsencrypt-email ops@example.org \\
  --run-user atlas
```

`DOCUMENT_ENCRYPTION_KEY` is generated automatically when it is not supplied. The script prompts for `DB_PASSWORD` if it is not in the environment. Prefer the prompt on shared shells so the database password does not enter shell history.

The clone owner is used by default as the service account. If the clone is root-owned, pass a non-root `--run-user` that can read the clone and write its `var/private-uploads` directory.

The first run will:

1. Create a mode-640 `.env` in the clone.
2. Run `npm ci`, `npm run check`, and `npm run db:migrate`.
3. Create and enable `karnataka-atlas.service` (or the supplied service name).
4. Temporarily configure an HTTP-only Nginx block for the ACME challenge.
5. Request the certificate and replace the block with HTTP→HTTPS redirect plus the TLS proxy.
6. Validate and reload Nginx.

MariaDB credentials must already refer to an existing database/user with permission to create the application tables. Use `--skip-migrations` only when migrations are being managed separately.

## Existing certificate

```bash
sudo ./scripts/install-linux-nginx.sh \\
  --app-dir /srv/karnataka-kingdoms-mvp \\
  --domain atlas.example.org \\
  --tls-cert /etc/letsencrypt/live/atlas.example.org/fullchain.pem \\
  --tls-key /etc/letsencrypt/live/atlas.example.org/privkey.pem \\
  --run-user atlas
```

For a temporary HTTP-only setup, use `--http-only`; the script prints a warning because the live portal should normally run behind HTTPS.

## Re-running or changing a deployment

The script refuses to overwrite `.env`, an existing systemd unit, or an existing Nginx site by default. Review the current files, then explicitly use `--overwrite`. Existing files are copied to timestamped `.backup.*` files before replacement. Use a different `--port` when another service already occupies 8787.

Useful operations:

```bash
sudo systemctl status karnataka-atlas
sudo journalctl -u karnataka-atlas -f
sudo nginx -t
sudo systemctl reload nginx
```

After pulling a new revision, rebuild and restart from the clone:

```bash
sudo -u atlas npm ci
sudo -u atlas npm run check
sudo systemctl restart karnataka-atlas
```

The script intentionally does not create the first administrator. After the service is live, create one with database access:

```bash
sudo -u atlas env \\
  NODE_ENV=production \\
  DB_HOST=127.0.0.1 DB_PORT=3306 DB_NAME=karnataka_atlas \\
  DB_USER=karnataka_atlas DB_PASSWORD='...' \\
  ADMIN_EMAIL='admin@example.org' ADMIN_PASSWORD='...' ADMIN_NAME='Atlas Administrator' \\
  npm run admin:create
```

Keep `.env`, the database backup, and `DOCUMENT_ENCRYPTION_KEY` protected. Do not expose MariaDB or `var/private-uploads` through Nginx.
