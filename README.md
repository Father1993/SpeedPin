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
- Instant popup startup via a Manifest V3 service worker cache
- Sync across devices via `chrome.storage.sync` (with `local` fallback for large lists)
- Compact glassmorphism UI with custom scrollbar
- Manifest V3, single `storage` permission, no build step

## Quick start

### Install from GitHub Release (recommended)

1. Open [Releases](https://github.com/Father1993/SpeedPin/releases)
2. Download `SpeedPin-vX.Y.Z.zip` from the latest release
3. Unzip to a folder
4. Open `chrome://extensions/` → enable **Developer mode**
5. Click **Load unpacked** → select the unzipped folder

### Install from source (developers)

```bash
git clone https://github.com/Father1993/SpeedPin.git
cd SpeedPin
```

1. Open `chrome://extensions/` in Chrome
2. Enable **Developer mode**
3. Click **Load unpacked** and select the project folder
4. Pin the extension from the Extensions menu

> Load the **repository root** (where `manifest.json` lives), not a subfolder.

## Usage

1. Open the popup (SpeedPin icon in the toolbar)
2. Enter a **URL** (e.g. `https://example.com`)
3. Optionally add a **label**
4. Click **Добавить** (Add) — the pin appears at the top of the list
5. Click a pin name to open the link in a new tab
6. Hover a row to reveal actions:
   - **↑ / ↓** — reorder
   - **✎** — edit (fills the form; click again to cancel)
   - **✕** — delete
7. **Экспорт** — download `quick-pins.json`
8. **Импорт** — restore pins from a JSON file (replaces current list after confirmation)

## How it works

- [`background.js`](background.js) preloads pins from `chrome.storage.sync` and `chrome.storage.local` into a service worker cache
- On startup, [`popup.js`](popup.js) renders immediately, asks the service worker for cached pins, and falls back to direct storage reads if needed
- New pins are added to the top; duplicate URLs replace the existing entry
- Lists under ~7 KB are stored in `chrome.storage.sync`; larger lists use `chrome.storage.local`
- On save, the inactive storage area is cleared to avoid sync/local desync
- Favicons are loaded lazily from [Google's favicon service](https://www.google.com/s2/favicons) by hostname, with an inline SVG fallback before load or on error

## Export / import format

```json
[
  { "url": "https://example.com", "label": "Example" }
]
```

Also accepts `{ "items": [...] }`.

## Build & release

SpeedPin has **no npm/webpack build**. Packaging copies extension files into a ZIP.

### Build the extension ZIP

**Linux / macOS / Git Bash:**

```bash
./build.sh
```

**Windows (CMD / PowerShell):**

```bat
prepare-zip.bat
```

**Output:**

| File | Use |
|------|-----|
| `dist/SpeedPin-v1.0.2.zip` | GitHub Releases |
| `extension.zip` | Chrome Web Store (same content) |

**Regenerate icons:**

```bash
python scripts/generate-icons.py
./build.sh
```

**Verify ZIP structure** (files must be at ZIP root):

```bash
unzip -l dist/SpeedPin-v1.0.2.zip
```

### Publish a GitHub Release

Full beginner-friendly guide: **[`RELEASE.md`](RELEASE.md)**

Summary:

1. Bump `version` in `manifest.json`
2. Update `CHANGELOG.md`
3. Test locally → run `./build.sh`
4. Create git tag: `git tag -a v1.0.2 -m "SpeedPin v1.0.2"`
5. Push tag: `git push origin v1.0.2`
6. Create release on GitHub and attach `dist/SpeedPin-v1.0.2.zip`

See [`CHANGELOG.md`](CHANGELOG.md) for version history.

## Project structure

```
SpeedPin/
├── manifest.json              # Extension config (Manifest V3)
├── popup.html                 # Popup markup
├── popup.js                   # Extension logic
├── background.js              # Service worker cache for instant popup startup
├── styles.css                 # UI styles
├── icons/                     # Extension icons (16, 48, 128 px)
├── scripts/
│   ├── build-extension.sh     # Packaging script (canonical)
│   └── generate-icons.py      # Icon generator (stdlib only)
├── build.sh                   # Shortcut → scripts/build-extension.sh
├── prepare-zip.bat            # Windows packaging
├── prepare-zip.sh             # Alias for build.sh
├── dist/                      # Build output (gitignored)
├── CHANGELOG.md               # Version history
├── RELEASE.md                 # GitHub release guide
├── PRIVACY_POLICY.md          # Privacy policy (Chrome Web Store)
├── PUBLISH_GUIDE.md           # Chrome Web Store guide
├── CONTRIBUTING.md            # Contribution guidelines
└── README.md
```

## Chrome Web Store

To publish on the Chrome Web Store:

1. Build the ZIP: `./build.sh`
2. Follow [`PUBLISH_GUIDE.md`](PUBLISH_GUIDE.md)
3. Upload `extension.zip` to the [Developer Dashboard](https://chrome.google.com/webstore/devconsole)

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
| Background | MV3 service worker cache |
| UI language | Russian (popup labels) |

## Links

- [GitHub Releases](https://github.com/Father1993/SpeedPin/releases)
- [Chrome Extensions documentation](https://developer.chrome.com/docs/extensions/)
- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Issues and pull requests are welcome.

---

**Version:** 1.0.2  
**Last updated:** July 2026
