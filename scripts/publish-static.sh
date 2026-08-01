#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'

# Produce the reviewed-only static release from the live MariaDB service.
# This does not push to GitHub or expose the live database.

APP_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
[[ -f "$APP_DIR/package.json" ]] || { printf 'Error: not an atlas clone: %s\n' "$APP_DIR" >&2; exit 1; }
[[ -n "${SNAPSHOT_PUBLISHER_ID:-}" ]] || { printf 'Error: SNAPSHOT_PUBLISHER_ID must identify the releasing administrator.\n' >&2; exit 1; }

cd "$APP_DIR"
printf '\n==> Exporting approved community contributions\n'
npm run export:approved
printf '\n==> Exporting the latest MariaDB atlas revision\n'
npm run export:static-dataset
printf '\n==> Validating the complete release\n'
VITE_STATIC_DATASET=true npm run check
printf '\n==> Static release is ready in %s/dist\n' "$APP_DIR"
printf 'The validated MariaDB atlas revision and reviewed community contributions were exported as read-only publication artifacts.\n'
