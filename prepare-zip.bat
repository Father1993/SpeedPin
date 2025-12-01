@echo off
echo Создание ZIP-архива для Chrome Web Store...
echo.

REM Создаем временную папку
if exist "extension-temp" rmdir /s /q "extension-temp"
mkdir "extension-temp"

REM Копируем необходимые файлы
copy "manifest.json" "extension-temp\"
copy "popup.html" "extension-temp\"
copy "popup.js" "extension-temp\"
copy "styles.css" "extension-temp\"

REM Копируем папку с иконками (если существует)
if exist "icons" (
    xcopy "icons" "extension-temp\icons\" /E /I /Y
)

REM Создаем ZIP-архив
powershell -Command "Compress-Archive -Path 'extension-temp\*' -DestinationPath 'extension.zip' -Force"

REM Удаляем временную папку
rmdir /s /q "extension-temp"

echo.
echo Готово! Архив создан: extension.zip
echo.
echo ВАЖНО: Проверьте, что в папке icons есть файлы:
echo   - icon16.png
echo   - icon48.png
echo   - icon128.png
echo.
pause
