import { useCallback, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import {
  useFindRepositoryQuery,
  useListBranchesQuery,
  useListCommitsQuery,
  useListTagsQuery
} from '@harnessio/code-service-client'
import { BranchSelectorListItem, BranchSelectorTab, RepoCommitsView } from '@harnessio/ui/views'

import { BranchSelectorContainer } from '../../components-v2/branch-selector-container'
import { useBranchSelectorStore } from '../../components-v2/stores/branch-selector-store'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { PageResponseHeader } from '../../types'
import { normalizeGitRef, REFS_TAGS_PREFIX } from '../../utils/git-utils'
import { useRepoBranchesStore } from './stores/repo-branches-store'
import { transformBranchList } from './transform-utils/branch-transform'

export default function RepoCommitsPage() {
  const routes = useRoutes()
  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()
  const [branchTagQuery, setBranchTagQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const queryPage = parseInt(searchParams.get('page') || '1', 10)

  const {
    //   branchList,
    //   tagList,
    // selectedRefType,
    //   setBranchList,
    //   setTagList,
    //   selectedBranchTag,
    //   setSelectedBranchTag,
    //   setSelectedRefType,
    setSpaceIdAndRepoId
  } = useRepoBranchesStore()

  const { selectedBranchOrTag, selectedRefType } = useBranchSelectorStore()

  // const { data: { body: repository } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })
  // const { data: { body: branches } = {} } = useListBranchesQuery({
  //   repo_ref: repoRef,
  //   queryParams: { query: branchTagQuery }
  // })
  // const { data: { body: tags } = {} } = useListTagsQuery({
  //   repo_ref: repoRef,
  //   queryParams: { query: branchTagQuery }
  // })

  // useEffect(() => {
  //   if (branches) {
  //     setBranchList(transformBranchList(branches, repository?.default_branch))
  //   }
  // }, [branches, repository?.default_branch])

  useEffect(() => {
    setSpaceIdAndRepoId(spaceId || '', repoId || '')
  }, [spaceId, repoId])

  useEffect(() => {
    setSearchParams({ page: String(queryPage), query: branchTagQuery })
  }, [queryPage, branchTagQuery, setSearchParams])

  console.log('selectedBranchOrTag', selectedBranchOrTag, selectedRefType)

  const { data: { body: commitData, headers } = {}, isFetching: isFetchingCommits } = useListCommitsQuery({
    repo_ref: repoRef,
    queryParams: {
      page: queryPage,
      git_ref: normalizeGitRef(
        selectedRefType === BranchSelectorTab.TAGS
          ? REFS_TAGS_PREFIX + selectedBranchOrTag?.name
          : selectedBranchOrTag?.name
      ),
      include_stats: true
    }
  })

  console.log('commitData', commitData)
  const xNextPage = parseInt(headers?.get(PageResponseHeader.xNextPage) || '')
  const xPrevPage = parseInt(headers?.get(PageResponseHeader.xPrevPage) || '')

  const [_page, setPage] = useState(queryPage)

  // const selectBranchOrTag = useCallback(
  //   (branchTagName: BranchSelectorListItem, type: BranchSelectorTab) => {
  //     if (type === BranchSelectorTab.BRANCHES) {
  //       const branch = branchList.find(branch => branch.name === branchTagName.name)
  //       if (branch) {
  //         setPage(1)
  //         setSelectedBranchTag(branch)
  //         setSelectedRefType(type)
  //       }
  //     } else if (type === BranchSelectorTab.TAGS) {
  //       const tag = tagList.find(tag => tag.name === branchTagName.name)
  //       if (tag) {
  //         setPage(1)
  //         setSelectedBranchTag(tag)
  //         setSelectedRefType(type)
  //       }
  //     }
  //   },
  //   [repoId, spaceId, branchList, tagList]
  // )

  return (
    <RepoCommitsView
      toCommitDetails={({ sha }: { sha: string }) => routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: sha })}
      toCode={({ sha }: { sha: string }) => `${routes.toRepoFiles({ spaceId, repoId })}/${sha}`}
      commitsList={commitData?.commits}
      isFetchingCommits={isFetchingCommits}
      page={queryPage}
      setPage={setPage}
      xNextPage={xNextPage}
      xPrevPage={xPrevPage}
      // selectBranchOrTag={selectBranchOrTag}
      useRepoBranchesStore={useRepoBranchesStore}
      useTranslationStore={useTranslationStore}
      searchQuery={branchTagQuery}
      setSearchQuery={setBranchTagQuery}
      renderProp={BranchSelectorContainer}
    />
  )
}
