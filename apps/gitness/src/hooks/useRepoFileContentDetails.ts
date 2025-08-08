import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { OpenapiGetContentOutput, pathDetails, TypesPathDetails } from '@harnessio/code-service-client'
import { RepoFile, SummaryItemType } from '@harnessio/ui/views'

import { useRoutes } from '../framework/context/NavigationContext'
import { sortPathsByType } from '../utils/common-utils'
import { getTrimmedSha, normalizeGitRef } from '../utils/git-utils'

interface UseRepoContentDetailsProps {
  repoRef: string
  fullGitRef: string
  fullResourcePath: string
  pathToTypeMap: Map<string, OpenapiGetContentOutput['type']>
  spaceId?: string
  repoId?: string
  batchSize?: number
  throttleDelay?: number
}

interface UseRepoContentDetailsResult {
  files: RepoFile[]
  loading: boolean
  loadMetadataForPaths: (paths: string[]) => Promise<void>
}

/**
 * show files immediately and load metadata lazily
 */
export const useRepoFileContentDetails = ({
  repoRef,
  fullGitRef,
  fullResourcePath,
  pathToTypeMap,
  spaceId,
  repoId
}: UseRepoContentDetailsProps): UseRepoContentDetailsResult => {
  const [files, setFiles] = useState<RepoFile[]>([])
  const [loading, setLoading] = useState(false)
  const routes = useRoutes()

  // files that already have metadata loaded
  const metadataLoadedRef = useRef(new Set<string>())

  // convert content type to summary item type
  const getSummaryItemType = useCallback((type: OpenapiGetContentOutput['type']): SummaryItemType => {
    if (type === 'dir') {
      return SummaryItemType.Folder
    }
    return SummaryItemType.File
  }, [])

  const getLastPathSegment = useCallback((path: string): string => {
    if (!path) {
      return ''
    }
    path = path.replace(/\/+$/, '')
    return path.split('/').pop() || ''
  }, [])

  // Memoize the filtered map to avoid recalculating on each render
  const filteredMap = useMemo(() => {
    const filtered = new Map<string, string>()
    pathToTypeMap.forEach((value, key) => {
      if (value !== undefined) {
        filtered.set(key, value)
      }
    })
    return filtered
  }, [pathToTypeMap])

  // Memoize the sorted paths
  const allPaths = useMemo(() => {
    return sortPathsByType(Array.from(pathToTypeMap.keys()), filteredMap)
  }, [pathToTypeMap, filteredMap])

  // Creates file object with basic info (no metadata)
  const createBasicFileObject = useCallback(
    (path: string): RepoFile => ({
      id: path,
      type: getSummaryItemType(pathToTypeMap.get(path)),
      name: getLastPathSegment(path) || path,
      lastCommitMessage: '',
      timestamp: '',
      user: undefined,
      sha: undefined,
      path: routes.toRepoFiles({ spaceId, repoId, '*': `${fullGitRef || ''}/~/${path}` })
    }),
    [pathToTypeMap, getSummaryItemType, getLastPathSegment, routes, spaceId, repoId, fullGitRef]
  )

  // Creates file object with metadata
  const createFileObjectWithMetadata = useCallback(
    (item: TypesPathDetails): Partial<RepoFile> => ({
      lastCommitMessage: item?.last_commit?.message || '',
      timestamp: item?.last_commit?.author?.when ?? '',
      user: { name: item?.last_commit?.author?.identity?.name || '' },
      sha: item?.last_commit?.sha && getTrimmedSha(item.last_commit.sha)
    }),
    []
  )

  // load metadata for specific file paths
  const loadMetadataForPaths = useCallback(
    async (paths: string[]) => {
      if (!paths.length || !repoRef || !fullGitRef) return

      // Filter out paths that already have metadata
      const pathsToLoad = paths.filter(path => !metadataLoadedRef.current.has(path))
      if (!pathsToLoad.length) return

      try {
        const { body: response } = await pathDetails({
          queryParams: { git_ref: normalizeGitRef(fullGitRef || '') },
          body: { paths: pathsToLoad },
          repo_ref: repoRef
        })

        if (response?.details && response.details.length > 0) {
          // Create a map for quick lookup of details by path
          const detailsMap = new Map<string, TypesPathDetails>()
          response.details.forEach(detail => {
            if (detail.path) {
              detailsMap.set(detail.path, detail)
              metadataLoadedRef.current.add(detail.path)
            }
          })

          // Update files with metadata
          setFiles(prevFiles =>
            prevFiles.map(file => {
              if (pathsToLoad.includes(file.id) && detailsMap.has(file.id)) {
                const metadata = createFileObjectWithMetadata(detailsMap.get(file.id)!)
                return { ...file, ...metadata }
              }
              return file
            })
          )
        }
      } catch (error) {
        console.error('Error loading metadata for paths:', paths, error)
      }
    },
    [repoRef, fullGitRef, createFileObjectWithMetadata]
  )

  // Initialize files immediately when pathToTypeMap changes
  useEffect(() => {
    const shouldUpdateFiles = pathToTypeMap.size > 0

    if (shouldUpdateFiles) {
      setLoading(true)

      // Create basic file objects immediately
      const basicFiles = allPaths.map(path => createBasicFileObject(path))
      setFiles(basicFiles)

      // Clear metadata cache for new repo/ref
      metadataLoadedRef.current.clear()

      // Set loading to false immediately since we're showing files
      setLoading(false)
    } else if (pathToTypeMap.size === 0) {
      // No files to show
      setFiles([])
      setLoading(false)
      metadataLoadedRef.current.clear()
    }
  }, [pathToTypeMap, allPaths, createBasicFileObject, repoRef, fullGitRef, fullResourcePath])

  return {
    files,
    loading,
    loadMetadataForPaths
  }
}
