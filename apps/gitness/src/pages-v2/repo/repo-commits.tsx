import { useCallback, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { useListCommitsQuery } from '@harnessio/code-service-client'
import { useRouterContext } from '@harnessio/ui/context'
import { BranchSelectorListItem, BranchSelectorTab, RepoCommitsView } from '@harnessio/ui/views'

import { BranchSelectorContainer } from '../../components-v2/branch-selector-container'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { PageResponseHeader } from '../../types'
import { normalizeGitRef, REFS_TAGS_PREFIX } from '../../utils/git-utils'

export default function RepoCommitsPage() {
  const routes = useRoutes()
  const repoRef = useGetRepoRef()
  const { spaceId, repoId, branchId, tagId } = useParams<PathParams>()
  const { navigate } = useRouterContext()

  const decodedBranchId = branchId ? decodeURIComponent(branchId) : undefined
  const decodedTagId = tagId ? decodeURIComponent(tagId) : undefined

  const [selectedBranchOrTag, setSelectedBranchOrTag] = useState<BranchSelectorListItem | null>(
    decodedBranchId ? { name: decodedBranchId, sha: '' } : decodedTagId ? { name: decodedTagId, sha: '' } : null
  )
  const [selectedRefType, setSelectedRefType] = useState<BranchSelectorTab>(
    decodedBranchId ? BranchSelectorTab.BRANCHES : decodedTagId ? BranchSelectorTab.TAGS : BranchSelectorTab.BRANCHES
  )
  const [searchParams, setSearchParams] = useSearchParams()

  const queryPage = parseInt(searchParams.get('page') || '1', 10)

  const [page, setPage] = useState(queryPage)

  useEffect(() => {
    setSearchParams({ page: String(page) })
  }, [page, setSearchParams])

  useEffect(() => {
    setPage(queryPage)
  }, [queryPage])

  const { data: { body: commitData, headers } = {}, isFetching: isFetchingCommits } = useListCommitsQuery({
    repo_ref: repoRef,
    queryParams: {
      page: page,
      git_ref: normalizeGitRef(
        selectedRefType === BranchSelectorTab.TAGS
          ? REFS_TAGS_PREFIX + selectedBranchOrTag?.name
          : selectedBranchOrTag?.name
      ),
      include_stats: true
    }
  })

  const xNextPage = parseInt(headers?.get(PageResponseHeader.xNextPage) || '')
  const xPrevPage = parseInt(headers?.get(PageResponseHeader.xPrevPage) || '')

  const selectBranchOrTag = useCallback(
    (branchTagName: BranchSelectorListItem, type: BranchSelectorTab) => {
      if (type === BranchSelectorTab.BRANCHES) {
        setPage(1)
        setSelectedBranchOrTag(branchTagName)
        setSelectedRefType(type)
      } else if (type === BranchSelectorTab.TAGS) {
        setPage(1)
        setSelectedBranchOrTag(branchTagName)
        setSelectedRefType(type)
      }
    },
    [spaceId]
  )

  useEffect(() => {
    if (selectedBranchOrTag?.name) {
      const encodedBranchOrTagId = encodeURIComponent(selectedBranchOrTag.name)
      selectedRefType === BranchSelectorTab.TAGS
        ? navigate(routes.toRepoTagCommits({ spaceId, repoId, tagId: encodedBranchOrTagId }))
        : navigate(routes.toRepoBranchCommits({ spaceId, repoId, branchId: encodedBranchOrTagId }))
    }
  }, [selectedBranchOrTag, navigate, routes, spaceId, repoId, selectedRefType])

  return (
    <RepoCommitsView
      toCommitDetails={({ sha }: { sha: string }) =>
        routes.toRepoCommitDetails({ spaceId, repoId, branchId, commitSHA: sha })
      }
      toCode={({ sha }: { sha: string }) => `${routes.toRepoFiles({ spaceId, repoId })}/${sha}`}
      commitsList={commitData?.commits}
      isFetchingCommits={isFetchingCommits}
      page={page}
      setPage={setPage}
      xNextPage={xNextPage}
      xPrevPage={xPrevPage}
      useTranslationStore={useTranslationStore}
      renderProp={() => (
        <BranchSelectorContainer
          onSelectBranchorTag={selectBranchOrTag}
          selectedBranch={selectedBranchOrTag}
          preSelectedTab={selectedRefType}
        />
      )}
    />
  )
}
