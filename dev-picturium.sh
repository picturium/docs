#!/usr/bin/env bash
# Serves this site's public/ through picturium, so the homepage and playground
# hit a real instance in dev. There is no released image yet, so this runs the
# dev image against the ../picturium2 checkout, the same way its own dev.sh does
# (cargo watch, rebuilds on source changes).
set -euo pipefail

docs="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
src="${PICTURIUM_SRC:-$docs/../picturium2}"
port="${PICTURIUM_PORT:-20048}"
image="${PICTURIUM_IMAGE:-lamka02sk/picturium-dev:8.18.4}"

[ -d "$src/src" ] || { echo "picturium source not found at $src — set PICTURIUM_SRC" >&2; exit 1; }

mkdir -p "$docs/.picturium-cache"
docker volume create picturium-cargo-cache >/dev/null

# public/ is mounted read-only over the default data dir, so URLs stay
# /samples/<file> with no prefix, matching PICTURIUM in src/consts.ts.
exec docker run --rm --name picturium-docs --init \
  -v "$src:/root/picturium" \
  -v "$src/../picturium-libvips:/root/picturium-libvips" \
  -v picturium-cargo-cache:/root/.cargo/registry/cache \
  -v "$docs/public:/root/picturium/data:ro" \
  -v "$docs/.picturium-cache:/root/picturium/cache" \
  -v /usr/share/fonts:/usr/share/fonts \
  -e PICTURIUM__SERVER__PORT="$port" \
  -e PICTURIUM__SERVER__HOST=0.0.0.0 \
  -p "127.0.0.1:$port:$port" \
  --cap-add=SYS_PTRACE --security-opt seccomp=unconfined \
  "$image"
