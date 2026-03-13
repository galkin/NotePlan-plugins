// @flow
// Pure helpers for randomToDo and randomProject commands.

const ACTIVE_TASK_TYPES: Array<ParagraphType> = ['open', 'scheduled', 'checklist', 'checklistScheduled']

export function getEligibleTodoCandidates(paragraphs: $ReadOnlyArray<TParagraph> = []): Array<TParagraph> {
  return paragraphs.filter((p) => ACTIVE_TASK_TYPES.includes(p.type) && p.content.trim() !== '')
}

export function normalizeFolderPath(folderPath: string = ''): string {
  return folderPath.trim().replace(/^\/+|\/+$/g, '')
}

export function filterProjectNotesByFolder(notes: $ReadOnlyArray<TNote> = [], folderPath: string = 'Projects'): Array<TNote> {
  const normalizedFolderPath = normalizeFolderPath(folderPath) || 'Projects'
  return notes.filter((note) => note.filename.startsWith(`${normalizedFolderPath}/`))
}

export function pickRandomItem<T>(items: $ReadOnlyArray<T>, randFn: () => number = Math.random): ?T {
  if (!items.length) {
    return null
  }

  const rawRandom = randFn()
  const normalizedRandom = Number.isFinite(rawRandom) ? rawRandom : 0
  const clampedRandom = Math.min(Math.max(normalizedRandom, 0), 0.999999999999)
  const randomIndex = Math.floor(clampedRandom * items.length)

  return items[randomIndex] ?? null
}
