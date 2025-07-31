import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { OpenapiGetContentOutput, pathDetails, TypesPathDetails } from '@harnessio/code-service-client'
import { RepoFile, SummaryItemType } from '@harnessio/ui/views'

import { useRoutes } from '../framework/context/NavigationContext'
import { sortPathsByType } from '../utils/common-utils'
import { getTrimmedSha, normalizeGitRef } from '../utils/git-utils'

interface UseRepoContentDetailsProps {
  repoRef: string
  fullGitRef: string
  pathToTypeMap: Map<string, OpenapiGetContentOutput['type']>
  spaceId?: string
  repoId?: string
  batchSize?: number
  throttleDelay?: number
}

interface UseRepoContentDetailsResult {
  files: RepoFile[]
  loading: boolean
}

/**
 * fetch and process repository content details using batch processing
 */
export const useRepoFileContentDetails = ({
  repoRef,
  fullGitRef,
  pathToTypeMap,
  spaceId,
  repoId,
  batchSize = 20,
  throttleDelay = 300
}: UseRepoContentDetailsProps): UseRepoContentDetailsResult => {
  const [files, setFiles] = useState<RepoFile[]>([])
  const [loading, setLoading] = useState(false)
  const routes = useRoutes()

  // Track whether this is the first render to avoid unnecessary API calls on remounts
  const isFirstRender = useRef(true)

  // Previous props to detect actual changes
  const prevPropsRef = useRef({ repoRef, fullGitRef, pathMapSize: pathToTypeMap.size })

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

  const createFileObject = useCallback(
    (path: string, item: TypesPathDetails): RepoFile => ({
      id: path,
      type: getSummaryItemType(pathToTypeMap.get(path)),
      name: getLastPathSegment(path) || path,
      lastCommitMessage: item?.last_commit?.message || '',
      timestamp: item?.last_commit?.author?.when ?? '',
      user: { name: item?.last_commit?.author?.identity?.name || '' },
      sha: item?.last_commit?.sha && getTrimmedSha(item.last_commit.sha),
      path: routes.toRepoFiles({ spaceId, repoId, '*': `${fullGitRef || ''}/~/${path}` })
    }),
    [pathToTypeMap, getSummaryItemType, getLastPathSegment, routes, spaceId, repoId, fullGitRef]
  )

  useEffect(() => {
    // If there are no paths to process, skip processing
    if (!pathToTypeMap.size) {
      return
    }

    // Check if props actually changed
    const prevProps = prevPropsRef.current
    const propsChanged =
      prevProps.repoRef !== repoRef ||
      prevProps.fullGitRef !== fullGitRef ||
      prevProps.pathMapSize !== pathToTypeMap.size

    prevPropsRef.current = { repoRef, fullGitRef, pathMapSize: pathToTypeMap.size }

    // Skip API call if this is a re-render with the same props
    if (!isFirstRender.current && !propsChanged) {
      return
    }

    isFirstRender.current = false

    setLoading(true)

    // Track processed files to avoid duplicates
    const processedFilesSet = new Set<string>()
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const processBatch = async (startIndex: number, isFirstBatch: boolean = false) => {
      // If we've processed all paths, we're done
      if (startIndex >= allPaths.length) {
        return
      }

      // Get the next batch of paths
      const batchPaths = allPaths.slice(startIndex, startIndex + batchSize)

      try {
        const { body: response } = await pathDetails({
          queryParams: { git_ref: normalizeGitRef(fullGitRef || '') },
          body: { paths: batchPaths },
          repo_ref: repoRef
        })

        if (response?.details && response.details.length > 0) {
          // Create a map for quick lookup of details by path
          const detailsMap = new Map<string, TypesPathDetails>()
          response.details.forEach(detail => {
            if (detail.path) {
              detailsMap.set(detail.path, detail)
            }
          })

          // Process paths in order from the pre-sorted batch
          const newFiles: RepoFile[] = []
          for (const path of batchPaths) {
            // Skip if already processed or not found in response
            if (processedFilesSet.has(path) || !detailsMap.has(path)) continue

            // Mark as processed
            processedFilesSet.add(path)

            // Get the details for this path
            const item = detailsMap.get(path)!
            newFiles.push(createFileObject(path, item))
          }

          // Update the files state
          setFiles(prevFiles => [...prevFiles, ...newFiles])

          // Set loading to false after the first batch is processed
          if (isFirstBatch) {
            setLoading(false)
          }
        } else if (isFirstBatch) {
          // If first batch has no results, still set loading to false
          setLoading(false)
        }

        // Process the next batch with throttling
        timeoutId = setTimeout(() => {
          processBatch(startIndex + batchSize, false)
        }, throttleDelay)
      } catch (error) {
        console.error('Error fetching path details:', error)

        // If this was the first batch, set loading to false even on error
        if (isFirstBatch) {
          setLoading(false)
        }

        // Even if there's an error, try to process the next batch (with throttling)
        timeoutId = setTimeout(() => {
          processBatch(startIndex + batchSize, false)
        }, throttleDelay)
      }
    }

    setFiles([])
    processBatch(0, true)

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      setLoading(false)
    }
  }, [createFileObject, allPaths, repoRef, fullGitRef])

  return { files, loading }
}
