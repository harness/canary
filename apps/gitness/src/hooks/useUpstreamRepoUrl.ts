import { useCallback } from 'react'

import { useMFEContext } from '../framework/hooks/useMFEContext'

export function useUpstreamRepoUrl() {
  const { routes: parentRoutes } = useMFEContext()

  return useCallback(
    (parentRepoPath: string, subPath?: string): string => {
      if (parentRoutes?.toCodeRepositoryPath && parentRepoPath) {
        const baseRepoPath = parentRoutes.toCodeRepositoryPath({ repoPath: parentRepoPath })
        return subPath ? `${baseRepoPath}/${subPath}` : baseRepoPath
      }
      return ''
    },
    [parentRoutes]
  )
}
