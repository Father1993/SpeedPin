# Publishing SpeedPin to the Chrome Web Store

**Author:** Andrej Spinej  
**Repository:** [github.com/Father1993/SpeedPin](https://github.com/Father1993/SpeedPin)

## Preparation

### 1. Required items

#### Manifest V3
SpeedPin already uses Manifest V3.

#### Extension icons
SpeedPin ships with icons in `icons/` and references them in `manifest.json`.

To regenerate:

```bash
python scripts/generate-icons.py
```

Required sizes:

- `icons/icon16.png` — 16×16 px
- `icons/icon48.png` — 48×48 px
- `icons/icon128.png` — 128×128 px

Tools for custom icons: [favicon.io](https://favicon.io), [realfavicongenerator.net](https://realfavicongenerator.net), Figma, GIMP.

#### Privacy Policy
Required for extensions with the `storage` permission.

1. Publish [`PRIVACY_POLICY.md`](PRIVACY_POLICY.md) online.
2. Use this URL in the store listing:

   `https://github.com/Father1993/SpeedPin/blob/master/PRIVACY_POLICY.md`

#### Screenshots
At least 1–2 screenshots (recommended 3–5):

- Size: minimum 1280×800 or 640×400 px
- Format: PNG or JPEG
- Show the popup with several pins

#### Store listing text
Prepare:

- **Short description** (max 132 characters)
- **Detailed description** (up to 16,000 characters)
- **Category:** Productivity

### 2. Code review checklist

- All logic is in extension files (no remote scripts)
- No `eval()`
- Permissions: only `storage`
- Storage: `chrome.storage.sync` with `local` fallback for large lists
- Error handling in `save()` and import

### 3. ZIP archive

**Do not include:**

- `.git/`
- `README.md`, `LICENSE`, `CHANGELOG.md`, `RELEASE.md`, `CONTRIBUTING.md`, `PUBLISH_GUIDE.md`
- `dist/`, `scripts/`, build scripts, development artifacts

**Include:**

```
SpeedPin-v1.0.1.zip
├── manifest.json
├── popup.html
├── popup.js
├── styles.css
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

Create the archive from the project root:

```bash
./build.sh
```

Or on Windows:

```bat
prepare-zip.bat
```

Output:

- `dist/SpeedPin-v1.0.1.zip` — for GitHub Releases
- `extension.zip` — upload this to Chrome Web Store

Verify structure:

```bash
unzip -l dist/SpeedPin-v1.0.1.zip
```

For GitHub Releases, see [`RELEASE.md`](RELEASE.md).

## Publishing steps

### Step 1: Developer account

1. Open [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Sign in with Google
3. Pay the one-time **$5** registration fee
4. Complete developer profile

### Step 2: Upload extension

1. Click **New item**
2. Upload `extension.zip`
3. Fill in the form:

| Field | Suggested value |
|-------|-----------------|
| Name | SpeedPin |
| Short description | Minimal quick-link manager with favicons, reorder, edit, and JSON backup |
| Category | Productivity |
| Homepage | https://github.com/Father1993/SpeedPin |
| Privacy Policy URL | https://github.com/Father1993/SpeedPin/blob/master/PRIVACY_POLICY.md |

**Visibility:**

- **Public** — visible to everyone (review required)
- **Unlisted** — direct link only (often faster review)
- **Private** — only you

### Step 3: Review

- Usually **1–3 business days**
- You receive email updates
- If rejected — fix issues and resubmit

### Step 4: Updates

- Bump `version` in `manifest.json` for each release
- Upload a new ZIP

## Example store descriptions

### Short (132 chars max)

```
Minimal popup for quick links: favicons, reorder, edit, JSON import/export, Chrome Sync.
```

### Full description

```
SpeedPin is a lightweight Chrome extension for managing quick links (pins) from the toolbar popup.

Features:
• Save URLs with optional labels
• Edit, delete, and reorder pins
• Import and export pins as JSON
• Favicons with fallback placeholder
• Sync across devices via Chrome Sync (local fallback for large lists)
• Clean, compact UI

How to use:
1. Click the SpeedPin icon
2. Enter a URL and optional label
3. Click Add (Добавить)
4. Click a pin to open it in a new tab
5. Hover a row for reorder, edit, and delete actions
6. Use Export / Import for backup and migration

Privacy:
Your links are stored locally in Chrome. With Sync enabled, data syncs across your devices. Saved links are not sent to third-party servers. Favicon requests go to Google CDN (hostname only).

Author: Andrej Spinej
Open source: https://github.com/Father1993/SpeedPin
```

## Common rejection reasons

1. Missing Privacy Policy URL
2. Wrong icon sizes (must be exactly 16, 48, 128 px)
3. Extra files in ZIP (`.git`, `node_modules`)
4. Wrong ZIP structure (files must be at root, not nested in a folder)
5. Remote code / external scripts (not allowed in MV3)

## Links

- [Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [Publish guide](https://developer.chrome.com/docs/webstore/publish/)
- [Program policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [MV3 requirements](https://developer.chrome.com/docs/webstore/program-policies/mv3-requirements/)

## Pre-publish checklist

- [ ] Icons present in `icons/` (run `python scripts/generate-icons.py` if missing)
- [ ] Privacy Policy URL is public and working
- [ ] Screenshots ready (min 1, recommended 3–5)
- [ ] Store descriptions written
- [ ] ZIP built with `./build.sh` or `prepare-zip.bat` (no dev files inside)
- [ ] `version` in `manifest.json` is correct (currently 1.0.1)
- [ ] Extension tested locally (add, edit, reorder, import, export)
- [ ] Developer account registered ($5 paid)
