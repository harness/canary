import { useState } from 'react'

import { useFindRepositoryQuery } from '@harnessio/code-service-client'
import { BranchSelectorTab } from '@harnessio/ui/views'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { REFS_BRANCH_PREFIX, REFS_TAGS_PREFIX } from '../utils/git-utils'
import useCodePathDetails from './useCodePathDetails'

export function useGitRef() {
  const {
    fullGitRef: fullGitRefWoDefault,
    gitRefName: gitRefNameWoDefault,
    isCommitSHA,
    fullResourcePath,
    codeMode
  } = useCodePathDetails()
  const repoRef = useGetRepoRef()

  const {
    data: { body: repoData } = {},
    isLoading,
    refetch: refetchRepo
  } = useFindRepositoryQuery({ repo_ref: repoRef })
  const prefixedDefaultBranch = repoData?.default_branch ? `${REFS_BRANCH_PREFIX}${repoData?.default_branch}` : ''
  const fullGitRef = fullGitRefWoDefault || prefixedDefaultBranch || ''
  const gitRefName = gitRefNameWoDefault || repoData?.default_branch || ''
  const gitRefPath = fullGitRef ? `/${isCommitSHA ? gitRefName : fullGitRef}` : ''
  const [preSelectedTab, setPreSelectedTab] = useState<BranchSelectorTab>(
    fullGitRef.startsWith(REFS_TAGS_PREFIX) ? BranchSelectorTab.TAGS : BranchSelectorTab.BRANCHES
  )

  return {
    isLoading,
    fullGitRef,
    gitRefName,
    gitRefPath,
    isCommitSHA,
    fullGitRefWoDefault,
    repoData,
    refetchRepo,
    fullResourcePath,
    codeMode,
    preSelectedTab,
    setPreSelectedTab
  }
}
