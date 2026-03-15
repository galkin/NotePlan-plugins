// @flow

import pluginJson from '../plugin.json'
import { getSettings } from '@helpers/NPConfiguration'
import { buildProjectsHierarchyLines, filterProjectNotesByFolder, getEligibleTodoCandidates, normalizeFolderPath, pickRandomItem } from './support/helpers'
import { log, logDebug, logError, JSP } from '@helpers/dev'
import { showMessage } from '@helpers/userInput'

// NOTE: Plugin entrypoints must be exported as async functions
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

export async function projectsList(context: any = {}): Promise<string | void> {
  const fromTemplating = context?.source === 'templating'
  try {
    if (!fromTemplating) {
      const note = Editor.note
      if (!note) {
        showMessage('Open a note first, then run projectsList again.')
        return
      }
    }

    const settings = await getSettings(pluginJson['plugin.id'])
    const projectFolderName = normalizeFolderPath(String(settings?.projectFolderName ?? 'Projects')) || 'Projects'
    const hierarchyLines = buildProjectsHierarchyLines(DataStore.projectNotes, projectFolderName)
    const outputText = `${hierarchyLines.join('\n')}\n`

    if (hierarchyLines.length === 0) {
      if (fromTemplating) {
        return ''
      }
      showMessage(`No project notes found in folder "${projectFolderName}".`)
      return
    }

    if (fromTemplating) {
      logDebug(pluginJson, `projectsList returning template content (${String(hierarchyLines.length)} lines) from ${projectFolderName}`)
      return outputText
    }

    Editor.insertTextAtCursor(outputText)
    log(pluginJson, `projectsList inserted ${String(hierarchyLines.length)} lines from ${projectFolderName}`)
    logDebug(pluginJson, `projectsList built from ${String(DataStore.projectNotes.length)} project notes`)
  } catch (error) {
    logError(pluginJson, JSP(error))
    if (fromTemplating) {
      return ''
    }
  }
}

export async function onSettingsUpdated(): Promise<void> {
  logDebug(pluginJson, 'onSettingsUpdated: no operations configured')
}
