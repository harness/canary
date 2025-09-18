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

export const removeTrailingSlash = (path: string) => path?.replace(/\/$/, '')
export const removeLeadingSlash = (path: string) => path?.replace(/^\//, '')

export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.')
  if (lastDotIndex === -1) {
    return ''
  }
  return filename.substring(lastDotIndex + 1)
}

interface createImageUrlTransformProps {
  repoRef: string
  apiPath: (path: string) => string
}

export const createImageUrlTransform = ({ repoRef, apiPath }: createImageUrlTransformProps) => {
  return (src: string): string => {
    // XSS Protection: Validate the source before processing
    if (src && /^javascript:/i.test(src)) {
      console.error('Potentially malicious image source detected:', src)
      return ''
    }

    // Handle relative image paths
    if (
      src &&
      !src.startsWith('/') &&
      !src.startsWith('http:') &&
      !src.startsWith('https:') &&
      !src.startsWith('data:')
    ) {
      try {
        // Normalize paths that start with ./
        if (src.startsWith('./')) {
          src = src.replace('./', '')
        }

        if (repoRef) {
          return apiPath(`/api/v1/repos/${repoRef}/raw/${src}`)
        }
      } catch (e) {
        console.error('Error processing relative image path:', e)
      }
    }

    return src
  }
}
