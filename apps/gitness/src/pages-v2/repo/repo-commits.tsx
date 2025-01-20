import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { parseAsInteger, useQueryState } from 'nuqs'

import {
  useFindRepositoryQuery,
  useListBranchesQuery,
  useListCommitsQuery,
  useListTagsQuery
} from '@harnessio/code-service-client'
import { BranchSelectorListItem, BranchSelectorTab, RepoCommitsView } from '@harnessio/ui/views'

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
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1).withOptions({ history: 'push' }))
  const commitsPath = routes.toRepoCommits({ spaceId, repoId })

  const {
    branchList,
    tagList,
    selectedRefType,
    setBranchList,
    setTagList,
    selectedBranchTag,
    setSelectedBranchTag,
    setSelectedRefType,
    setSpaceIdAndRepoId
  } = useRepoBranchesStore()

  const { data: { body: repository } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })
  const { data: { body: branches } = {} } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: { query: branchTagQuery }
  })
  const { data: { body: tags } = {} } = useListTagsQuery({
    repo_ref: repoRef,
    queryParams: { query: branchTagQuery }
  })

  useEffect(() => {
    if (branches) {
      setBranchList(transformBranchList(branches, repository?.default_branch))
    }
  }, [branches, repository?.default_branch])

  useEffect(() => {
    if (tags) {
      setTagList(
        tags.map(item => ({
          name: item?.name || '',
          sha: item?.sha || '',
          default: false
        }))
      )
    }
  }, [tags])

  useEffect(() => {
    setSpaceIdAndRepoId(spaceId || '', repoId || '')
  }, [spaceId, repoId])

  const { data: { body: commitData, headers } = {}, isFetching: isFetchingCommits } = useListCommitsQuery({
    repo_ref: repoRef,
    queryParams: {
      page,
      git_ref: normalizeGitRef(
        selectedRefType === BranchSelectorTab.TAGS
          ? REFS_TAGS_PREFIX + selectedBranchTag?.name
          : selectedBranchTag?.name
      ),
      include_stats: true
    }
  })
  const xNextPage = parseInt(headers?.get(PageResponseHeader.xNextPage) || '')
  const xPrevPage = parseInt(headers?.get(PageResponseHeader.xPrevPage) || '')

  const selectBranchOrTag = useCallback(
    (branchTagName: BranchSelectorListItem, type: BranchSelectorTab) => {
      if (type === BranchSelectorTab.BRANCHES) {
        const branch = branchList.find(branch => branch.name === branchTagName.name)
        if (branch) {
          setPage(1)
          setSelectedBranchTag(branch)
          setSelectedRefType(type)
        }
      } else if (type === BranchSelectorTab.TAGS) {
        const tag = tagList.find(tag => tag.name === branchTagName.name)
        if (tag) {
          setPage(1)
          setSelectedBranchTag(tag)
          setSelectedRefType(type)
        }
      }
    },
    [repoId, spaceId, branchList, tagList]
  )

  useEffect(() => {
    if (repository) {
      const defaultBranchSha = branches?.find(branch => branch.name === repository?.default_branch)?.sha || ''
      setSelectedBranchTag({ name: repository.default_branch || '', sha: defaultBranchSha })
    }
  }, [repository])

  return (
    <RepoCommitsView
      commitsList={commitData?.commits}
      isFetchingCommits={isFetchingCommits}
      page={page}
      setPage={setPage}
      xNextPage={xNextPage}
      xPrevPage={xPrevPage}
      selectBranchOrTag={selectBranchOrTag}
      useRepoBranchesStore={useRepoBranchesStore}
      useTranslationStore={useTranslationStore}
      searchQuery={branchTagQuery}
      setSearchQuery={setBranchTagQuery}
      commitsPath={commitsPath}
    />
  )
}
