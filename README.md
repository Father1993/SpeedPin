# SpeedPin

A minimal Chrome extension popup for managing quick links (pins). Save URLs with optional labels, reorder and edit them, import/export as JSON, and sync across devices via Chrome Sync.

**Author:** [Andrej Spinej](https://github.com/Father1993)  
**License:** [MIT](LICENSE)  
**Repository:** [github.com/Father1993/SpeedPin](https://github.com/Father1993/SpeedPin)

## Features

- Add links with optional labels
- Edit and delete pins
- Reorder pins (move up / down)
- Import and export pins as JSON (`quick-pins.json`)
- Automatic favicon display with fallback placeholder
- Sync across devices via `chrome.storage.sync` (with `local` fallback for large lists)
- Compact glassmorphism UI with custom scrollbar
- Manifest V3, single `storage` permission, no build step

## Project structure

```
SpeedPin/
├── manifest.json       # Extension config (Manifest V3)
├── popup.html          # Popup markup
├── popup.js            # All extension logic
├── styles.css          # UI styles
├── icons/              # Extension icons (16, 48, 128 px) — required for Web Store
├── PRIVACY_POLICY.md   # Privacy policy (required for Chrome Web Store)
├── PUBLISH_GUIDE.md    # Step-by-step Chrome Web Store publishing guide
├── LICENSE             # MIT license
├── CONTRIBUTING.md     # Contribution guidelines
├── .gitignore          # Git ignore rules
├── prepare-zip.bat     # ZIP pack script (Windows)
├── prepare-zip.sh      # ZIP pack script (Linux/macOS)
└── README.md
```

## Install (developer mode)

1. Clone the repository:

   ```bash
   git clone https://github.com/Father1993/SpeedPin.git
   cd SpeedPin
   ```

2. *(Optional)* Add icons to `icons/`:
   - `icon16.png` (16×16)
   - `icon48.png` (48×48)
   - `icon128.png` (128×128)

   The extension works without icons, but Chrome will show a default placeholder in the toolbar.

3. Open `chrome://extensions/` in Chrome.
4. Enable **Developer mode** (top right).
5. Click **Load unpacked** and select the project folder.
6. Pin the extension from the Extensions menu.

## Usage

1. Open the popup (SpeedPin icon in the toolbar).
2. Enter a **URL** (e.g. `https://example.com`).
3. Optionally add a **label**.
4. Click **Добавить** (Add) — the pin appears at the top of the list.
5. Click a pin name to open the link in a new tab.
6. Hover a row to reveal actions:
   - **↑ / ↓** — reorder
   - **✎** — edit (fills the form; click again to cancel)
   - **✕** — delete
7. **Экспорт** — download `quick-pins.json`
8. **Импорт** — restore pins from a JSON file (replaces current list after confirmation)

## How it works

- On startup, [`popup.js`](popup.js) loads pins from `chrome.storage.sync` and `chrome.storage.local` in parallel and picks the most complete list.
- New pins are added to the top; duplicate URLs replace the existing entry.
- Lists under ~7 KB are stored in `chrome.storage.sync`; larger lists use `chrome.storage.local`.
- On save, the inactive storage area is cleared to avoid sync/local desync.
- Favicons are loaded from [Google's favicon service](https://www.google.com/s2/favicons) by hostname, with an inline SVG fallback on error.

## Export / import format

```json
[
  { "url": "https://example.com", "label": "Example" }
]
```

Also accepts `{ "items": [...] }`.

## Packaging for Chrome Web Store

1. Add icons to `icons/` (recommended).
2. Host [`PRIVACY_POLICY.md`](PRIVACY_POLICY.md) publicly (e.g. GitHub raw link) for the store listing.
3. Create a ZIP:
   - **Windows:** `prepare-zip.bat`
   - **Linux/macOS:** `prepare-zip.sh`
4. Upload `extension.zip` to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

**Detailed guide:** [`PUBLISH_GUIDE.md`](PUBLISH_GUIDE.md)  
See also: [Chrome Web Store publish guide](https://developer.chrome.com/docs/webstore/publish/).

## Privacy

SpeedPin stores your links locally in Chrome. With Chrome Sync enabled, data syncs across your signed-in devices. Your saved links are not sent to third-party servers. Favicon requests go to Google CDN (hostname only).

Full details: [`PRIVACY_POLICY.md`](PRIVACY_POLICY.md)

## Customization

- **Styles:** edit [`styles.css`](styles.css)
- **Logic:** edit [`popup.js`](popup.js) — keep it simple (KISS)

## Technical details

| Item | Value |
|------|-------|
| Manifest | V3 |
| Permissions | `storage` |
| Storage | `chrome.storage.sync` (+ `local` fallback) |
| UI language | Russian (popup labels) |

## Links

- [Chrome Extensions documentation](https://developer.chrome.com/docs/extensions/)
- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [Pull Request #1 — initial features](https://github.com/Father1993/SpeedPin/pull/1)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Issues and pull requests are welcome.

---

**Version:** 1.0.1  
**Last updated:** June 2026
