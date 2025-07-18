import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { useListCommitsQuery } from '@harnessio/code-service-client'
import { BranchSelectorListItem, BranchSelectorTab, RepoCommitsView } from '@harnessio/ui/views'

import { BranchSelectorContainer } from '../../components-v2/branch-selector-container'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import useCodePathDetails from '../../hooks/useCodePathDetails'
import { useRepoCommits } from '../../hooks/useRepoCommits'
import { PathParams } from '../../RouteDefinitions'
import { PageResponseHeader } from '../../types'
import { normalizeGitRef, REFS_BRANCH_PREFIX, REFS_TAGS_PREFIX } from '../../utils/git-utils'

export default function RepoCommitsPage() {
  const routes = useRoutes()
  const repoRef = useGetRepoRef()
  const navigate = useNavigate()
  const { spaceId, repoId } = useParams<PathParams>()
  const { gitRefName, fullGitRef } = useCodePathDetails()
  const { toRepoCommits } = useRepoCommits()

  const [preSelectedTab, setPreSelectedTab] = useState<BranchSelectorTab>(
    fullGitRef.startsWith(REFS_TAGS_PREFIX) ? BranchSelectorTab.TAGS : BranchSelectorTab.BRANCHES
  )
  const [searchParams, setSearchParams] = useSearchParams()

  const queryPage = parseInt(searchParams.get('page') || '1', 10)

  const { data: { body: commitData, headers } = {}, isFetching: isFetchingCommits } = useListCommitsQuery({
    repo_ref: repoRef,
    queryParams: {
      page: queryPage,
      git_ref: normalizeGitRef(fullGitRef),
      include_stats: true
    }
  })

  const xNextPage = useMemo(() => parseInt(headers?.get(PageResponseHeader.xNextPage) || ''), [headers])
  const xPrevPage = useMemo(() => parseInt(headers?.get(PageResponseHeader.xPrevPage) || ''), [headers])

  const setPage = useCallback(
    (selectedPage: number) => setSearchParams({ page: String(selectedPage) }),
    [setSearchParams]
  )

  const selectBranchOrTag = useCallback(
    (branchTagName: BranchSelectorListItem, type: BranchSelectorTab) => {
      const newRef =
        type === BranchSelectorTab.TAGS
          ? `${REFS_TAGS_PREFIX + branchTagName.name}`
          : `${REFS_BRANCH_PREFIX + branchTagName.name}`
      setPreSelectedTab(type)
      navigate(toRepoCommits({ spaceId, repoId, fullGitRef: newRef, gitRefName: branchTagName.name }))
    },
    [spaceId]
  )

  return (
    <RepoCommitsView
      toCommitDetails={({ sha }: { sha: string }) => routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: sha })}
      toCode={({ sha }: { sha: string }) => routes.toRepoFiles({ spaceId, repoId, '*': sha })}
      commitsList={commitData?.commits}
      isFetchingCommits={isFetchingCommits}
      page={queryPage}
      setPage={setPage}
      xNextPage={xNextPage}
      xPrevPage={xPrevPage}
      renderProp={() => (
        <BranchSelectorContainer
          onSelectBranchorTag={selectBranchOrTag}
          selectedBranch={{ name: gitRefName, sha: '' }}
          preSelectedTab={preSelectedTab}
        />
      )}
    />
  )
}
