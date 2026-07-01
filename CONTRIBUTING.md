# Contributing to SpeedPin

Thank you for your interest in contributing!

## How to contribute

1. Fork the repository: [github.com/Father1993/SpeedPin](https://github.com/Father1993/SpeedPin)
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes and test locally in Chrome (`chrome://extensions` → Load unpacked)
4. Keep changes minimal — this project follows KISS principles
5. Open a pull request with a clear description

## Development setup

```bash
git clone https://github.com/Father1993/SpeedPin.git
cd SpeedPin
```

Load the **project root** as an unpacked extension in Chrome. No npm or bundler required.

After code changes, click **Reload** on the extension card in `chrome://extensions/`.

## Smoke test checklist

- Open the popup twice and confirm it appears immediately
- Add a pin with URL and optional label
- Reorder pins with ↑ / ↓
- Edit a pin and cancel edit by clicking ✎ again
- Delete a pin
- Export pins to JSON
- Import pins from JSON and confirm replacement

## Build the extension package

```bash
# Linux / macOS / Git Bash
./build.sh

# Windows (CMD / PowerShell)
prepare-zip.bat
```

Output: `dist/SpeedPin-vX.Y.Z.zip` and `extension.zip`.

Regenerate icons if needed:

```bash
python scripts/generate-icons.py
```

## Release workflow (maintainers)

See [`RELEASE.md`](RELEASE.md) for the full GitHub release checklist.

## Guidelines

- Preserve existing behavior unless the issue explicitly requires a change
- Prefer vanilla JS — no frameworks or bundlers
- Match the existing code style in `popup.js`
- Update `README.md`, `CHANGELOG.md`, and `PRIVACY_POLICY.md` if behavior or data handling changes
- Bump `version` in `manifest.json` before tagging a release

## Questions

Open a [GitHub issue](https://github.com/Father1993/SpeedPin/issues) for bugs, feature requests, or questions.
