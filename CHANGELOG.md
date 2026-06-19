# Changelog

All notable changes to SpeedPin are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-06-19

### Added

- JSON import and export (`quick-pins.json`)
- Edit mode for existing pins
- Pin reordering (move up / down)
- Automatic favicons with SVG fallback
- `chrome.storage.local` fallback for lists larger than ~7 KB
- Extension icons (16, 48, 128 px)
- Unified build scripts and release packaging

### Changed

- Improved storage sync/local fallback logic
- Refactored popup logic (DRY/KISS, same behavior)

## [1.0.0] - Initial release

### Added

- Minimal popup for quick links
- Optional labels
- Add and delete pins
- Chrome Sync via `chrome.storage.sync`
- Glassmorphism UI

[1.0.1]: https://github.com/Father1993/SpeedPin/releases/tag/v1.0.1
