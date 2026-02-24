import { useCallback } from 'react'

import { useForkSyncBranchMutation } from '@harnessio/code-service-client'

import { normalizeGitRef } from '../utils/git-utils'

interface UseForkSyncParams {
  repoRef: string
  gitRefName: string
  fullGitRefWoDefault?: string
  repoData?: {
    default_branch?: string
    upstream?: {
      default_branch?: string
    }
  }
  latestCommitSha?: string
  calculateDivergence: (params: {
    repo_ref: string
    body: {
      requests: Array<{ from: string; to: string }>
    }
  }) => void
  onSyncSuccess?: () => void
}

export function useForkSync({
  repoRef,
  gitRefName,
  fullGitRefWoDefault,
  repoData,
  latestCommitSha,
  calculateDivergence,
  onSyncSuccess
}: UseForkSyncParams) {
  const recalculateDivergence = useCallback(() => {
    if (fullGitRefWoDefault && repoData?.default_branch && repoData?.upstream) {
      calculateDivergence({
        repo_ref: repoRef,
        body: {
          requests: [
            {
              from: normalizeGitRef(fullGitRefWoDefault) ?? '',
              to: `upstream:${normalizeGitRef(repoData.upstream.default_branch) ?? ''}`
            }
          ]
        }
      })
    }
  }, [repoRef, fullGitRefWoDefault, repoData, calculateDivergence])

  const { mutate: syncFork, isLoading: isSyncingFork } = useForkSyncBranchMutation(
    { repo_ref: repoRef },
    {
      onSuccess: () => {
        onSyncSuccess?.()
        recalculateDivergence()
      }
    }
  )

  const handleFetchAndMerge = useCallback(() => {
    if (repoData?.upstream?.default_branch) {
      syncFork({
        repo_ref: repoRef,
        body: {
          branch: gitRefName,
          branch_commit_sha: latestCommitSha || '',
          branch_upstream: repoData.upstream.default_branch || ''
        }
      })
    }
  }, [syncFork, repoRef, repoData, latestCommitSha, gitRefName])

  return {
    handleFetchAndMerge,
    isSyncingFork
  }
}
