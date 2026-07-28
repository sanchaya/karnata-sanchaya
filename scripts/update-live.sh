#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'

# Pull and deploy a new revision into an existing Karnataka Historical Atlas
# systemd installation. This script does not change Nginx, TLS, or .env.

APP_DIR=''
BRANCH='main'
REMOTE='origin'
SERVICE_NAME='karnataka-atlas'
RUN_USER=''
SKIP_MIGRATIONS=0

usage(){
  cat <<'USAGE'
Update an existing Karnataka Historical Atlas live deployment.

Required:
  --app-dir DIR             Existing git clone used by the live service

Optional:
  --branch NAME             Branch to fast-forward (default: main)
  --remote NAME             Git remote (default: origin)
  --service-name NAME       systemd service (default: karnataka-atlas)
  --run-user USER           Unix account owning/running the clone
  --skip-migrations         Do not run npm run db:migrate
  -h, --help                Show this help

The script refuses to deploy with uncommitted changes. It preserves the
existing .env, MariaDB credentials, encryption key, Nginx configuration and
TLS certificates. Run as root or with sudo.
USAGE
}

die(){ printf 'Error: %s\n' "$*" >&2; exit 1; }
notice(){ printf '\n==> %s\n' "$*"; }

while (($#)); do
  case "$1" in
    --app-dir) APP_DIR=${2:-}; shift 2 ;;
    --branch) BRANCH=${2:-}; shift 2 ;;
    --remote) REMOTE=${2:-}; shift 2 ;;
    --service-name) SERVICE_NAME=${2:-}; shift 2 ;;
    --run-user) RUN_USER=${2:-}; shift 2 ;;
    --skip-migrations) SKIP_MIGRATIONS=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) die "Unknown option: $1 (use --help)" ;;
  esac
done

[[ $EUID -eq 0 ]] || die 'Run this script with sudo/root privileges.'
[[ -n "$APP_DIR" ]] || die '--app-dir is required.'
[[ "$BRANCH" =~ ^[A-Za-z0-9._/-]+$ && "$BRANCH" != -* && "$BRANCH" != */ ]] || die "Invalid branch: $BRANCH"
[[ "$REMOTE" =~ ^[A-Za-z0-9._-]+$ ]] || die "Invalid remote: $REMOTE"
[[ "$SERVICE_NAME" =~ ^[A-Za-z0-9_.@-]+$ ]] || die "Invalid service name: $SERVICE_NAME"

APP_DIR=$(cd "$APP_DIR" 2>/dev/null && pwd) || die "Cannot access app directory: $APP_DIR"
[[ -f "$APP_DIR/package.json" && -f "$APP_DIR/server/app.js" ]] || die "This does not look like the atlas clone: $APP_DIR"
[[ -f "$APP_DIR/.env" ]] || die "Missing $APP_DIR/.env. Run the initial Linux/Nginx installer first."
systemctl cat "$SERVICE_NAME.service" >/dev/null 2>&1 || die "Missing systemd service: $SERVICE_NAME.service"

for command in git node npm systemctl curl runuser flock chown; do
  command -v "$command" >/dev/null 2>&1 || die "Required command is missing: $command"
done

if [[ -z "$RUN_USER" ]]; then RUN_USER=$(stat -c '%U' "$APP_DIR"); fi
[[ "$RUN_USER" != root ]] || die 'The clone is root-owned. Pass --run-user with a non-root account.'
id "$RUN_USER" >/dev/null 2>&1 || die "Unix user does not exist: $RUN_USER"
RUN_GROUP=$(id -gn "$RUN_USER")
RUN_HOME=$(getent passwd "$RUN_USER" | cut -d: -f6)
[[ -n "$RUN_HOME" ]] || die "Could not determine home directory for $RUN_USER"
NPM_BIN=$(command -v npm)
APP_PATH='/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'

LOCK_FILE="/run/lock/$SERVICE_NAME.deploy.lock"
exec 9>"$LOCK_FILE"
flock -n 9 || die "Another $SERVICE_NAME deployment is already running."

cd "$APP_DIR"
run_as_app(){
  runuser -u "$RUN_USER" -- env HOME="$RUN_HOME" PATH="$APP_PATH" "$@"
}

WORKING_DIRECTORY=$(systemctl show -p WorkingDirectory --value "$SERVICE_NAME.service")
[[ "$WORKING_DIRECTORY" == "$APP_DIR" ]] || die "The service uses WorkingDirectory=$WORKING_DIRECTORY, not $APP_DIR."

if [[ -n "$(run_as_app git status --porcelain=v1)" ]]; then
  die 'The clone has uncommitted or untracked changes. Commit/stash them before deploying.'
fi
run_as_app git rev-parse --is-inside-work-tree >/dev/null || die 'The app directory is not a git worktree.'

PORT=$(sed -n 's/^PORT=//p' "$APP_DIR/.env" | tail -n 1 | tr -d '"' | tr -d "'" || true)
PORT=${PORT:-8787}
[[ "$PORT" =~ ^[0-9]+$ && "$PORT" -ge 1024 && "$PORT" -le 65535 ]] || die "Invalid PORT in .env: $PORT"

PREVIOUS_REVISION=$(run_as_app git rev-parse HEAD)
notice "Fetching $REMOTE/$BRANCH"
run_as_app git fetch --prune "$REMOTE"
run_as_app git show-ref --verify --quiet "refs/remotes/$REMOTE/$BRANCH" || die "Remote branch not found: $REMOTE/$BRANCH"

if run_as_app git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  run_as_app git checkout "$BRANCH"
else
  run_as_app git checkout -b "$BRANCH" "$REMOTE/$BRANCH"
fi
run_as_app git merge --ff-only "$REMOTE/$BRANCH"
CURRENT_REVISION=$(run_as_app git rev-parse HEAD)
notice "Revision: ${CURRENT_REVISION:0:12} (was ${PREVIOUS_REVISION:0:12})"

# npm ci/build can replace generated files; make sure the service account owns them.
for generated_dir in "$APP_DIR/node_modules" "$APP_DIR/dist" "$APP_DIR/var"; do
  if [[ -e "$generated_dir" ]]; then chown -R "$RUN_USER:$RUN_GROUP" "$generated_dir"; fi
done

notice 'Installing dependencies and running checks'
run_as_app "$NPM_BIN" ci
run_as_app "$NPM_BIN" run check

if [[ $SKIP_MIGRATIONS -eq 0 ]]; then
  notice 'Applying MariaDB migrations'
  # The installer-generated .env is trusted deployment configuration. It is
  # loaded only for this child process and is never printed.
  run_as_app sh -c 'set -a; . ./.env; set +a; exec "$1" run db:migrate' sh "$NPM_BIN"
else
  notice 'Skipping MariaDB migrations by request'
fi

notice "Restarting $SERVICE_NAME.service"
systemctl restart "$SERVICE_NAME.service"

ready=0
for attempt in $(seq 1 30); do
  if curl --fail --silent --show-error --max-time 3 "http://127.0.0.1:$PORT/api/health" >/dev/null; then
    ready=1
    break
  fi
  sleep 1
done

if [[ $ready -ne 1 ]]; then
  systemctl status "$SERVICE_NAME.service" --no-pager -l || true
  journalctl -u "$SERVICE_NAME.service" -n 60 --no-pager || true
  die "The service did not pass /api/health on 127.0.0.1:$PORT after 30 seconds."
fi

notice 'Deployment complete'
printf 'Revision: %s\n' "$CURRENT_REVISION"
printf 'Service: %s.service\n' "$SERVICE_NAME"
printf 'Health: http://127.0.0.1:%s/api/health\n' "$PORT"
