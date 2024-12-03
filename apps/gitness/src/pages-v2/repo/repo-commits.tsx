import { useEffect, useState } from 'react'

import { parseAsInteger, useQueryState } from 'nuqs'

import { useFindRepositoryQuery, useListBranchesQuery, useListCommitsQuery } from '@harnessio/code-service-client'
import { RepoCommitsView } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { PageResponseHeader } from '../../types'
import { normalizeGitRef } from '../../utils/git-utils'

const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]

export default function RepoCommitsPage() {
  const repoRef = useGetRepoRef()
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const { data: { body: repository } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })
  const { data: { body: branches } = {}, isFetching: isFetchingBranches } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: { page }
  })

  const [selectedBranch, setSelectedBranch] = useState<string>('')

  const { data: { body: commitData, headers } = {}, isFetching: isFetchingCommits } = useListCommitsQuery({
    repo_ref: repoRef,
    queryParams: { page, git_ref: normalizeGitRef(selectedBranch), include_stats: true }
  })

  const xNextPage = parseInt(headers?.get(PageResponseHeader.xNextPage) || '')
  const xPrevPage = parseInt(headers?.get(PageResponseHeader.xPrevPage) || '')

  // 🚨 API not supporting sort, so waiting for API changes
  // const { sort } = useCommonFilter()

  useEffect(() => {
    if (repository) {
      setSelectedBranch(repository?.default_branch || '')
    }
  }, [repository])

  const selectBranch = (branch: string) => {
    setSelectedBranch(branch)
  }

  return (
    <RepoCommitsView
      branches={branches?.map(branch => {
        return { name: branch.name }
      })}
      commitsList={commitData?.commits}
      isFetchingBranches={isFetchingBranches}
      isFetchingCommits={isFetchingCommits}
      page={page}
      selectBranch={selectBranch}
      selectedBranch={selectedBranch}
      setPage={(page: number) => setPage(page)}
      xNextPage={xNextPage}
      xPrevPage={xPrevPage}
      sortOptions={sortOptions}
    />
  )
}
