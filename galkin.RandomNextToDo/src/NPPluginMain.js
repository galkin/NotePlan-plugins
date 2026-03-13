// @flow
// Plugin code goes in files like this. Can be one per command, or several in a file.
// `export async function [name of jsFunction called by Noteplan]`
// then include that function name as an export in the index.js file also
// About Flow: https://flow.org/en/docs/usage/#toc-write-flow-code
// Getting started with Flow in NotePlan: https://github.com/NotePlan/plugins/blob/main/Flow_Guide.md

// NOTE: This file is named NPPluginMain.js (you could change that name and change the reference to it in index.js)
// As a matter of convention, we use NP at the beginning of files which contain calls to NotePlan APIs (Editor, DataStore, etc.)
// Because you cannot easily write tests for code that calls NotePlan APIs, we try to keep the code in the NP files as lean as possible
// and put the majority of the work in the /support folder files which have Jest tests for each function
// support/helpers is an example of a testable file that is used by the plugin command
// REMINDER, to build this plugin as you work on it:
// From the command line:
// `noteplan-cli plugin:dev galkin.RandomNextToDo --test --watch --coverage`
// IMPORTANT: It's a good idea for you to open the settings ASAP in NotePlan Preferences > Plugins and set your plugin's logging level to DEBUG

/**
 * LOGGING
 * A user will be able to set their logging level in the plugin's settings (if you used the plugin:create command)
 * As a general rule, you should use logDebug (see below) for messages while you're developing. As developer,
 * you will set your log level in your plugin preferences to DEBUG and you will see these messages but
 * an ordinary user will not. When you want to output a message,you can use the following.
 * logging level commands for different levels of messages:
 *
 * logDebug(pluginJson,"Only developers or people helping debug will see these messages")
 * log(pluginJson,"Ordinary users will see these informational messages")
 * logWarn(pluginJson,"All users will see these warning/non-fatal messages")
 * logError(pluginJson,"All users will see these fatal/error messages")
 */
import pluginJson from '../plugin.json'
import { getSettings } from '@helpers/NPConfiguration'
import { filterProjectNotesByFolder, getEligibleTodoCandidates, normalizeFolderPath, pickRandomItem } from './support/helpers'
import { log, logDebug, logError, JSP } from '@helpers/dev'
import { showMessage } from '@helpers/userInput'

// NOTE: Plugin entrypoints (jsFunctions called by NotePlan) must be exported as async functions or you will get a TypeError in the NotePlan plugin console
// if you do not have an "await" statement inside your function, you can put an eslint-disable line like below so you don't get an error
// eslint-disable-next-line require-await
export async function randomNextToDo() {
  try {
    const note = Editor.note
    if (!note) {
      showMessage('Open a note first, then run randomToDo again.')
      return
    }

    const candidates = getEligibleTodoCandidates(note.paragraphs)
    if (candidates.length === 0) {
      showMessage('No active to-do checkboxes found on this page.')
      return
    }

    const selectedTodo = pickRandomItem(candidates)
    if (!selectedTodo) {
      showMessage('Could not choose a task. Please run the command again.')
      return
    }

    // Highlight first to ensure folded sections are revealed, then place cursor at the chosen line.
    Editor.highlight(selectedTodo)
    const startPos = selectedTodo.contentRange?.start
    if (typeof startPos === 'number') {
      Editor.select(startPos, 0)
    }

    log(pluginJson, `randomToDo selected: ${selectedTodo.content}`)
    logDebug(pluginJson, `Selected lineIndex ${String(selectedTodo.lineIndex)} in ${note.filename}`)
  } catch (error) {
    logError(pluginJson, JSP(error))
  }
}

export async function randomProject() {
  try {
    const settings = await getSettings(pluginJson['plugin.id'])
    const projectFolderName = normalizeFolderPath(String(settings?.projectFolderName ?? 'Projects')) || 'Projects'
    const eligibleProjects = filterProjectNotesByFolder(DataStore.projectNotes, projectFolderName)

    if (eligibleProjects.length === 0) {
      showMessage(`No project notes found in folder "${projectFolderName}".`)
      return
    }

    const selectedProject = pickRandomItem(eligibleProjects)
    if (!selectedProject) {
      showMessage('Could not choose a project note. Please run the command again.')
      return
    }

    await Editor.openNoteByFilename(selectedProject.filename)
    log(pluginJson, `randomProject opened: ${selectedProject.filename}`)
    logDebug(pluginJson, `randomProject selected note: ${selectedProject.title || selectedProject.filename}`)
  } catch (error) {
    logError(pluginJson, JSP(error))
  }
}
