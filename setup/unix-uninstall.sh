#!/bin/sh
# Uninstaller for macOS (Homebrew) and Ubuntu/Debian (dpkg).
# Every value below is rewritten by scripts/sync-brand.mjs from brand.json.
# Usage:
# @brand:start usage
#   curl -fsSL https://raw.githubusercontent.com/tonmoydeb404/cam-tuner/main/setup/unix-uninstall.sh | sh
# @brand:end usage
set -e

TAP="tonmoydeb404/cam-tuner"
REPO="tonmoydeb404/cam-tuner"
IDENTIFIER="app.camtuner"
APP_NAME="CamTuner"
PACKAGE="cam-tuner"

uninstall_macos() {
  echo "==> Quitting ${APP_NAME} if it is running..."
  osascript -e "quit app \"${APP_NAME}\"" 2>/dev/null || pkill -x "${APP_NAME}" 2>/dev/null || true

  echo "==> Removing ${APP_NAME}.app..."
  brew uninstall --cask "${PACKAGE}" 2>/dev/null || sudo rm -rf "/Applications/${APP_NAME}.app" 2>/dev/null || true

  echo "==> Removing Homebrew tap ${TAP}..."
  brew untap "${TAP}" 2>/dev/null || true

  echo "==> Removing launch-at-login agent..."
  launchctl bootout "gui/$(id -u)/${IDENTIFIER}" 2>/dev/null || true
  rm -f "$HOME/Library/LaunchAgents/${IDENTIFIER}.plist" 2>/dev/null || true

  echo "==> Removing user data..."
  rm -rf "$HOME/Library/Application Support/${IDENTIFIER}" \
         "$HOME/Library/Caches/${IDENTIFIER}" \
         "$HOME/Library/HTTPStorages/${IDENTIFIER}" \
         "$HOME/Library/Logs/${IDENTIFIER}" \
         "$HOME/Library/WebKit/${IDENTIFIER}" \
         "$HOME/Library/Preferences/${IDENTIFIER}.plist" \
         "$HOME/Library/Saved Application State/${IDENTIFIER}.savedState" 2>/dev/null || true

  echo "==> Done! ${APP_NAME} has been removed."
}

uninstall_linux() {
  echo "==> Quitting ${APP_NAME} if it is running..."
  pkill -x "${APP_NAME}" 2>/dev/null || true

  echo "==> Removing ${APP_NAME} package..."
  if [ "$(id -u)" = "0" ]; then
    dpkg -r "${PACKAGE}" 2>/dev/null || apt-get remove -y "${PACKAGE}" 2>/dev/null || true
  else
    echo "    Your password is required (sudo) to remove the package."
    sudo -v
    sudo dpkg -r "${PACKAGE}" 2>/dev/null || sudo apt-get remove -y "${PACKAGE}" 2>/dev/null || true
  fi

  echo "==> Removing launch-at-login entry..."
  rm -f "$HOME/.config/autostart/"*"${PACKAGE}"* "$HOME/.config/autostart/"*"${APP_NAME}"* 2>/dev/null || true

  echo "==> Removing user data..."
  rm -rf "$HOME/.local/share/${IDENTIFIER}" \
         "$HOME/.local/state/${IDENTIFIER}" \
         "$HOME/.config/${IDENTIFIER}" \
         "$HOME/.cache/${IDENTIFIER}" 2>/dev/null || true

  echo "==> Done! ${APP_NAME} has been removed."
}

case "$(uname -s)" in
  Darwin)
    uninstall_macos
    ;;
  Linux)
    uninstall_linux
    ;;
  *)
    echo "This uninstaller only supports macOS and Ubuntu/Debian."
    echo "On Windows, use Add/Remove Programs or:"
    echo "  irm https://raw.githubusercontent.com/${REPO}/main/setup/windows-uninstall.ps1 | iex"
    exit 1
    ;;
esac
