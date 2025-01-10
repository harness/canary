import { useCallback, useEffect, useState } from 'react'
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
import { useRoutes } from '../../framework/context/NavigationContext.tsx'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath.ts'
import useCodePathDetails from '../../hooks/useCodePathDetails.ts'
import { useTranslationStore } from '../../i18n/stores/i18n-store.ts'
import { PathParams } from '../../RouteDefinitions.ts'
import { orderSortDate } from '../../types.ts'
import { FILE_SEPERATOR, normalizeGitRef, REFS_TAGS_PREFIX } from '../../utils/git-utils.ts'
import { useRepoBranchesStore } from '././stores/repo-branches-store.ts'
import { transformBranchList } from './transform-utils/branch-transform.ts'

/**
 * TODO: This code was migrated from V2 and needs to be refactored.
 */
export const RepoSidebar = () => {
  const routes = useRoutes()
  const {
    branchList,
    tagList,
    setBranchList,
    setTagList,
    selectedBranchTag,
    setDefaultBranch,
    setSelectedBranchTag,
    setSelectedRefType,
    setSpaceIdAndRepoId
  } = useRepoBranchesStore()

  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()
  const { fullGitRef, gitRefName, fullResourcePath } = useCodePathDetails()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setSpaceIdAndRepoId(spaceId || '', repoId || '')
  }, [spaceId, repoId])

  const { data: { body: repository } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })

  const { data: { body: branches } = {} } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: {
      include_commit: false,
      sort: 'date',
      order: orderSortDate.ASC,
      limit: 50,
      query: searchQuery
    }
  })

  useEffect(() => {
    if (branches) {
      setBranchList(transformBranchList(branches, repository?.default_branch))
    }
    if (repository?.default_branch) {
      setDefaultBranch(repository?.default_branch)
    }
  }, [branches, repository?.default_branch])

  const { data: { body: tags } = {} } = useListTagsQuery({
    repo_ref: repoRef,
    queryParams: {
      include_commit: false,
      sort: 'date',
      order: orderSortDate.DESC,
      limit: 50
    }
  })

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
    if (!repository?.default_branch || !branchList.length) {
      return
    }
    if (!fullGitRef) {
      const defaultBranch = branchList.find(branch => branch.default)
      setSelectedBranchTag({
        name: defaultBranch?.name || repository?.default_branch || '',
        sha: defaultBranch?.sha || '',
        default: true
      })
    } else {
      const selectedGitRefBranch = branchList.find(branch => branch.name === fullGitRef)
      const selectedGitRefTag = tagList.find(tag => tag.name === gitRefName)
      if (selectedGitRefBranch) {
        setSelectedBranchTag(selectedGitRefBranch)
      } else if (selectedGitRefTag) {
        setSelectedBranchTag(selectedGitRefTag)
      }
    }
  }, [repository?.default_branch, fullGitRef, branchList, tagList])

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

  const selectBranchOrTag = useCallback(
    (branchTagName: BranchSelectorListItem, type: BranchSelectorTab) => {
      if (type === BranchSelectorTab.BRANCHES) {
        const branch = branchList.find(branch => branch.name === branchTagName.name)
        if (branch) {
          setSelectedBranchTag(branch)
          setSelectedRefType(type)
          navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${branch.name}`)
        }
      } else if (type === BranchSelectorTab.TAGS) {
        const tag = tagList.find(tag => tag.name === branchTagName.name)
        if (tag) {
          setSelectedBranchTag(tag)
          setSelectedRefType(type)
          navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${REFS_TAGS_PREFIX + tag.name}`)
        }
      }
    },
    [navigate, repoId, spaceId, branchList, tagList]
  )

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
          navigate(
            `${routes.toRepoFiles({ spaceId, repoId })}/new/${fullGitRef || selectedBranchTag.name}/~/${fullResourcePath}`
          )
        } else {
          const parentDirPath = fullResourcePath?.split(FILE_SEPERATOR).slice(0, -1).join(FILE_SEPERATOR)
          navigate(
            `${routes.toRepoFiles({ spaceId, repoId })}/new/${fullGitRef || selectedBranchTag.name}/~/${parentDirPath}`
          )
        }
      })
    } else {
      navigate(`${routes.toRepoFiles({ spaceId, repoId })}/new/${fullGitRef || selectedBranchTag.name}/~/`)
    }
  }, [fullResourcePath, fullGitRef, navigate, repoId, repoRef, selectedBranchTag.name])

  const navigateToFile = useCallback(
    (filePath: string) => {
      navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${fullGitRef || selectedBranchTag.name}/~/${filePath}`)
    },
    [fullGitRef, selectedBranchTag.name, navigate, repoId]
  )

  // TODO: repoId and spaceId must be defined
  if (!repoId || !spaceId) return <></>

  return (
    <>
      <div className="grid grid-cols-[auto_1fr]">
        <RepoSidebarView
          selectBranchOrTag={selectBranchOrTag}
          useRepoBranchesStore={useRepoBranchesStore}
          useTranslationStore={useTranslationStore}
          navigateToNewFile={navigateToNewFile}
          navigateToFile={navigateToFile}
          filesList={filesList}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        >
          {!!repoDetails?.body?.content?.entries?.length && (
            <Explorer repoDetails={repoDetails?.body} selectedBranch={selectedBranchTag.name} />
          )}
        </RepoSidebarView>
        {/* 100vh = screen height - (55px Breadcrumbs Height + 45px SubHeader Height = 100px) */}
        {/* Total height of both the divs should be 100vh */}
        <div className="min-h-[calc(100vh-100px)]">
          <Outlet />
        </div>
      </div>
    </>
  )
}
