@echo off
setlocal EnableExtensions

echo Building SpeedPin extension package...
echo.

for %%f in (manifest.json popup.html popup.js styles.css) do (
    if not exist "%%f" (
        echo ERROR: Missing required file: %%f
        exit /b 1
    )
)

if not exist "icons\icon16.png" (
    echo WARNING: icons missing. Run: python scripts\generate-icons.py
)

if exist "dist\staging" rmdir /s /q "dist\staging"
if not exist "dist" mkdir "dist"
mkdir "dist\staging"

copy /y "manifest.json" "dist\staging\" >nul
copy /y "popup.html" "dist\staging\" >nul
copy /y "popup.js" "dist\staging\" >nul
copy /y "styles.css" "dist\staging\" >nul

if exist "icons" (
    xcopy "icons" "dist\staging\icons\" /E /I /Y >nul
)

for /f "delims=" %%v in ('powershell -NoProfile -Command "(Get-Content manifest.json -Raw | ConvertFrom-Json).version"') do set VERSION=%%v

set "ZIP_NAME=SpeedPin-v%VERSION%.zip"

powershell -NoProfile -Command ^
    "Compress-Archive -Path 'dist/staging/*' -DestinationPath 'dist/%ZIP_NAME%' -Force"

copy /y "dist\%ZIP_NAME%" "extension.zip" >nul
rmdir /s /q "dist\staging"

echo.
echo Done!
echo   Release ZIP:  dist\%ZIP_NAME%
echo   Store alias:  extension.zip
echo.
echo Upload dist\%ZIP_NAME% to GitHub Releases or Chrome Web Store.
echo.
