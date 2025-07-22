import { useState } from 'react'

import { useFindRepositoryQuery } from '@harnessio/code-service-client'
import { BranchSelectorTab, CodeModes } from '@harnessio/ui/views'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { isRefACommitSHA, REFS_BRANCH_PREFIX, REFS_TAGS_PREFIX } from '../utils/git-utils'
import useCodePathDetails from './useCodePathDetails'

export function useGitRef() {
  const {
    fullGitRef: fullGitRefWoDefault,
    gitRefName: gitRefNameWoDefault,
    fullResourcePath,
    codeMode
  } = useCodePathDetails()
  const repoRef = useGetRepoRef()

  const prefixCodeMode = (gitRefPath: string) =>
    codeMode !== CodeModes.VIEW ? `${codeMode}/${gitRefPath}` : gitRefPath

  const {
    data: { body: repoData } = {},
    isLoading,
    refetch: refetchRepo
  } = useFindRepositoryQuery({ repo_ref: repoRef })
  const prefixedDefaultBranch = repoData?.default_branch ? `${REFS_BRANCH_PREFIX}${repoData?.default_branch}` : ''
  const fullGitRef = fullGitRefWoDefault || prefixedDefaultBranch || ''
  const gitRefName = gitRefNameWoDefault || repoData?.default_branch || ''
  const gitRefPath = fullGitRef ? prefixCodeMode(`${isRefACommitSHA(fullGitRef) ? gitRefName : fullGitRef}`) : ''
  const [preSelectedTab, setPreSelectedTab] = useState<BranchSelectorTab>(
    fullGitRef.startsWith(REFS_TAGS_PREFIX) ? BranchSelectorTab.TAGS : BranchSelectorTab.BRANCHES
  )

  return {
    isLoading,
    fullGitRef,
    gitRefName,
    gitRefPath,
    fullGitRefWoDefault,
    repoData,
    refetchRepo,
    fullResourcePath,
    codeMode,
    preSelectedTab,
    setPreSelectedTab,
    prefixedDefaultBranch
  }
}
