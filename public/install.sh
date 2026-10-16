#!/bin/sh
# Picturium installer and upgrader: https://picturium.cc
#
#   curl -fsSL https://picturium.cc/install.sh | sh
#
# Run it again to upgrade an existing install. Use -y to accept all defaults.
# Answers can be preset: PICTURIUM_DIR, PICTURIUM_VERSION, PICTURIUM_PORT,
# PICTURIUM_BIND, PICTURIUM_DATA.

set -eu

IMAGE=lamka02sk/picturium
TAGS_URL="https://hub.docker.com/v2/repositories/$IMAGE/tags?page_size=100"

YES=${PICTURIUM_YES:-}
for arg in "$@"; do
    case $arg in
        -y|--yes) YES=1 ;;
        *) echo "Unknown option: $arg" >&2; exit 1 ;;
    esac
done

if [ -t 1 ]; then B=$(printf '\033[1m'); G=$(printf '\033[32m'); Y=$(printf '\033[33m'); R=$(printf '\033[31m'); N=$(printf '\033[0m'); else B='' G='' Y='' R='' N=''; fi
info() { printf '%s==>%s %s\n' "$G" "$N" "$*"; }
warn() { printf '%swarning:%s %s\n' "$Y" "$N" "$*" >&2; }
die() { printf '%serror:%s %s\n' "$R" "$N" "$*" >&2; exit 1; }

# stdin is the script itself under `curl | sh`, so prompts read from the terminal
if [ -z "$YES" ] && ! { true </dev/tty; } 2>/dev/null; then
    warn "no terminal available, using defaults"
    YES=1
fi

ask() {
    if [ -n "$YES" ]; then REPLY=$2; return; fi
    printf '%s%s%s [%s]: ' "$B" "$1" "$N" "$2" >/dev/tty
    read -r REPLY </dev/tty || REPLY=
    [ -n "$REPLY" ] || REPLY=$2
}

confirm() {
    ask "$1 (y/n)" "$2"
    case $REPLY in [yY]*) return 0 ;; *) return 1 ;; esac
}

fetch() {
    if command -v curl >/dev/null 2>&1; then curl -fsSL "$1"
    elif command -v wget >/dev/null 2>&1; then wget -qO- "$1"
    else die "curl or wget is required"
    fi
}

secret() { head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n'; }

# Reads KEY=value from the existing .env without executing it
envget() { if [ -f "$DIR/.env" ]; then sed -n "s/^$1=//p" "$DIR/.env" | tail -n 1; fi; }

ver_num() { echo "$1" | awk -F. '{ printf "%d%06d%06d", $1, $2, $3 }'; }

# --- preflight -------------------------------------------------------------

command -v docker >/dev/null 2>&1 || die "Docker is not installed. Install it first: https://docs.docker.com/engine/install/"
docker compose version >/dev/null 2>&1 || die "Docker Compose v2 is required (the 'docker compose' plugin)"
docker info >/dev/null 2>&1 || die "cannot talk to the Docker daemon. Is it running, and is your user in the 'docker' group (or run with sudo)?"

case $(uname -m) in
    x86_64|amd64|aarch64|arm64) ;;
    *) die "unsupported architecture $(uname -m), images exist for amd64 and arm64 only" ;;
esac

if [ -z "${PICTURIUM_VERSION:-}" ]; then
    info "Looking up the latest picturium version"
    PICTURIUM_VERSION=$(fetch "$TAGS_URL" | grep -oE '"name":"[0-9]+\.[0-9]+\.[0-9]+"' | cut -d'"' -f4 \
        | sort -t. -k1,1n -k2,2n -k3,3n | tail -n 1) || true
    [ -n "$PICTURIUM_VERSION" ] || die "could not fetch versions from Docker Hub, set PICTURIUM_VERSION to install a specific one"
    PINNED=
else
    PINNED=1
fi

# --- questions -------------------------------------------------------------

if [ "$(id -u)" = 0 ]; then default_dir=/opt/picturium; else default_dir=$HOME/picturium; fi
ask "Install directory" "${PICTURIUM_DIR:-$default_dir}"
DIR=$REPLY
mkdir -p "$DIR"
DIR=$(cd "$DIR" && pwd)

CURRENT=$(envget PICTURIUM_VERSION)
TARGET=$PICTURIUM_VERSION
CONFIGURE=1

if [ -n "$CURRENT" ]; then
    CONFIGURE=
    if [ -n "$PINNED" ]; then
        info "Switching from $CURRENT to $TARGET"
    elif [ "$(ver_num "$TARGET")" -gt "$(ver_num "$CURRENT")" ]; then
        info "Installed version is $CURRENT, $TARGET is available"
        confirm "Upgrade to $TARGET?" y || TARGET=$CURRENT
    else
        info "Picturium $CURRENT is installed and up to date"
        TARGET=$CURRENT
    fi
    if confirm "Change configuration?" n; then CONFIGURE=1; fi
fi

PORT=${PICTURIUM_PORT:-$(envget PICTURIUM_PORT)}
BIND=${PICTURIUM_BIND:-$(envget PICTURIUM_BIND)}
DATA=${PICTURIUM_DATA:-$(envget PICTURIUM_DATA)}
SIGNATURE_ENABLED=$(envget PICTURIUM__SECURITY__SIGNATURE_ENABLED)
SIGNATURE_SECRET=$(envget PICTURIUM__SECURITY__SIGNATURE_SECRET)
HEALTH_TOKEN=$(envget PICTURIUM__SECURITY__HEALTH_TOKEN)
CORS=$(envget PICTURIUM__CORS__ALLOWED_ORIGINS)
MEMORY_LIMIT=$(envget PICTURIUM__CACHE__MEMORY__LIMIT)
DISK_LIMIT=$(envget PICTURIUM__CACHE__DISK__LIMIT)

if [ -n "$CONFIGURE" ]; then
    ask "Directory with the images to serve" "${DATA:-$DIR/data}"
    DATA=$REPLY

    ask "Port" "${PORT:-20045}"
    PORT=$REPLY

    ask "Listen address (127.0.0.1 if behind a reverse proxy)" "${BIND:-0.0.0.0}"
    BIND=$REPLY

    if confirm "Require signed URLs (recommended for public servers)?" "$([ "$SIGNATURE_ENABLED" = true ] && echo y || echo n)"; then
        SIGNATURE_ENABLED=true
        SIGNATURE_SECRET=${SIGNATURE_SECRET:-$(secret)}
    else
        SIGNATURE_ENABLED=false
    fi

    if confirm "Protect detailed /health output with a token?" "$([ -n "$HEALTH_TOKEN" ] || [ -z "$CURRENT" ] && echo y || echo n)"; then
        HEALTH_TOKEN=${HEALTH_TOKEN:-$(secret)}
    else
        HEALTH_TOKEN=
    fi

    ask "Allowed CORS origins (comma separated)" "${CORS:-*}"
    CORS=$REPLY

    ask "Memory cache size in MB" "${MEMORY_LIMIT:-256}"
    MEMORY_LIMIT=$REPLY

    ask "Disk cache size in MB" "${DISK_LIMIT:-1024}"
    DISK_LIMIT=$REPLY
fi

case $PORT in ''|*[!0-9]*) die "port must be a number" ;; esac
case $MEMORY_LIMIT$DISK_LIMIT in *[!0-9]*) die "cache sizes must be numbers" ;; esac

mkdir -p "$DATA"
DATA=$(cd "$DATA" && pwd)
# The container runs as uid 1500, so the data needs to be world readable
if [ -n "$(find "$DATA" -maxdepth 0 ! -perm -o=rx)" ]; then
    warn "$DATA is not readable by other users, picturium will not see it. Fix with: chmod -R o+rX '$DATA'"
fi

# --- write files -----------------------------------------------------------

MANAGED='PICTURIUM_(VERSION|PORT|BIND|DATA)|PICTURIUM__(SERVER__LOG_LEVEL|SECURITY__SIGNATURE_ENABLED|SECURITY__SIGNATURE_SECRET|SECURITY__HEALTH_TOKEN|CORS__ALLOWED_ORIGINS|CACHE__MEMORY__LIMIT|CACHE__DISK__LIMIT)'
EXTRA=
if [ -f "$DIR/.env" ]; then
    EXTRA=$(grep -vE "^(#|\$|($MANAGED)=)" "$DIR/.env" || true)
fi

umask 077
cat > "$DIR/.env" <<EOF
# Generated by https://picturium.cc/install.sh, re-run it to upgrade or reconfigure.
# Any config key can be added as PICTURIUM__SECTION__KEY=value,
# see https://picturium.cc/docs/configuration

PICTURIUM_VERSION=$TARGET
PICTURIUM_PORT=$PORT
PICTURIUM_BIND=$BIND
PICTURIUM_DATA=$DATA

PICTURIUM__SERVER__LOG_LEVEL=info
PICTURIUM__SECURITY__SIGNATURE_ENABLED=$SIGNATURE_ENABLED
PICTURIUM__SECURITY__SIGNATURE_SECRET=$SIGNATURE_SECRET
PICTURIUM__SECURITY__HEALTH_TOKEN=$HEALTH_TOKEN
PICTURIUM__CORS__ALLOWED_ORIGINS=$CORS
PICTURIUM__CACHE__MEMORY__LIMIT=$MEMORY_LIMIT
PICTURIUM__CACHE__DISK__LIMIT=$DISK_LIMIT
EOF
if [ -n "$EXTRA" ]; then printf '\n%s\n' "$EXTRA" >> "$DIR/.env"; fi
umask 022

cat > "$DIR/compose.yaml" <<'EOF'
services:
  picturium:
    image: lamka02sk/picturium:${PICTURIUM_VERSION}
    restart: unless-stopped
    ports:
      - "${PICTURIUM_BIND}:${PICTURIUM_PORT}:20045"
    volumes:
      - "${PICTURIUM_DATA}:/app/data:ro"
      - cache:/app/cache
    env_file: .env

volumes:
  cache:
EOF

# --- start -----------------------------------------------------------------

cd "$DIR"
info "Pulling $IMAGE:$TARGET"
docker compose pull -q
info "Starting picturium"
docker compose up -d --remove-orphans

case $BIND in 0.0.0.0|::|'') HOST=127.0.0.1 ;; *) HOST=$BIND ;; esac
URL="http://$HOST:$PORT"

info "Waiting for picturium to become healthy"
i=0
until fetch "$URL/health" >/dev/null 2>&1; do
    i=$((i + 1))
    if [ "$i" -ge 30 ]; then
        docker compose logs --tail 50
        die "picturium did not start within 30 seconds, see the logs above"
    fi
    sleep 1
done

# --- summary ---------------------------------------------------------------

echo
printf '%sPicturium %s is running at %s%s\n\n' "$B" "$TARGET" "$URL" "$N"
echo "  Images:       $DATA"
echo "  Try:          $URL/<image>.jpg?w=800&f=webp"
[ "$SIGNATURE_ENABLED" = true ] && echo "  URL secret:   $SIGNATURE_SECRET"
[ -n "$HEALTH_TOKEN" ] && echo "  Health token: $HEALTH_TOKEN"
echo
echo "  Config:       $DIR/.env"
echo "  Upgrade:      curl -fsSL https://picturium.cc/install.sh | sh"
echo "  Logs:         cd '$DIR' && docker compose logs -f"
echo "  Uninstall:    cd '$DIR' && docker compose down -v"
