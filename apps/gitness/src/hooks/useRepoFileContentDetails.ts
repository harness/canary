import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { OpenapiGetContentOutput, pathDetails, TypesPathDetails } from '@harnessio/code-service-client'
import { RepoFile, SummaryItemType } from '@harnessio/views'

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
  scheduleFileMetaFetch: (paths: string[]) => void
}

export const BATCH_OVERFLOW_TIMEOUT_DELAY = 200
export const METADETA_FETCH_DELAY = 500

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

  // Batching and throttling refs
  const pendingPathsRef = useRef(new Set<string>())
  const throttleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  // Batch and throttle metadata loading
  const scheduleFileMetaFetch = useCallback(
    (newPaths: string[]) => {
      if (!loadMetadataForPaths || newPaths.length === 0) return

      // Add new paths to pending set
      newPaths.forEach(path => pendingPathsRef.current.add(path))

      // Clear existing timeout
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current)
      }

      const currentPendingCount = pendingPathsRef.current.size
      const batchSize = 20

      // If full batch (20 files), process immediately otherwise, throttle with 500ms delay
      const throttleDelay = currentPendingCount >= batchSize ? 0 : METADETA_FETCH_DELAY

      // Schedule batched load after throttle delay
      throttleTimeoutRef.current = setTimeout(() => {
        const pathsToLoad = Array.from(pendingPathsRef.current)
        pendingPathsRef.current.clear()

        if (pathsToLoad.length === 0) return

        // Process in batches of 20 (API limit)
        const processBatch = async (startIndex: number) => {
          if (startIndex >= pathsToLoad.length) return

          const batch = pathsToLoad.slice(startIndex, startIndex + batchSize)

          try {
            await loadMetadataForPaths(batch)
          } catch (error) {
            console.error('Failed to load metadata batch:', error)
          }

          // Process next batch with a small delay to avoid overwhelming the API
          if (startIndex + batchSize < pathsToLoad.length) {
            setTimeout(() => processBatch(startIndex + batchSize), BATCH_OVERFLOW_TIMEOUT_DELAY)
          }
        }

        processBatch(0)
      }, throttleDelay)
    },
    [loadMetadataForPaths]
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

    return () => {
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current)
      }
      pendingPathsRef.current.clear()
    }
  }, [pathToTypeMap, allPaths, createBasicFileObject, repoRef, fullGitRef, fullResourcePath])

  return {
    files,
    loading,
    loadMetadataForPaths,
    scheduleFileMetaFetch
  }
}
