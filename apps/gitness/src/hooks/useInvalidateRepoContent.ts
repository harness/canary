import { useCallback } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'

/**
 * Query-key roots whose data depends on the repository's file contents and therefore must be
 * refreshed after a create/move/delete commit:
 * - `getContent`     – root/dir content (gates the sidebar tree, seeds its `initialData`, and
 *                      drives the file listing in repo-code)
 * - `folderContents` – the lazily-loaded file tree nodes (defined in `FileExplorer`)
 * - `listPaths`      – the flat path list used by the file search and repo summary
 * - `findRepository` – repo metadata, so `is_empty` flips after the first/last file
 */
const REPO_CONTENT_QUERY_KEYS = ['getContent', 'folderContents', 'findRepository']

/**
 * Returns a callback that refreshes only the content-related queries for the current repository
 * after a commit. Scoped to both a known set of query-key roots and the current `repoRef`, so it
 * won't touch unrelated queries (branches, rules, webhooks, ...) or other repositories.
 */
export const useInvalidateRepoContent = () => {
  const repoRef = useGetRepoRef()
  const queryClient = useQueryClient()

  return useCallback(() => {
    if (!repoRef) return

    queryClient.invalidateQueries({
      predicate: query => {
        const queryKey = query.queryKey
        return Array.isArray(queryKey) && REPO_CONTENT_QUERY_KEYS.includes(queryKey[0]) && queryKey.includes(repoRef)
      }
    })
  }, [queryClient, repoRef])
}
