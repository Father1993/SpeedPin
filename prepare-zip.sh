#!/bin/bash

echo "Creating ZIP archive for Chrome Web Store..."
echo ""

rm -rf extension-temp
mkdir extension-temp

cp manifest.json extension-temp/
cp popup.html extension-temp/
cp popup.js extension-temp/
cp styles.css extension-temp/

if [ -d "icons" ]; then
    cp -r icons extension-temp/
fi

cd extension-temp
zip -r ../extension.zip *
cd ..

rm -rf extension-temp

echo ""
echo "Done! Archive created: extension.zip"
echo ""
echo "NOTE: Ensure icons/ contains (optional but recommended):"
echo "  - icon16.png"
echo "  - icon48.png"
echo "  - icon128.png"
echo ""
