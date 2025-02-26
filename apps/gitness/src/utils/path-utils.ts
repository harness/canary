import { PathParts } from '@harnessio/ui/components'

export function splitPathWithParents(fullResourcePath: string, repoPath: string) {
  const result: PathParts[] = []

  if (!fullResourcePath.length) return result

  const pathParts = fullResourcePath?.split('/')

  if (pathParts.length) {
    let parentPath = ''

    pathParts.map((path, index) => {
      parentPath += (index === 0 ? repoPath + '/~/' : '/') + path

      result.push({
        path: path,
        parentPath: parentPath
      })
    })
  }
  return result
}

export const decodeURIComponentIfValid = (path: string) => {
  try {
    return decodeURIComponent(path)
  } catch {
    return path
  }
}
