@echo off
echo Creating ZIP archive for Chrome Web Store...
echo.

if exist "extension-temp" rmdir /s /q "extension-temp"
mkdir "extension-temp"

copy "manifest.json" "extension-temp\"
copy "popup.html" "extension-temp\"
copy "popup.js" "extension-temp\"
copy "styles.css" "extension-temp\"

if exist "icons" (
    xcopy "icons" "extension-temp\icons\" /E /I /Y
)

powershell -Command "Compress-Archive -Path 'extension-temp\*' -DestinationPath 'extension.zip' -Force"

rmdir /s /q "extension-temp"

echo.
echo Done! Archive created: extension.zip
echo.
echo NOTE: Ensure icons/ contains (optional but recommended):
echo   - icon16.png
echo   - icon48.png
echo   - icon128.png
echo.
pause
