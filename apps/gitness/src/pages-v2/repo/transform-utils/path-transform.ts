import type { FileItem } from '@harnessio/ui/components'

/**
 * Combines the file and directory paths returned by the paths API into a single
 * search list, tagging each entry so the search dropdown can render the correct icon.
 */
export const buildPathSearchList = (files: string[] = [], directories: string[] = []): FileItem[] => [
  ...directories.map(value => ({ label: value, value, type: 'dir' as const })),
  ...files.map(value => ({ label: value, value, type: 'file' as const }))
]
