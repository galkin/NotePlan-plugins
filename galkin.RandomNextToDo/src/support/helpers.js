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

type FolderTreeNode = {
  notes: Array<TNote>,
  children: { [string]: FolderTreeNode },
}

function getInitialTreeNode(): FolderTreeNode {
  return {
    notes: [],
    children: {},
  }
}

function getDisplayTitle(note: TNote): string {
  const titleFromNote = (note.title ?? '').trim()
  if (titleFromNote) {
    return titleFromNote
  }

  const fallback = note.filename.split('/').slice(-1)[0] ?? note.filename
  return fallback.replace(/\.md$/i, '')
}

function renderNodeLines(node: FolderTreeNode, depth: number, rootFolderPath: string, relativeFolderPath: string = ''): Array<string> {
  const indent = '\t'.repeat(depth)
  const lines: Array<string> = []

  const sortedNotes = [...node.notes].sort((a, b) => getDisplayTitle(a).localeCompare(getDisplayTitle(b), undefined, { sensitivity: 'base' }))
  for (const note of sortedNotes) {
    lines.push(`${indent}- [[${getDisplayTitle(note)}]]`)
  }

  const sortedFolderNames = Object.keys(node.children).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
  for (const folderName of sortedFolderNames) {
    const folderPathFromRoot = relativeFolderPath ? `${relativeFolderPath}/${folderName}` : folderName
    const absoluteFolderPath = `${rootFolderPath}/${folderPathFromRoot}`
    lines.push(`${indent}- [[//${absoluteFolderPath}]]`)
    lines.push(...renderNodeLines(node.children[folderName], depth + 1, rootFolderPath, folderPathFromRoot))
  }

  return lines
}

export function buildProjectsHierarchyLines(notes: $ReadOnlyArray<TNote> = [], folderPath: string = 'Projects'): Array<string> {
  const normalizedFolderPath = normalizeFolderPath(folderPath) || 'Projects'
  const eligibleNotes = filterProjectNotesByFolder(notes, normalizedFolderPath)
  const tree = getInitialTreeNode()

  for (const note of eligibleNotes) {
    const relativePath = note.filename.slice(`${normalizedFolderPath}/`.length)
    const pathParts = relativePath.split('/')
    pathParts.pop()

    let cursor = tree
    for (const folder of pathParts) {
      if (!folder) {
        continue
      }
      if (!cursor.children[folder]) {
        cursor.children[folder] = getInitialTreeNode()
      }
      cursor = cursor.children[folder]
    }

    cursor.notes.push(note)
  }

  return renderNodeLines(tree, 0, normalizedFolderPath)
}
