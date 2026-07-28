#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'

# Back up the live MariaDB database and encrypted private-upload volume.
# The script is intentionally explicit about its targets and never prints
# database credentials or document contents.

APP_DIR=''
BACKUP_DIR='/var/backups/karnataka-atlas'
RETENTION_DAYS=30

usage(){
  cat <<'USAGE'
Back up a Karnataka Historical Atlas live installation.

Usage:
  sudo ./scripts/backup-live.sh [options]

Options:
  --app-dir DIR          Existing clone containing .env (default: script parent)
  --backup-dir DIR       Dedicated backup directory (default: /var/backups/karnataka-atlas)
  --retention-days N     Remove backup sets older than N days (default: 30)
  -h, --help             Show this help

The .env file supplies DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD and
PRIVATE_UPLOAD_DIR. Backups are written with mode 0700/0600 and include a
SHA-256 manifest. Store the resulting directory on separate durable storage.
USAGE
}

die(){ printf 'Error: %s\n' "$*" >&2; exit 1; }
notice(){ printf '\n==> %s\n' "$*"; }

while (($#)); do
  case "$1" in
    --app-dir) APP_DIR=${2:-}; shift 2 ;;
    --backup-dir) BACKUP_DIR=${2:-}; shift 2 ;;
    --retention-days) RETENTION_DAYS=${2:-}; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) die "Unknown option: $1 (use --help)" ;;
  esac
done

[[ $EUID -eq 0 ]] || die 'Run this backup as root so private-upload permissions are preserved.'
if [[ -z "$APP_DIR" ]]; then APP_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd); fi
APP_DIR=$(cd "$APP_DIR" 2>/dev/null && pwd) || die "Cannot access app directory: $APP_DIR"
[[ -r "$APP_DIR/.env" ]] || die "Missing readable $APP_DIR/.env"
[[ "$RETENTION_DAYS" =~ ^[0-9]+$ ]] || die 'Retention days must be a non-negative integer.'
[[ "$BACKUP_DIR" = /* && "$BACKUP_DIR" != '/' ]] || die 'Backup directory must be an explicit absolute path other than /. '

for command in mkdir date tar sha256sum find flock; do command -v "$command" >/dev/null 2>&1 || die "Required command is missing: $command"; done
DUMP_BIN=$(command -v mariadb-dump || command -v mysqldump || true)
[[ -n "$DUMP_BIN" ]] || die 'Neither mariadb-dump nor mysqldump is installed.'

set -a
# shellcheck disable=SC1091
. "$APP_DIR/.env"
set +a

DB_HOST=${DB_HOST:-127.0.0.1}
DB_PORT=${DB_PORT:-3306}
DB_NAME=${DB_NAME:-karnataka_atlas}
DB_USER=${DB_USER:-karnataka_atlas}
DB_PASSWORD=${DB_PASSWORD:-}
PRIVATE_UPLOAD_DIR=${PRIVATE_UPLOAD_DIR:-"$APP_DIR/var/private-uploads"}
if [[ "$PRIVATE_UPLOAD_DIR" != /* ]]; then PRIVATE_UPLOAD_DIR="$APP_DIR/$PRIVATE_UPLOAD_DIR"; fi
[[ "$DB_PORT" =~ ^[0-9]+$ ]] || die 'DB_PORT must be numeric.'
[[ "$DB_NAME" =~ ^[A-Za-z0-9_$-]+$ && "$DB_USER" =~ ^[A-Za-z0-9_$-]+$ ]] || die 'DB_NAME and DB_USER contain unsupported characters.'

LOCK_FILE="$BACKUP_DIR/.backup.lock"
mkdir -p -m 0700 "$BACKUP_DIR"
exec 9>"$LOCK_FILE"
flock -n 9 || die 'Another live backup is already running.'

STAMP=$(date -u +%Y%m%dT%H%M%SZ)
SET_DIR="$BACKUP_DIR/$STAMP"
mkdir -p -m 0700 "$SET_DIR"
cleanup(){ rm -f -- "$SET_DIR/database.sql"; }
trap cleanup ERR

notice 'Dumping MariaDB'
env MYSQL_PWD="$DB_PASSWORD" "$DUMP_BIN" \
  --host="$DB_HOST" --port="$DB_PORT" --user="$DB_USER" --protocol=tcp \
  --single-transaction --routines --events --triggers --hex-blob --databases "$DB_NAME" \
  > "$SET_DIR/database.sql"
gzip -9 "$SET_DIR/database.sql"

if [[ -d "$PRIVATE_UPLOAD_DIR" ]]; then
  notice 'Archiving encrypted private uploads'
  tar -C "$(dirname "$PRIVATE_UPLOAD_DIR")" -czf "$SET_DIR/private-uploads.tar.gz" "$(basename "$PRIVATE_UPLOAD_DIR")"
else
  notice 'Private upload directory is absent; recording an empty archive'
  tar -czf "$SET_DIR/private-uploads.tar.gz" --files-from /dev/null
fi

(cd "$SET_DIR" && sha256sum database.sql.gz private-uploads.tar.gz > SHA256SUMS)
chmod 0600 "$SET_DIR"/*
printf 'created_at=%s\ndatabase=%s\nprivate_uploads=%s\n' "$STAMP" "$DB_NAME" "$PRIVATE_UPLOAD_DIR" > "$SET_DIR/manifest.txt"
chmod 0600 "$SET_DIR/manifest.txt"

find "$BACKUP_DIR" -mindepth 1 -maxdepth 1 -type d -name '20*' -mtime +"$RETENTION_DAYS" -exec rm -rf -- {} +
trap - ERR
notice 'Backup complete'
printf 'Backup set: %s\nChecksums: %s\n' "$SET_DIR" "$SET_DIR/SHA256SUMS"
