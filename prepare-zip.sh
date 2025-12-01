#!/bin/bash

echo "Создание ZIP-архива для Chrome Web Store..."
echo ""

# Создаем временную папку
rm -rf extension-temp
mkdir extension-temp

# Копируем необходимые файлы
cp manifest.json extension-temp/
cp popup.html extension-temp/
cp popup.js extension-temp/
cp styles.css extension-temp/

# Копируем папку с иконками (если существует)
if [ -d "icons" ]; then
    cp -r icons extension-temp/
fi

# Создаем ZIP-архив
cd extension-temp
zip -r ../extension.zip *
cd ..

# Удаляем временную папку
rm -rf extension-temp

echo ""
echo "Готово! Архив создан: extension.zip"
echo ""
echo "ВАЖНО: Проверьте, что в папке icons есть файлы:"
echo "  - icon16.png"
echo "  - icon48.png"
echo "  - icon128.png"
echo ""
