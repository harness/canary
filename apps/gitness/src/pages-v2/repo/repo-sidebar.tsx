import { useCallback, useEffect } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import {
  getContent,
  useFindRepositoryQuery,
  useGetBranchQuery,
  useGetContentQuery,
  useListPathsQuery
} from '@harnessio/code-service-client'
import { BranchSelectorListItem, BranchSelectorTab, RepoSidebar as RepoSidebarView } from '@harnessio/ui/views'

import { BranchSelectorContainer } from '../../components-v2/branch-selector-container'
import Explorer from '../../components/FileExplorer'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import useCodePathDetails from '../../hooks/useCodePathDetails'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { FILE_SEPERATOR, normalizeGitRef, REFS_TAGS_PREFIX } from '../../utils/git-utils'
import { useRepoBranchesStore } from './stores/repo-branches-store'

/**
 * TODO: This code was migrated from V2 and needs to be refactored.
 */
export const RepoSidebar = () => {
  const routes = useRoutes()
  const {
    branchList,
    tagList,
    selectedBranchTag,
    selectedRefType,
    setSelectedBranchTag,
    setSelectedRefType,
    setSpaceIdAndRepoId
  } = useRepoBranchesStore()

  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()
  const { fullGitRef, gitRefName, fullResourcePath } = useCodePathDetails()
  const navigate = useNavigate()

  useEffect(() => {
    setSpaceIdAndRepoId(spaceId || '', repoId || '')
  }, [spaceId, repoId])

  const { data: { body: repository } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })

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
      setSelectedBranchTag({
        name: selectedGitRefBranch.name ?? '',
        sha: selectedGitRefBranch.sha ?? ''
      })
    }
  }, [selectedGitRefBranch, fullGitRef])

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
      const selectedGitRefTag = tagList.find(tag => tag.name === gitRefName)
      if (selectedGitRefBranch) {
        setSelectedBranchTag({ name: selectedGitRefBranch.name ?? '', sha: selectedGitRefBranch.sha ?? '' })
      } else if (selectedGitRefTag) {
        setSelectedBranchTag(selectedGitRefTag)
      }
    }
  }, [repository?.default_branch, fullGitRef, branchList, tagList, gitRefName, selectedGitRefBranch])

  const { data: repoDetails } = useGetContentQuery({
    path: '',
    repo_ref: repoRef,
    queryParams: {
      include_commit: true,
      git_ref: normalizeGitRef(fullGitRef || selectedBranchTag?.name)
    }
  })

  const { data: filesData } = useListPathsQuery({
    repo_ref: repoRef,
    queryParams: { git_ref: normalizeGitRef(fullGitRef || selectedBranchTag?.name) }
  })

  const filesList = filesData?.body?.files || []

  const selectBranchOrTag = useCallback(
    (branchTagName: BranchSelectorListItem, type: BranchSelectorTab) => {
      if (type === BranchSelectorTab.BRANCHES) {
        setSelectedBranchTag(branchTagName)
        setSelectedRefType(type)
        navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${branchTagName.name}`)
      } else if (type === BranchSelectorTab.TAGS) {
        setSelectedBranchTag(branchTagName)
        setSelectedRefType(type)
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
          git_ref: normalizeGitRef(fullGitRef || selectedBranchTag?.name)
        }
      }).then(response => {
        if (response.body.type === 'dir') {
          navigate(
            `${routes.toRepoFiles({ spaceId, repoId })}/new/${fullGitRef || selectedBranchTag?.name}/~/${fullResourcePath}`
          )
        } else {
          const parentDirPath = fullResourcePath?.split(FILE_SEPERATOR).slice(0, -1).join(FILE_SEPERATOR)
          navigate(
            `${routes.toRepoFiles({ spaceId, repoId })}/new/${fullGitRef || selectedBranchTag?.name}/~/${parentDirPath}`
          )
        }
      })
    } else {
      navigate(`${routes.toRepoFiles({ spaceId, repoId })}/new/${fullGitRef || selectedBranchTag?.name}/~/`)
    }
  }, [fullResourcePath, fullGitRef, navigate, repoId, repoRef, selectedBranchTag?.name])

  const navigateToFile = useCallback(
    (filePath: string) => {
      navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${fullGitRef || selectedBranchTag?.name}/~/${filePath}`)
    },
    [fullGitRef, selectedBranchTag?.name, navigate, repoId]
  )

  // TODO: repoId and spaceId must be defined
  if (!repoId) return <></>

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: 'auto 1px 1fr' }}>
        {!repository?.is_empty && (
          <RepoSidebarView
            useTranslationStore={useTranslationStore}
            navigateToNewFile={navigateToNewFile}
            navigateToFile={navigateToFile}
            filesList={filesList}
            branchSelectorRenderer={
              <BranchSelectorContainer
                onSelectBranchorTag={selectBranchOrTag}
                selectedBranch={selectedBranchTag}
                preSelectedTab={selectedRefType}
              />
            }
          >
            {!!repoDetails?.body?.content?.entries?.length && (
              <Explorer repoDetails={repoDetails?.body} selectedBranch={selectedBranchTag?.name} />
            )}
          </RepoSidebarView>
        )}

        <Outlet />
      </div>
    </>
  )
}
