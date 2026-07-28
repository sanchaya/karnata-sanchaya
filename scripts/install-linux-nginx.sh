#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'

# Install the live Express + React portal behind an existing Nginx instance.
# The script deliberately owns only one systemd unit and one Nginx server block.

APP_DIR=''
DOMAIN=''
SERVICE_NAME='karnataka-atlas'
PORT='8787'
RUN_USER=''
LETSENCRYPT_EMAIL=''
TLS_CERT=''
TLS_KEY=''
HTTP_ONLY=0
OVERWRITE=0
REUSE_ENV=0
SKIP_MIGRATIONS=0
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-karnataka_atlas}"
DB_USER="${DB_USER:-karnataka_atlas}"
DB_PASSWORD="${DB_PASSWORD:-}"
DOCUMENT_ENCRYPTION_KEY="${DOCUMENT_ENCRYPTION_KEY:-}"

usage(){
  cat <<'USAGE'
Install the Karnataka Historical Atlas live portal behind Nginx.

Required:
  --app-dir DIR             Existing git clone containing this project
  --domain HOSTNAME         Public hostname, for example atlas.example.org

TLS (choose one):
  --letsencrypt-email EMAIL Request a certificate through Certbot (recommended)
  --tls-cert FILE --tls-key FILE
                            Use an existing certificate and private key
  --http-only               Configure HTTP only (not recommended for live use)

Optional:
  --service-name NAME       systemd/Nginx name (default: karnataka-atlas)
  --port PORT               Loopback Node port (default: 8787)
  --run-user USER           Unix account that owns/runs the clone
  --db-host HOST            MariaDB host (default: 127.0.0.1)
  --db-port PORT            MariaDB port (default: 3306)
  --db-name NAME            MariaDB database (default: karnataka_atlas)
  --db-user USER            MariaDB user (default: karnataka_atlas)
  --reuse-env               Reuse an existing installer-created .env after a failed run
  --skip-migrations         Do not run npm run db:migrate
  --overwrite               Back up and replace an existing .env/unit/site config
  -h, --help                Show this help

DB_PASSWORD and DOCUMENT_ENCRYPTION_KEY may be supplied as environment variables;
otherwise the script prompts for them. Node.js 20.19+ or 22.12+, npm, Nginx, systemd, curl and
openssl must already be installed. MariaDB and Certbot are not installed or
configured automatically because they may be shared with other applications.
USAGE
}

die(){ printf 'Error: %s\n' "$*" >&2; exit 1; }
notice(){ printf '\n==> %s\n' "$*"; }

while (($#)); do
  case "$1" in
    --app-dir) APP_DIR=${2:-}; shift 2 ;;
    --domain) DOMAIN=${2:-}; shift 2 ;;
    --service-name) SERVICE_NAME=${2:-}; shift 2 ;;
    --port) PORT=${2:-}; shift 2 ;;
    --run-user) RUN_USER=${2:-}; shift 2 ;;
    --letsencrypt-email) LETSENCRYPT_EMAIL=${2:-}; shift 2 ;;
    --tls-cert) TLS_CERT=${2:-}; shift 2 ;;
    --tls-key) TLS_KEY=${2:-}; shift 2 ;;
    --http-only) HTTP_ONLY=1; shift ;;
    --overwrite) OVERWRITE=1; shift ;;
    --reuse-env) REUSE_ENV=1; shift ;;
    --skip-migrations) SKIP_MIGRATIONS=1; shift ;;
    --db-host) DB_HOST=${2:-}; shift 2 ;;
    --db-port) DB_PORT=${2:-}; shift 2 ;;
    --db-name) DB_NAME=${2:-}; shift 2 ;;
    --db-user) DB_USER=${2:-}; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) die "Unknown option: $1 (use --help)" ;;
  esac
done

[[ $EUID -eq 0 ]] || die 'Run this script with sudo/root privileges.'
[[ -n "$APP_DIR" ]] || die '--app-dir is required.'
[[ -n "$DOMAIN" ]] || die '--domain is required.'
[[ "$DOMAIN" =~ ^[A-Za-z0-9.-]+$ && "$DOMAIN" != .* && "$DOMAIN" != *..* ]] || die "Invalid hostname: $DOMAIN"
[[ "$SERVICE_NAME" =~ ^[A-Za-z0-9_.@-]+$ ]] || die "Invalid service name: $SERVICE_NAME"
[[ "$PORT" =~ ^[0-9]+$ && "$PORT" -ge 1024 && "$PORT" -le 65535 ]] || die "Port must be between 1024 and 65535: $PORT"
[[ "$DB_PORT" =~ ^[0-9]+$ && "$DB_PORT" -ge 1 && "$DB_PORT" -le 65535 ]] || die "Invalid DB port: $DB_PORT"
[[ $HTTP_ONLY -eq 1 || -n "$LETSENCRYPT_EMAIL" || ( -n "$TLS_CERT" && -n "$TLS_KEY" ) ]] || die 'Choose --letsencrypt-email, both --tls-cert/--tls-key, or --http-only.'
[[ -z "$LETSENCRYPT_EMAIL" || "$LETSENCRYPT_EMAIL" =~ ^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$ ]] || die "Invalid Certbot email: $LETSENCRYPT_EMAIL"
[[ -z "$TLS_CERT" || -f "$TLS_CERT" ]] || die "TLS certificate not found: $TLS_CERT"
[[ -z "$TLS_KEY" || -f "$TLS_KEY" ]] || die "TLS private key not found: $TLS_KEY"
[[ -z "$LETSENCRYPT_EMAIL" || ( -z "$TLS_CERT" && -z "$TLS_KEY" ) ]] || die 'Use either Certbot or an existing certificate, not both.'

APP_DIR=$(cd "$APP_DIR" 2>/dev/null && pwd) || die "Cannot access app directory: $APP_DIR"
[[ -f "$APP_DIR/package.json" && -f "$APP_DIR/server/app.js" ]] || die "This does not look like the atlas clone: $APP_DIR"

for command in node npm nginx systemctl curl openssl runuser; do command -v "$command" >/dev/null 2>&1 || die "Required command is missing: $command"; done
if ! node -e 'const [major,minor]=process.versions.node.split(".").map(Number); const supported=(major===20&&minor>=19)||(major>=22&&(major>22||minor>=12)); process.exit(supported?0:1)'; then
  die "Node.js 20.19+ or 22.12+ is required by the current Vite toolchain; found $(node --version)."
fi
if [[ -n "$LETSENCRYPT_EMAIL" ]] && ! command -v certbot >/dev/null 2>&1; then
  die 'Certbot is required for --letsencrypt-email.'
fi

if [[ -z "$RUN_USER" ]]; then
  RUN_USER=$(stat -c '%U' "$APP_DIR")
  [[ "$RUN_USER" != root ]] || die 'The clone is root-owned. Pass --run-user with a non-root account that can read/write the clone.'
fi
id "$RUN_USER" >/dev/null 2>&1 || die "Unix user does not exist: $RUN_USER"
RUN_GROUP=$(id -gn "$RUN_USER")
NPM_BIN=$(command -v npm)

ENV_FILE="$APP_DIR/.env"
UNIT_FILE="/etc/systemd/system/$SERVICE_NAME.service"
CERTBOT_ROOT="/var/www/certbot"

if [[ -d /etc/nginx/sites-available && -d /etc/nginx/sites-enabled ]]; then
  NGINX_AVAILABLE="/etc/nginx/sites-available/$SERVICE_NAME.conf"
  NGINX_ENABLED="/etc/nginx/sites-enabled/$SERVICE_NAME.conf"
else
  mkdir -p /etc/nginx/conf.d
  NGINX_AVAILABLE="/etc/nginx/conf.d/$SERVICE_NAME.conf"
  NGINX_ENABLED="$NGINX_AVAILABLE"
fi

read_env_value(){
  local key=$1 line value
  line=$(grep -E "^${key}=" "$ENV_FILE" 2>/dev/null | tail -n 1 || true)
  [[ -n "$line" ]] || return 0
  value=${line#*=}
  if [[ "$value" == \"*\" ]]; then
    value=${value:1:${#value}-2}
    value=${value//\\\"/\"}
    value=${value//\\\\/\\}
  fi
  printf '%s' "$value"
}

if [[ -f "$ENV_FILE" && $REUSE_ENV -eq 1 ]]; then
  [[ -n "$DB_PASSWORD" ]] || DB_PASSWORD=$(read_env_value DB_PASSWORD)
  [[ -n "$DOCUMENT_ENCRYPTION_KEY" ]] || DOCUMENT_ENCRYPTION_KEY=$(read_env_value DOCUMENT_ENCRYPTION_KEY)
  [[ "$DB_HOST" != '127.0.0.1' ]] || DB_HOST=$(read_env_value DB_HOST)
  [[ "$DB_PORT" != '3306' ]] || DB_PORT=$(read_env_value DB_PORT)
  [[ "$DB_NAME" != 'karnataka_atlas' ]] || DB_NAME=$(read_env_value DB_NAME)
  [[ "$DB_USER" != 'karnataka_atlas' ]] || DB_USER=$(read_env_value DB_USER)
fi

for target in "$ENV_FILE" "$UNIT_FILE" "$NGINX_AVAILABLE"; do
  if [[ -e "$target" && $OVERWRITE -ne 1 && ! ( "$target" == "$ENV_FILE" && $REUSE_ENV -eq 1 ) ]]; then
    die "$target already exists. Re-run with --overwrite only after reviewing the backup implications."
  fi
done

if [[ -z "$DB_PASSWORD" ]]; then
  read -r -s -p "MariaDB password for $DB_USER@$DB_HOST: " DB_PASSWORD
  printf '\n'
fi
[[ -n "$DB_PASSWORD" ]] || die 'A non-empty DB_PASSWORD is required.'
if [[ -z "$DOCUMENT_ENCRYPTION_KEY" ]]; then DOCUMENT_ENCRYPTION_KEY=$(openssl rand -base64 32); fi

backup_if_present(){
  local target=$1
  if [[ -e "$target" && ( $OVERWRITE -eq 1 || ( "$target" == "$ENV_FILE" && $REUSE_ENV -eq 1 ) ) ]]; then
    cp -a "$target" "$target.backup.$(date -u +%Y%m%d%H%M%S)"
  fi
}
backup_if_present "$ENV_FILE"
backup_if_present "$UNIT_FILE"
backup_if_present "$NGINX_AVAILABLE"

quote_env(){
  local value=$1
  [[ "$value" != *$'\n'* && "$value" != *$'\r'* ]] || die 'Environment values cannot contain newlines.'
  value=${value//\\/\\\\}
  value=${value//\"/\\\"}
  printf '"%s"' "$value"
}

if [[ "$HTTP_ONLY" -eq 1 ]]; then APP_ORIGIN="http://$DOMAIN"; else APP_ORIGIN="https://$DOMAIN"; fi
PRIVATE_UPLOAD_DIR="$APP_DIR/var/private-uploads"
mkdir -p "$PRIVATE_UPLOAD_DIR"
chown -R "$RUN_USER:$RUN_GROUP" "$PRIVATE_UPLOAD_DIR"
for app_generated_dir in "$APP_DIR/node_modules" "$APP_DIR/dist" "$APP_DIR/var"; do
  if [[ -e "$app_generated_dir" ]]; then
    # npm install/check and the live service must be able to replace generated files.
    # This repairs the common case where npm install was previously run with sudo.
    chown -R "$RUN_USER:$RUN_GROUP" "$app_generated_dir"
  fi
done
umask 077
{
  printf 'NODE_ENV=production\n'
  printf 'PORT=%s\n' "$PORT"
  printf 'APP_ORIGIN=%s\n' "$(quote_env "$APP_ORIGIN")"
  printf 'TRUST_PROXY=true\n'
  printf 'DB_HOST=%s\n' "$(quote_env "$DB_HOST")"
  printf 'DB_PORT=%s\n' "$DB_PORT"
  printf 'DB_NAME=%s\n' "$(quote_env "$DB_NAME")"
  printf 'DB_USER=%s\n' "$(quote_env "$DB_USER")"
  printf 'DB_PASSWORD=%s\n' "$(quote_env "$DB_PASSWORD")"
  printf 'DOCUMENT_ENCRYPTION_KEY=%s\n' "$(quote_env "$DOCUMENT_ENCRYPTION_KEY")"
  printf 'PRIVATE_UPLOAD_DIR=%s\n' "$(quote_env "$PRIVATE_UPLOAD_DIR")"
  printf 'SESSION_DAYS=14\n'
} > "$ENV_FILE"
chown "$RUN_USER:$RUN_GROUP" "$ENV_FILE"
chmod 640 "$ENV_FILE"

run_as_app(){
  runuser -u "$RUN_USER" -- env \
    NODE_ENV=production PORT="$PORT" APP_ORIGIN="$APP_ORIGIN" TRUST_PROXY=true \
    DB_HOST="$DB_HOST" DB_PORT="$DB_PORT" DB_NAME="$DB_NAME" DB_USER="$DB_USER" \
    DB_PASSWORD="$DB_PASSWORD" DOCUMENT_ENCRYPTION_KEY="$DOCUMENT_ENCRYPTION_KEY" \
    PRIVATE_UPLOAD_DIR="$PRIVATE_UPLOAD_DIR" SESSION_DAYS=14 "$@"
}

notice 'Installing dependencies and building the production bundle'
run_as_app "$NPM_BIN" ci
run_as_app "$NPM_BIN" run check

if [[ $SKIP_MIGRATIONS -eq 0 ]]; then
  notice 'Applying MariaDB migrations'
  run_as_app "$NPM_BIN" run db:migrate
fi

cat > "$UNIT_FILE" <<UNIT
[Unit]
Description=Karnataka Historical Atlas live portal
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR
User=$RUN_USER
Group=$RUN_GROUP
EnvironmentFile=$ENV_FILE
ExecStart=$NPM_BIN start
Restart=on-failure
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true
UMask=027
ReadWritePaths=$PRIVATE_UPLOAD_DIR

[Install]
WantedBy=multi-user.target
UNIT
chmod 644 "$UNIT_FILE"

write_http_config(){
  cat > "$1" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    location ^~ /.well-known/acme-challenge/ {
        root $CERTBOT_ROOT;
        try_files \$uri =404;
    }

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 120s;
        client_max_body_size 12m;
    }
}
NGINX
}

write_tls_config(){
  cat > "$1" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;
    location ^~ /.well-known/acme-challenge/ {
        root $CERTBOT_ROOT;
        try_files \$uri =404;
    }
    location / { return 301 https://\$host\$request_uri; }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name $DOMAIN;

    ssl_certificate $TLS_CERT;
    ssl_certificate_key $TLS_KEY;
    ssl_protocols TLSv1.2 TLSv1.3;
    add_header Strict-Transport-Security "max-age=31536000" always;

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_read_timeout 120s;
        client_max_body_size 12m;
    }
}
NGINX
}

mkdir -p "$CERTBOT_ROOT"
if [[ -n "$LETSENCRYPT_EMAIL" ]]; then
  notice 'Requesting the TLS certificate through Certbot'
  write_http_config "$NGINX_AVAILABLE"
  if [[ "$NGINX_ENABLED" != "$NGINX_AVAILABLE" ]]; then ln -sfn "$NGINX_AVAILABLE" "$NGINX_ENABLED"; fi
  nginx -t
  systemctl reload nginx
  certbot certonly --webroot -w "$CERTBOT_ROOT" -d "$DOMAIN" --email "$LETSENCRYPT_EMAIL" --agree-tos --no-eff-email --non-interactive
  TLS_CERT="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"
  TLS_KEY="/etc/letsencrypt/live/$DOMAIN/privkey.pem"
fi

if [[ $HTTP_ONLY -eq 1 ]]; then write_http_config "$NGINX_AVAILABLE"; else write_tls_config "$NGINX_AVAILABLE"; fi
if [[ "$NGINX_ENABLED" != "$NGINX_AVAILABLE" ]]; then ln -sfn "$NGINX_AVAILABLE" "$NGINX_ENABLED"; fi
nginx -t

systemctl daemon-reload
systemctl enable --now "$SERVICE_NAME.service"
systemctl reload nginx

notice 'Waiting for the application service to become ready'
service_ready=0
for attempt in $(seq 1 30); do
  if curl --fail --silent --show-error "http://127.0.0.1:$PORT/" >/dev/null; then
    service_ready=1
    break
  fi
  sleep 1
done
[[ $service_ready -eq 1 ]] || die "The service did not answer on 127.0.0.1:$PORT after 30 seconds. Check: systemctl status $SERVICE_NAME"

notice 'Installation complete'
printf 'Public URL: %s\n' "$APP_ORIGIN"
printf 'systemd unit: %s.service\n' "$SERVICE_NAME"
printf 'Nginx site: %s\n' "$NGINX_AVAILABLE"
printf 'App directory: %s\n' "$APP_DIR"
printf '\nUseful checks:\n  systemctl status %s\n  journalctl -u %s -f\n  nginx -t\n' "$SERVICE_NAME" "$SERVICE_NAME"
if [[ $HTTP_ONLY -eq 1 ]]; then
  printf '\nWARNING: this install is HTTP-only. Re-run with --letsencrypt-email or an existing certificate for HTTPS.\n'
fi
