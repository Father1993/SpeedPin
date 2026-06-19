# GitHub Release Guide

Step-by-step instructions for publishing **SpeedPin** on GitHub Releases.

**Author:** [Andrej Spinej](https://github.com/Father1993)  
**Repository:** [github.com/Father1993/SpeedPin](https://github.com/Father1993/SpeedPin)

---

## Before you start

You need:

- A [GitHub](https://github.com) account
- [Git](https://git-scm.com/downloads) installed
- [Google Chrome](https://www.google.com/chrome/) for testing
- **Windows:** Git Bash (included with Git) or PowerShell  
- **Linux/macOS:** Bash and `zip` (`sudo apt install zip` on Ubuntu)

Optional but recommended:

- [Python 3](https://www.python.org/) — only for regenerating icons

---

## Step 1 — Prepare the release branch

SpeedPin development happens on `dev`. For a stable release, merge into `main`:

```bash
git checkout main
git pull origin main
git merge dev
```

> **Beginner note:** If `main` does not exist yet, create it from `dev`:
> ```bash
> git checkout -b main
> git push -u origin main
> ```

Resolve any merge conflicts, then test locally (Step 3) before tagging.

---

## Step 2 — Set the version

The version lives in `manifest.json`:

```json
"version": "1.0.1"
```

Rules (Semantic Versioning):

| Change type | Example | When to use |
|-------------|---------|-------------|
| **PATCH** | 1.0.1 → 1.0.2 | Bug fixes only |
| **MINOR** | 1.0.1 → 1.1.0 | New features, backward compatible |
| **MAJOR** | 1.0.1 → 2.0.0 | Breaking changes |

After changing the version:

1. Update `CHANGELOG.md` with a new section and date
2. Update the version line at the bottom of `README.md`

Commit:

```bash
git add manifest.json CHANGELOG.md README.md
git commit -m "chore(release): bump version to 1.0.1"
git push origin main
```

---

## Step 3 — Test the extension locally

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the **project root folder** (where `manifest.json` is)
5. Test every feature:
   - Add a pin with URL and label
   - Reorder (↑ / ↓)
   - Edit (✎) and cancel edit
   - Delete (✕)
   - Export JSON
   - Import JSON (confirm dialog)

> **Beginner note:** After code changes, click the **reload** icon on the extension card in `chrome://extensions/` — you do not need to remove and re-add the extension.

---

## Step 4 — Build the release ZIP

From the project root:

**Linux / macOS / Git Bash (Windows):**

```bash
chmod +x build.sh scripts/build-extension.sh
./build.sh
```

**Windows (Command Prompt / PowerShell):**

```bat
prepare-zip.bat
```

**Regenerate icons (optional):**

```bash
python scripts/generate-icons.py
./build.sh
```

### Build output

| File | Purpose |
|------|---------|
| `dist/SpeedPin-v1.0.1.zip` | Upload to **GitHub Releases** |
| `extension.zip` | Same content — alias for **Chrome Web Store** |

### Verify ZIP structure (important)

Extension files must be at the **root** of the ZIP, not inside a subfolder.

```bash
unzip -l dist/SpeedPin-v1.0.1.zip
```

Expected contents:

```
manifest.json
popup.html
popup.js
styles.css
icons/icon16.png
icons/icon48.png
icons/icon128.png
```

> **Beginner note:** If you see `SpeedPin/manifest.json` inside the ZIP (nested folder), Chrome Web Store will reject it. Use the provided build scripts — they pack files correctly.

---

## Step 5 — Test the ZIP

1. Unzip `dist/SpeedPin-v1.0.1.zip` to a temporary folder
2. In `chrome://extensions/`, click **Load unpacked**
3. Select the **unzipped folder**
4. Run the same tests as Step 3

This confirms the packaged build matches your source.

---

## Step 6 — Create a Git tag

Tags mark a specific commit as a release. Use the same version as `manifest.json`:

```bash
git tag -a v1.0.1 -m "SpeedPin v1.0.1"
git push origin v1.0.1
```

> **Beginner note:** Tag name must start with `v` (e.g. `v1.0.1`) — this matches GitHub release conventions and the link in `CHANGELOG.md`.

To fix a tag mistake (only if not published yet):

```bash
git tag -d v1.0.1
git push origin :refs/tags/v1.0.1
git tag -a v1.0.1 -m "SpeedPin v1.0.1"
git push origin v1.0.1
```

---

## Step 7 — Create the GitHub Release

### Option A — GitHub website (recommended for beginners)

1. Open [github.com/Father1993/SpeedPin/releases](https://github.com/Father1993/SpeedPin/releases)
2. Click **Draft a new release**
3. Click **Choose a tag** → select `v1.0.1` (or type it and choose **Create new tag on publish**)
4. **Release title:** `SpeedPin v1.0.1`
5. Paste the release description (see [Release text templates](#release-text-templates) below)
6. Attach `dist/SpeedPin-v1.0.1.zip` under **Assets**
7. Check **Set as the latest release** (for stable releases)
8. Click **Publish release**

### Option B — GitHub CLI

```bash
gh release create v1.0.1 dist/SpeedPin-v1.0.1.zip \
  --title "SpeedPin v1.0.1" \
  --notes-file RELEASE_NOTES_v1.0.1.md
```

---

## Step 8 — After publishing

- [ ] Confirm the ZIP downloads and installs via **Load unpacked**
- [ ] Check that `CHANGELOG.md` links to the new release tag
- [ ] Merge `main` back into `dev` if you use both branches:
  ```bash
  git checkout dev
  git merge main
  git push origin dev
  ```
- [ ] (Optional) Publish to Chrome Web Store — see [`PUBLISH_GUIDE.md`](PUBLISH_GUIDE.md)

---

## Release text templates

### Title

```
SpeedPin v1.0.1
```

### Description (copy for GitHub Release)

```markdown
## SpeedPin v1.0.1

Minimal Chrome extension popup for quick links — favicons, reorder, edit, and JSON backup.

### Highlights

- Add, edit, delete, and reorder pins from the toolbar popup
- Import / export pins as JSON (`quick-pins.json`)
- Automatic favicons with fallback placeholder
- Sync across devices via Chrome Sync (local fallback for large lists)
- Manifest V3 — single `storage` permission, no build step

### Install from this release

1. Download **`SpeedPin-v1.0.1.zip`** below
2. Unzip to a folder
3. Open `chrome://extensions/` → enable **Developer mode**
4. Click **Load unpacked** → select the unzipped folder

### Install from source (developers)

```bash
git clone https://github.com/Father1993/SpeedPin.git
cd SpeedPin
git checkout v1.0.1
```

Then load the project folder as unpacked in Chrome.

### Full changelog

See [CHANGELOG.md](https://github.com/Father1993/SpeedPin/blob/main/CHANGELOG.md).
```

---

## Common mistakes

| Problem | Cause | Fix |
|---------|-------|-----|
| Extension does not load | Wrong folder selected | Select folder that contains `manifest.json` |
| ZIP rejected by Web Store | Nested folder in ZIP | Rebuild with `./build.sh` |
| Tag already exists | Re-releasing same version | Bump version in `manifest.json` first |
| Icons missing in toolbar | `icons/` not in ZIP | Run `python scripts/generate-icons.py` then rebuild |
| Changes not visible | Old extension cached | Click reload on `chrome://extensions/` |

---

## Quick checklist

- [ ] Version bumped in `manifest.json`
- [ ] `CHANGELOG.md` updated
- [ ] Extension tested (unpacked from source)
- [ ] `./build.sh` or `prepare-zip.bat` run successfully
- [ ] ZIP structure verified (`manifest.json` at root)
- [ ] ZIP tested (Load unpacked from unzipped folder)
- [ ] Git tag `vX.Y.Z` created and pushed
- [ ] GitHub Release published with ZIP attached

---

## Related docs

- [`README.md`](README.md) — overview and usage
- [`PUBLISH_GUIDE.md`](PUBLISH_GUIDE.md) — Chrome Web Store publishing
- [`PRIVACY_POLICY.md`](PRIVACY_POLICY.md) — privacy policy (required for Web Store)
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — development guidelines
