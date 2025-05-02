import { useCallback, useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import {
  getContent,
  useFindRepositoryQuery,
  useGetBranchQuery,
  useGetContentQuery,
  useListBranchesQuery,
  useListPathsQuery,
  useListTagsQuery
} from '@harnessio/code-service-client'
import { BranchSelectorListItem, BranchSelectorTab, RepoSidebar as RepoSidebarView } from '@harnessio/ui/views'

import { BranchSelectorContainer } from '../../components-v2/branch-selector-container'
import Explorer from '../../components/FileExplorer'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import useCodePathDetails from '../../hooks/useCodePathDetails'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { orderSortDate } from '../../types'
import { FILE_SEPERATOR, normalizeGitRef, REFS_TAGS_PREFIX } from '../../utils/git-utils'
import { useRepoBranchesStore } from './stores/repo-branches-store'
import { transformBranchList } from './transform-utils/branch-transform'

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
    // selectedBranchTag,
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
  const [selectedBranchOrTag, setSelectedBranchOrTag] = useState<BranchSelectorListItem | null>(null)
  const [preSelectedTab, setPreSelectedTab] = useState<BranchSelectorTab>(BranchSelectorTab.BRANCHES)

  console.log('at the top', selectedBranchOrTag)

  useEffect(() => {
    setSpaceIdAndRepoId(spaceId || '', repoId || '')
  }, [spaceId, repoId])

  const { data: { body: repository } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })

  const { data: { body: branches } = {} } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: {
      include_commit: false,
      sort: 'date',
      order: orderSortDate.DESC,
      limit: 50,
      query: searchQuery
    }
  })

  const { data: { body: selectedGitRefBranch } = {} } = useGetBranchQuery(
    {
      repo_ref: repoRef,
      branch_name: fullGitRef,
      queryParams: {}
    },
    {
      enabled: !!fullGitRef
    }
  )

  useEffect(() => {
    if (selectedGitRefBranch) {
      console.log('in here 5')
      setSelectedBranchOrTag({
        name: selectedGitRefBranch.name ?? '',
        sha: selectedGitRefBranch.sha ?? ''
      })
    }
    console.log('in here 4')
  }, [selectedGitRefBranch, fullGitRef])

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
    console.log('somehting here for sure')
    if (!repository?.default_branch || !branchList.length) {
      console.log('in here 1')
      return
    }
    if (!fullGitRef) {
      console.log('in here 2')
      const defaultBranch = branchList.find(branch => branch.default)
      setSelectedBranchOrTag({
        name: defaultBranch?.name || repository?.default_branch || '',
        sha: defaultBranch?.sha || '',
        default: true
      })
    } else {
      console.log('in here 3', selectedBranchOrTag)
      const selectedGitRefTag = tagList.find(tag => tag.name === gitRefName)
      if (selectedGitRefBranch) {
        console.log('in here 3a', selectedGitRefBranch)
        setSelectedBranchOrTag({ name: selectedGitRefBranch.name ?? '', sha: selectedGitRefBranch.sha ?? '' })
      } else if (selectedGitRefTag) {
        console.log('in here 3b', selectedGitRefTag)
        setSelectedBranchOrTag(selectedGitRefTag)
      }
      console.log('inside 3', selectedBranchOrTag)
    }
  }, [repository?.default_branch, fullGitRef, branchList, tagList])

  const { data: repoDetails } = useGetContentQuery({
    path: '',
    repo_ref: repoRef,
    queryParams: {
      include_commit: true,
      git_ref: normalizeGitRef(fullGitRef || selectedBranchOrTag?.name)
    }
  })

  const { data: filesData } = useListPathsQuery({
    repo_ref: repoRef,
    queryParams: { git_ref: normalizeGitRef(fullGitRef || selectedBranchOrTag?.name) }
  })

  const filesList = filesData?.body?.files || []

  // const selectBranchOrTag = useCallback(
  //   (branchTagName: BranchSelectorListItem, type: BranchSelectorTab) => {
  //     if (type === BranchSelectorTab.BRANCHES) {
  //       const branch = branchList.find(branch => branch.name === branchTagName.name)
  //       if (branch) {
  //         setSelectedBranchTag(branch)
  //         setSelectedRefType(type)
  //         setSelectedBranchOrTag(branch)
  //         navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${branch.name}`)
  //         setPreSelectedTab(BranchSelectorTab.BRANCHES)
  //       }
  //     } else if (type === BranchSelectorTab.TAGS) {
  //       const tag = tagList.find(tag => tag.name === branchTagName.name)
  //       if (tag) {
  //         setSelectedBranchTag(tag)
  //         setSelectedRefType(type)
  //         setSelectedBranchOrTag(tag)
  //         navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${REFS_TAGS_PREFIX + tag.name}`)
  //         setPreSelectedTab(BranchSelectorTab.TAGS)
  //       }
  //     }
  //   },
  //   [navigate, repoId, spaceId, branchList, tagList]
  // )

  const selectBranchOrTag = useCallback(
    (branchTagName: BranchSelectorListItem, type: BranchSelectorTab) => {
      console.log('on change branchtag', branchTagName)
      if (type === BranchSelectorTab.BRANCHES) {
        setSelectedBranchOrTag(branchTagName)
        setSelectedBranchTag(branchTagName)
        setSelectedRefType(type)
        setPreSelectedTab(BranchSelectorTab.BRANCHES)
        navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${branchTagName.name}`)
      } else if (type === BranchSelectorTab.TAGS) {
        setSelectedBranchOrTag(branchTagName)
        setSelectedBranchTag(branchTagName)
        setSelectedRefType(type)
        setPreSelectedTab(BranchSelectorTab.TAGS)
        navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${REFS_TAGS_PREFIX + branchTagName.name}`)
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
          git_ref: normalizeGitRef(fullGitRef || selectedBranchOrTag?.name)
        }
      }).then(response => {
        if (response.body.type === 'dir') {
          navigate(
            `${routes.toRepoFiles({ spaceId, repoId })}/new/${fullGitRef || selectedBranchOrTag?.name}/~/${fullResourcePath}`
          )
        } else {
          const parentDirPath = fullResourcePath?.split(FILE_SEPERATOR).slice(0, -1).join(FILE_SEPERATOR)
          navigate(
            `${routes.toRepoFiles({ spaceId, repoId })}/new/${fullGitRef || selectedBranchOrTag?.name}/~/${parentDirPath}`
          )
        }
      })
    } else {
      navigate(`${routes.toRepoFiles({ spaceId, repoId })}/new/${fullGitRef || selectedBranchOrTag?.name}/~/`)
    }
  }, [fullResourcePath, fullGitRef, navigate, repoId, repoRef, selectedBranchOrTag?.name])

  const navigateToFile = useCallback(
    (filePath: string) => {
      navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${fullGitRef || selectedBranchOrTag?.name}/~/${filePath}`)
    },
    [fullGitRef, selectedBranchOrTag?.name, navigate, repoId]
  )

  console.log('outside fn', selectedBranchOrTag)

  // TODO: repoId and spaceId must be defined
  if (!repoId) return <></>

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: 'auto 1px 1fr' }}>
        {!repository?.is_empty && (
          <RepoSidebarView
            // selectBranchOrTag={selectBranchOrTag}
            // useRepoBranchesStore={useRepoBranchesStore}
            useTranslationStore={useTranslationStore}
            navigateToNewFile={navigateToNewFile}
            navigateToFile={navigateToFile}
            filesList={filesList}
            // searchQuery={searchQuery}
            // setSearchQuery={setSearchQuery}
            branchSelectorRenderer={
              <BranchSelectorContainer
                onSelectBranchorTag={selectBranchOrTag}
                selectedBranch={selectedBranchOrTag}
                preSelectedTab={preSelectedTab}
              />
            }
          >
            {!!repoDetails?.body?.content?.entries?.length && (
              <Explorer repoDetails={repoDetails?.body} selectedBranch={selectedBranchOrTag?.name} />
            )}
          </RepoSidebarView>
        )}

        <Outlet />
      </div>
    </>
  )
}
