import { PathParts } from '@harnessio/ui/components'

import { FILE_SEPERATOR } from './git-utils'

export function splitPathWithParents(fullResourcePath: string, repoPath: string): PathParts[] {
  const cleaned = fullResourcePath.replace(/^\/+|\/+$/g, '')
  if (!cleaned) return []

  const segments = cleaned.split(FILE_SEPERATOR).filter(Boolean)

  return segments.map((segment, i) => ({
    path: segment,
    parentPath: `${repoPath}/~/${segments.slice(0, i + 1).join(FILE_SEPERATOR)}`
  }))
}

export const decodeURIComponentIfValid = (path: string) => {
  try {
    return decodeURIComponent(path)
  } catch {
    return path
  }
}
