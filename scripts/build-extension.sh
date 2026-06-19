#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

VERSION="$(sed -n 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' manifest.json | head -1)"
OUT_DIR="dist"
STAGING="$OUT_DIR/staging"
ZIP_NAME="SpeedPin-v${VERSION}.zip"
FILES=(manifest.json popup.html popup.js styles.css)

echo "Building SpeedPin v${VERSION}..."
echo ""

for file in "${FILES[@]}"; do
    if [[ ! -f "$file" ]]; then
        echo "ERROR: Missing required file: $file" >&2
        exit 1
    fi
done

if [[ ! -d icons ]]; then
    echo "WARNING: icons/ not found. Run: python scripts/generate-icons.py"
elif [[ ! -f icons/icon16.png || ! -f icons/icon48.png || ! -f icons/icon128.png ]]; then
    echo "WARNING: icons/ is incomplete. Run: python scripts/generate-icons.py"
fi

rm -rf "$STAGING"
mkdir -p "$STAGING"

for file in "${FILES[@]}"; do
    cp "$file" "$STAGING/"
done

if [[ -d icons ]]; then
    cp -r icons "$STAGING/"
fi

rm -f "$OUT_DIR/$ZIP_NAME" extension.zip
mkdir -p "$OUT_DIR"

if command -v zip >/dev/null 2>&1; then
    (cd "$STAGING" && zip -qr "../$ZIP_NAME" .)
elif command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe -NoProfile -Command \
        "Compress-Archive -Path '$STAGING/*' -DestinationPath '$OUT_DIR/$ZIP_NAME' -Force"
else
    echo "ERROR: Neither 'zip' nor PowerShell found. Use prepare-zip.bat on Windows." >&2
    exit 1
fi

cp "$OUT_DIR/$ZIP_NAME" extension.zip
rm -rf "$STAGING"

echo ""
echo "Done!"
echo "  Release ZIP:  dist/$ZIP_NAME"
echo "  Store alias:  extension.zip"
echo ""
echo "Verify: unzip -l dist/$ZIP_NAME"
echo "Upload dist/$ZIP_NAME to GitHub Releases or Chrome Web Store."
echo ""
