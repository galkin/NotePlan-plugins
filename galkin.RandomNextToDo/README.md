# Random Next ToDo NotePlan Plugin

This plugin helps you quickly pick what to work on next.

## Commands

The plugin provides three commands:

- `/randomToDo`
- `/randomProject`
- `/projectsList`

### /randomToDo

Chooses one active task from the currently open note and moves your cursor to it.

Used task types:

- `open`
- `scheduled`
- `checklist`
- `checklistScheduled`

### /randomProject

Opens one random project note from your configured project folder (including subfolders).

### /projectsList

Builds a clickable hierarchical list of project notes and:

1. Returns the list as text when called from a template.
2. Inserts the list at the current cursor position when run as a normal command.

Links are inserted in NotePlan wiki format: `[[Note Title]]`.

## Setting

The plugin uses one setting:

- `projectFolderName`: folder path used by `/randomProject` and `/projectsList`
- Default: `Projects`
- Subfolders are included automatically

## Empty Results

If no matching tasks or project notes are found, the plugin shows an informational message and does not change your notes.

## Updates

See [CHANGELOG](https://github.com/NotePlan/plugins/blob/main/galkin.RandomNextToDo/CHANGELOG.md).
