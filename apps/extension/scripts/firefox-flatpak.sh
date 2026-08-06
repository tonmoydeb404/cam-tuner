#!/usr/bin/env bash
# Shim so web-ext/wxt can launch the Flatpak-installed Firefox as if it were a
# regular binary on $PATH.
exec flatpak run org.mozilla.firefox "$@"
