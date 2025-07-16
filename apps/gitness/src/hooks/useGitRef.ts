import { useFindRepositoryQuery } from '@harnessio/code-service-client'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { REFS_BRANCH_PREFIX } from '../utils/git-utils'
import useCodePathDetails from './useCodePathDetails'

export function useGitRef() {
  const { fullGitRef: rawFullGitRef, gitRefName: rawGitRefName, isCommitSHA } = useCodePathDetails()
  const repoRef = useGetRepoRef()

  const { data: { body: repository } = {}, isLoading } = useFindRepositoryQuery({ repo_ref: repoRef })
  const prefixedDefaultBranch = repository?.default_branch ? `${REFS_BRANCH_PREFIX}${repository?.default_branch}` : ''
  const fullGitRef = rawFullGitRef || prefixedDefaultBranch || ''
  const gitRefName = rawGitRefName || repository?.default_branch || ''
  const gitRefPath = fullGitRef ? `/${isCommitSHA ? gitRefName : fullGitRef}` : ''

  return {
    isLoading,
    fullGitRef,
    gitRefName,
    gitRefPath,
    isCommitSHA,
    repository
  }
}
