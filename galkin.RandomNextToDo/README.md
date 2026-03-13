# Random Next ToDo NotePlan Plugin

## Latest Updates

See [CHANGELOG](https://github.com/NotePlan/plugins/blob/main/galkin.RandomNextToDo/CHANGELOG.md) for updates.

## What This Plugin Does

This plugin adds two commands:

- `/randomToDo`
- `/randomProject`

### randomToDo

When you run it, the plugin:

1. Reads tasks on the currently open note.
2. Filters to active checkbox-style tasks.
3. Excludes completed and cancelled tasks.
4. Picks one task at random.
5. Scrolls to the selected task and places the cursor on it.

Eligible paragraph types are:

- `open`
- `scheduled`
- `checklist`
- `checklistScheduled`

### randomProject

When you run it, the plugin:

1. Loads the configured project folder from plugin settings.
2. Searches project notes inside that folder and all subfolders.
3. Picks one project note at random.
4. Opens the selected note in the editor.

## Settings

The plugin provides one functional setting:

- `projectFolderName`: folder path used by `randomProject`. Default is `Projects`. Subfolders are included automatically.

## Empty State Behavior

If no eligible tasks are found for `randomToDo`, or no project notes are found for `randomProject`, the plugin shows an informational message and does not modify content or navigation.

## Development Notes

This plugin follows the NotePlan plugins repo workflow and is built from `src/` into `script.js`.
