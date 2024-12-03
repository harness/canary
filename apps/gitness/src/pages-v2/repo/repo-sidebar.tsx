import { useCallback, useEffect, useMemo } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import {
  getContent,
  useFindRepositoryQuery,
  useGetContentQuery,
  useListBranchesQuery,
  useListPathsQuery,
  useListTagsQuery
} from '@harnessio/code-service-client'
import { BranchSelectorListItem, BranchSelectorTab, RepoSidebar as RepoSidebarView } from '@harnessio/ui/views'

import Explorer from '../../components/FileExplorer'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath.ts'
import useCodePathDetails from '../../hooks/useCodePathDetails.ts'
import { useTranslationStore } from '../../i18n/stores/i18n-store.ts'
import { PathParams } from '../../RouteDefinitions.ts'
import { FILE_SEPERATOR, normalizeGitRef, REFS_TAGS_PREFIX } from '../../utils/git-utils.ts'
import { useRepoBranchesStore } from '././stores/repo-branches-store.ts'

/**
 * TODO: This code was migrated from V2 and needs to be refactored.
 */
export const RepoSidebar = () => {
  const { selectedBranchTag, setSelectedBranchTag, selectedBranchType, setSpaceIdAndRepoId } = useRepoBranchesStore()

  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()
  const { fullGitRef, gitRefName, fullResourcePath } = useCodePathDetails()
  const navigate = useNavigate()

  useEffect(() => {
    !selectedBranchTag && setSelectedBranchTag({ name: fullGitRef || '', sha: '' })
  }, [fullGitRef, selectedBranchTag])

  useEffect(() => {
    setSpaceIdAndRepoId(spaceId || '', repoId || '')
  }, [spaceId, repoId])

  const { data: repository } = useFindRepositoryQuery({ repo_ref: repoRef })

  const { data: branches } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: {
      include_commit: false,
      sort: 'date',
      order: 'asc',
      limit: 20,
      page: 1,
      query: ''
    }
  })

  const branchList: BranchSelectorListItem[] = useMemo(() => {
    if (!branches?.body) return []

    return branches.body.map(item => ({
      name: item?.name || '',
      sha: item?.sha || '',
      default: item?.name === repository?.body?.default_branch
    }))
  }, [branches, repository?.body?.default_branch])

  const { data: tags } = useListTagsQuery({
    repo_ref: repoRef,
    queryParams: {
      include_commit: false,
      sort: 'date',
      order: 'asc',
      limit: 20,
      page: 1,
      query: ''
    }
  })

  const tagsList: BranchSelectorListItem[] = useMemo(() => {
    if (!tags?.body) return []

    return tags.body.map(item => ({
      name: item?.name || '',
      sha: item?.sha || '',
      default: false
    }))
  }, [tags])

  useEffect(() => {
    if (!repository?.body?.default_branch || !branchList.length) {
      return
    }
    if (!fullGitRef) {
      const defaultBranch = branchList.find(branch => branch.default)
      if (defaultBranch) {
        setSelectedBranchTag(defaultBranch)
      }
    } else {
      const selectedGitRefBranch = branchList.find(branch => branch.name === fullGitRef)
      const selectedGitRefTag = tagsList.find(tag => tag.name === gitRefName)
      if (selectedGitRefBranch) {
        setSelectedBranchTag(selectedGitRefBranch)
      } else if (selectedGitRefTag) {
        setSelectedBranchTag(selectedGitRefTag)
      }
    }
  }, [repository?.body?.default_branch, fullGitRef, branchList, tagsList])

  const { data: repoDetails } = useGetContentQuery({
    path: '',
    repo_ref: repoRef,
    queryParams: {
      include_commit: true,
      git_ref: normalizeGitRef(fullGitRef || selectedBranchTag.name)
    }
  })

  const { data: filesData } = useListPathsQuery({
    repo_ref: repoRef,
    queryParams: { git_ref: normalizeGitRef(fullGitRef || selectedBranchTag.name) }
  })

  const filesList = filesData?.body?.files || []

  useEffect(() => {
    if (selectedBranchType === BranchSelectorTab.BRANCHES) {
      const branch = branchList?.find(branch => branch.name === selectedBranchTag.name)
      if (branch) {
        setSelectedBranchTag(branch)
        navigate(`${branch.name}`)
      }
    } else if (selectedBranchType === BranchSelectorTab.TAGS) {
      const tag = tagsList?.find(tag => tag.name === selectedBranchTag.name)
      if (tag) {
        setSelectedBranchTag(tag)
        navigate(`${REFS_TAGS_PREFIX + tag.name}`)
      }
    }
  }, [navigate, branchList, tagsList, selectedBranchTag, selectedBranchType])

  const navigateToNewFile = useCallback(() => {
    if (fullResourcePath) {
      getContent({
        path: fullResourcePath || '',
        repo_ref: repoRef,
        queryParams: {
          include_commit: true,
          git_ref: normalizeGitRef(fullGitRef || selectedBranchTag.name)
        }
      }).then(response => {
        if (response.body.type === 'dir') {
          navigate(`new/${fullGitRef || selectedBranchTag.name}/~/${fullResourcePath}`)
        } else {
          const parentDirPath = fullResourcePath?.split(FILE_SEPERATOR).slice(0, -1).join(FILE_SEPERATOR)
          navigate(`new/${fullGitRef || selectedBranchTag.name}/~/${parentDirPath}`)
        }
      })
    } else {
      navigate(`new/${fullGitRef || selectedBranchTag.name}/~/`)
    }
  }, [fullResourcePath, fullGitRef, navigate, repoId, repoRef, selectedBranchTag.name])

  const navigateToFile = useCallback(
    (filePath: string) => {
      navigate(`${fullGitRef || selectedBranchTag.name}/~/${filePath}`)
    },
    [fullGitRef, selectedBranchTag.name, navigate, repoId]
  )

  // TODO: repoId and spaceId must be defined
  if (!repoId || !spaceId) return <></>

  return (
    <>
      <RepoSidebarView
        hasHeader
        hasSubHeader
        useRepoBranchesStore={useRepoBranchesStore}
        useTranslationStore={useTranslationStore}
        navigateToNewFile={navigateToNewFile}
        navigateToFile={navigateToFile}
        filesList={filesList}
      >
        {!!repoDetails?.body?.content?.entries?.length && (
          <Explorer repoDetails={repoDetails?.body} selectedBranch={selectedBranchTag.name} />
        )}
      </RepoSidebarView>
      <Outlet />
    </>
  )
}
