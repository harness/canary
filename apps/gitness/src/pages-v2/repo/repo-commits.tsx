import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { parseAsInteger, useQueryState } from 'nuqs'

import { useFindRepositoryQuery, useListBranchesQuery, useListCommitsQuery } from '@harnessio/code-service-client'
import { RepoCommitsView } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { PageResponseHeader } from '../../types'
import { normalizeGitRef } from '../../utils/git-utils'
import { useRepoBranchesStore } from './stores/repo-branches-store'

export default function RepoCommitsPage() {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const { data: { body: repository } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })
  const { data: { body: branches } = {}, isFetching: isFetchingBranches } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: { page }
  })

  const { setBranchList, selectedBranchTag, setSelectedBranchTag, setSpaceIdAndRepoId } = useRepoBranchesStore()

  useEffect(() => {
    if (branches) {
      setBranchList(
        branches.map(item => ({
          name: item.name || '',
          sha: item.sha || ''
        }))
      )
    }
  }, [branches])

  useEffect(() => {
    setSpaceIdAndRepoId(spaceId || '', repoId || '')
  }, [spaceId, repoId])

  const { data: { body: commitData, headers } = {}, isFetching: isFetchingCommits } = useListCommitsQuery({
    repo_ref: repoRef,
    queryParams: { page, git_ref: normalizeGitRef(selectedBranchTag?.name), include_stats: true }
  })

  const xNextPage = parseInt(headers?.get(PageResponseHeader.xNextPage) || '')
  const xPrevPage = parseInt(headers?.get(PageResponseHeader.xPrevPage) || '')

  useEffect(() => {
    if (repository) {
      const defaultBranchSha = branches?.find(branch => branch.name === repository?.default_branch)?.sha || ''
      setSelectedBranchTag({ name: repository.default_branch || '', sha: defaultBranchSha })
    }
  }, [repository])

  return (
    <RepoCommitsView
      commitsList={commitData?.commits}
      isFetchingBranches={isFetchingBranches}
      isFetchingCommits={isFetchingCommits}
      page={page}
      setPage={(page: number) => setPage(page)}
      xNextPage={xNextPage}
      xPrevPage={xPrevPage}
      useRepoBranchesStore={useRepoBranchesStore}
      useTranslationStore={useTranslationStore}
    />
  )
}
