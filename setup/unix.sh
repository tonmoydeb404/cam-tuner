#!/bin/sh
# Installer for macOS (via Homebrew) and Ubuntu/Debian (via .deb).
# Usage:
# @brand:start usage
#   curl -fsSL https://raw.githubusercontent.com/tonmoydeb404/cam-tuner/main/setup/unix.sh | sh
#   curl -fsSL https://raw.githubusercontent.com/tonmoydeb404/cam-tuner/main/setup/unix.sh | sh -s -- v3.1.2
# @brand:end usage
set -e

# Every value below is rewritten by scripts/sync-brand.mjs from brand.json.
APP_NAME="CamTuner"
PACKAGE="cam-tuner"
TAP="tonmoydeb404/cam-tuner"
TAP_URL="https://github.com/tonmoydeb404/cam-tuner.git"
REPO="tonmoydeb404/cam-tuner"
# Optional version tag (e.g. "v2.0.3"); defaults to the pinned version below.
# The default is rewritten by scripts/sync-brand.mjs on every release, so this
# installer never calls api.github.com (rate limited to 60 requests/hour per
# IP, shared by every machine behind the same network).
DEFAULT_VERSION="v3.1.2"
VERSION_ARG="${1:-}"
TAG="v$(printf '%s' "${1:-$DEFAULT_VERSION}" | sed 's/^v//')"

install_macos() {
  if [ "$(uname -m)" != "arm64" ]; then
    echo "Only Apple Silicon (arm64) builds are currently published."
    echo "Download other builds manually from: https://github.com/${REPO}/releases/latest"
    exit 1
  fi

  if ! command -v brew >/dev/null 2>&1; then
    echo "Homebrew is required but was not found."
    echo "Install it from https://brew.sh, then re-run this script."
    exit 1
  fi

  # Homebrew refuses to run as root; this installer must run as your normal user.
  if [ "$(id -u)" = "0" ]; then
    echo "This installer must run as your normal user, not root."
    echo "Homebrew cannot operate under sudo. Re-run without sudo:"
    echo "  curl -fsSL https://raw.githubusercontent.com/${REPO}/main/setup/unix.sh | sh"
    exit 1
  fi

  if [ -n "$VERSION_ARG" ]; then
    echo "Note: Homebrew always installs the tap's current cask version; a"
    echo "pinned version argument is only honored for Linux installs."
  fi

  export HOMEBREW_NO_AUTO_UPDATE=1
  export HOMEBREW_NO_INSTALL_CLEANUP=1
  export HOMEBREW_NO_ENV_HINTS=1

  echo "==> Tapping ${TAP}..."
  brew tap "$TAP" "$TAP_URL"

  echo "==> Trusting ${TAP}..."
  brew trust "$TAP" 2>/dev/null || true

  # `brew tap` is a no-op when the tap already exists, and
  # HOMEBREW_NO_AUTO_UPDATE=1 disables the auto-update that would otherwise
  # refresh it. Pull the tap explicitly so a new release is visible;
  # otherwise `brew install` keeps reporting "already installed" on the
  # previously installed version.
  echo "==> Updating ${TAP}..."
  git -C "$(brew --repo "$TAP")" pull --ff-only -q 2>/dev/null || true

  echo "==> Installing ${APP_NAME} ${TAG} into /Applications..."
  echo "    Your login password is required to complete the install."
  sudo -v
  # Keep sudo credentials fresh so a slow install never re-prompts.
  ( while true; do sudo -n true 2>/dev/null || exit; sleep 60; done ) &
  SUDO_KEEPALIVE_PID=$!
  trap 'kill "$SUDO_KEEPALIVE_PID" 2>/dev/null' EXIT

  # `brew install` never upgrades an already-installed cask, so a re-run
  # of this installer would stick on the old version. Upgrade when present,
  # install when not.
  if brew list --cask "${PACKAGE}" >/dev/null 2>&1; then
    brew upgrade --cask "${PACKAGE}"
  else
    brew install --cask "${PACKAGE}"
  fi

  # The app is unsigned; clear macOS quarantine so it isn't flagged as damaged.
  if [ -d "/Applications/${APP_NAME}.app" ]; then
    xattr -dr com.apple.quarantine "/Applications/${APP_NAME}.app" 2>/dev/null \
      || sudo xattr -dr com.apple.quarantine "/Applications/${APP_NAME}.app" 2>/dev/null \
      || true
  fi

  kill "$SUDO_KEEPALIVE_PID" 2>/dev/null || true

  echo "==> Done! Launch ${APP_NAME} from /Applications/${APP_NAME}.app"
}

install_linux() {
  if [ "$(uname -m)" != "x86_64" ]; then
    echo "Only x86_64 builds are currently published for Linux."
    echo "Download other builds manually from: https://github.com/${REPO}/releases/latest"
    exit 1
  fi

  if ! command -v dpkg >/dev/null 2>&1; then
    echo "This installer only supports Debian/Ubuntu (dpkg not found)."
    echo "Download other builds manually from: https://github.com/${REPO}/releases/latest"
    exit 1
  fi

  if [ "$TAG" = "vlatest" ]; then
    echo "This installer ships a pinned default version instead of querying"
    echo "the rate-limited GitHub API. Pass an explicit version (e.g. v2.0.3)"
    echo "or browse releases: https://github.com/${REPO}/releases"
    exit 1
  fi

  echo "==> Installing ${APP_NAME} ${TAG}..."
  DEB_URL="https://github.com/${REPO}/releases/download/${TAG}/${APP_NAME}_${TAG#v}_amd64.deb"

  TMP_DEB=$(mktemp -t "${PACKAGE}.XXXXXX.deb")
  trap 'rm -f "$TMP_DEB"' EXIT

  echo "==> Downloading ${APP_NAME}..."
  if ! curl -fsSL "$DEB_URL" -o "$TMP_DEB"; then
    echo "Download failed: ${DEB_URL}"
    echo "Browse available releases: https://github.com/${REPO}/releases"
    exit 1
  fi

  echo "==> Installing ${APP_NAME}..."
  if [ "$(id -u)" != "0" ]; then
    echo "    Your password is required (sudo) to install system-wide."
    sudo -v
  fi
  sudo dpkg -i "$TMP_DEB" || sudo apt-get install -f -y

  echo "==> Done! Launch ${APP_NAME} from your applications menu."
}

case "$(uname -s)" in
  Darwin)
    install_macos
    ;;
  Linux)
    install_linux
    ;;
  *)
    echo "This installer only supports macOS and Ubuntu/Debian. For Windows builds, see:"
    echo "https://github.com/${REPO}/releases/latest"
    exit 1
    ;;
esac
