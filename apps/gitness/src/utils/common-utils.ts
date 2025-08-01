import { LivelogLine } from '@harnessio/code-service-client'
import { RepoFile, SummaryItemType } from '@harnessio/ui/views'

export const createAndDownloadBlob = (output: string, fileName: string) => {
  if (!output?.length) return
  const link = document.createElement('a')
  const blob = new Blob([output], { type: 'application/text' })

  link.download = fileName
  link.href = URL.createObjectURL(blob)
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const getLogsText = (logs: LivelogLine[]) => {
  let output = ''
  for (let i = 0; i < logs.length; ++i) {
    output += logs[i].out
  }
  return output
}

export const sortFilesByType = (entries: RepoFile[]): RepoFile[] => {
  return entries.sort((a, b) => {
    if (a.type === SummaryItemType.Folder && b.type === SummaryItemType.File) {
      return -1
    } else if (a.type === SummaryItemType.File && b.type === SummaryItemType.Folder) {
      return 1
    }
    return 0
  })
}

/**
 * Sorts an array of paths by type, with directories coming before files.
 * Uses a Map to determine whether each path is a directory or file.
 *
 * @param paths - Array of path strings to sort
 * @param pathToTypeMap - Map that maps each path to its type ('dir' for directories)
 * @returns Sorted array of paths with directories first
 */
export const sortPathsByType = (paths: string[], pathToTypeMap: Map<string, string>): string[] => {
  return [...paths].sort((a, b) => {
    const typeA = pathToTypeMap.get(a)
    const typeB = pathToTypeMap.get(b)

    const isAFolder = typeA === 'dir'
    const isBFolder = typeB === 'dir'

    if (isAFolder && !isBFolder) {
      return -1 // Folders come first
    } else if (!isAFolder && isBFolder) {
      return 1 // Files come after folders
    }
    return 0 // Otherwise keep original order
  })
}
