# galkin.RandomNextToDo Changelog

## About galkin.RandomNextToDo Plugin

See Plugin [README](https://github.com/NotePlan/plugins/blob/main/galkin.RandomNextToDo/README.md) for command details and usage.

## [0.1.0] - 2026-03-14 (galkin)

### Added
- Added command `randomToDo` to pick a random active task from the current note.
- Added command `randomProject` to open a random project note from a configured folder tree.
- Added setting `projectFolderName` to configure which project folder `randomProject` searches.
- Added helper functions for candidate filtering, folder path normalization, and project-note filtering.

### Changed
- Replaced boilerplate `sayHello` implementation with task/project random selection behavior.
- Updated plugin metadata for first publish release.

### Removed
- Removed scaffold-only `sayHello` command behavior and the placeholder setting `settingsString`.
