import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { CreateBranchDialog } from '../../components-v2/create-branch-dialog'
import Explorer from '../../components/FileExplorer'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import useCodePathDetails from '../../hooks/useCodePathDetails'
import { PathParams } from '../../RouteDefinitions'
import { FILE_SEPERATOR, normalizeGitRef, REFS_BRANCH_PREFIX, REFS_TAGS_PREFIX } from '../../utils/git-utils'
import { transformBranchList } from './transform-utils/branch-transform'

/**
 * TODO: This code was migrated from V2 and needs to be refactored.
 */
export const RepoSidebar = () => {
  const routes = useRoutes()

  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()
  const { fullGitRef, gitRefName, fullResourcePath } = useCodePathDetails()
  const navigate = useNavigate()
  const [isCreateBranchDialogOpen, setCreateBranchDialogOpen] = useState(false)
  const [branchQueryForNewBranch, setBranchQueryForNewBranch] = useState<string>('')

  const { data: { body: repository } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })

  const prefixedGitRef = fullGitRef || `${REFS_BRANCH_PREFIX}${repository?.default_branch}` || ''
  const effectiveGitRefName = gitRefName || repository?.default_branch || ''

  const [selectedRefType, setSelectedRefType] = useState<BranchSelectorTab>(
    prefixedGitRef.startsWith(REFS_TAGS_PREFIX) ? BranchSelectorTab.TAGS : BranchSelectorTab.BRANCHES
  )

  const { data: { body: selectedGitRefBranch } = {} } = useGetBranchQuery(
    {
      repo_ref: repoRef,
      branch_name: prefixedGitRef,
      queryParams: {}
    },
    {
      enabled: !!prefixedGitRef
    }
  )

  const { data: { body: branches } = {} } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: {
      include_commit: false,
      sort: 'date',
      limit: 50
    }
  })

  const { data: { body: tags } = {} } = useListTagsQuery({
    repo_ref: repoRef,
    queryParams: {
      include_commit: false,
      sort: 'date',
      limit: 50
    }
  })

  const transformedBranchList = useMemo(
    () => (branches ? transformBranchList(branches, repository?.default_branch) : []),
    [branches, repository?.default_branch]
  )

  const transformedTags = useMemo(
    () =>
      tags?.map((tag: { name?: string; sha?: string }) => ({
        name: tag?.name || '',
        sha: tag?.sha || '',
        default: false
      })) || [],
    [tags]
  )

  useEffect(() => {
    if (!repository?.default_branch || !transformedBranchList.length) {
      return
    }
    if (!prefixedGitRef) {
      const defaultBranch = transformedBranchList.find(branch => branch.name === repository.default_branch)
      const defaultBranchName = defaultBranch?.name || repository?.default_branch
      if (defaultBranchName) {
        navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${defaultBranchName}`)
      }
    } else {
      const selectedGitRefTag = transformedTags.find(tag => tag.name === effectiveGitRefName)
      if (selectedGitRefBranch) {
        setSelectedRefType(BranchSelectorTab.BRANCHES)
      } else if (selectedGitRefTag) {
        setSelectedRefType(BranchSelectorTab.TAGS)
      } else {
        setSelectedRefType(BranchSelectorTab.BRANCHES)
      }
    }
  }, [
    repository?.default_branch,
    prefixedGitRef,
    transformedBranchList,
    transformedTags,
    effectiveGitRefName,
    selectedGitRefBranch
  ])

  const { data: repoDetails } = useGetContentQuery({
    path: '',
    repo_ref: repoRef,
    queryParams: {
      include_commit: true,
      git_ref: normalizeGitRef(prefixedGitRef)
    }
  })

  const { data: filesData } = useListPathsQuery({
    repo_ref: repoRef,
    queryParams: { git_ref: normalizeGitRef(prefixedGitRef) }
  })

  const filesList = filesData?.body?.files || []

  const selectBranchOrTag = useCallback(
    (branchTagName: BranchSelectorListItem, type: BranchSelectorTab) => {
      if (type === BranchSelectorTab.BRANCHES) {
        setSelectedRefType(type)
        navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${REFS_BRANCH_PREFIX + branchTagName.name}`)
      } else if (type === BranchSelectorTab.TAGS) {
        setSelectedRefType(type)
        navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${REFS_TAGS_PREFIX + branchTagName.name}`)
      }
    },
    [navigate, repoId, spaceId]
  )

  const navigateToNewFile = useCallback(() => {
    if (fullResourcePath) {
      getContent({
        path: fullResourcePath || '',
        repo_ref: repoRef,
        queryParams: {
          include_commit: true,
          git_ref: normalizeGitRef(prefixedGitRef)
        }
      }).then(response => {
        if (response.body.type === 'dir') {
          navigate(`${routes.toRepoFiles({ spaceId, repoId })}/new/${prefixedGitRef}/~/${fullResourcePath}`)
        } else {
          const parentDirPath = fullResourcePath?.split(FILE_SEPERATOR).slice(0, -1).join(FILE_SEPERATOR)
          navigate(`${routes.toRepoFiles({ spaceId, repoId })}/new/${prefixedGitRef}/~/${parentDirPath}`)
        }
      })
    } else {
      navigate(`${routes.toRepoFiles({ spaceId, repoId })}/new/${prefixedGitRef}/~/`)
    }
  }, [fullResourcePath, prefixedGitRef, navigate, repoId, repoRef])

  const navigateToFile = useCallback(
    (filePath: string) => {
      navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${prefixedGitRef}/~/${filePath}`)
    },
    [prefixedGitRef, navigate, repoId]
  )

  // TODO: repoId and spaceId must be defined
  if (!repoId) return <></>

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: 'auto 1px 1fr' }}>
        {!repository?.is_empty && (
          <RepoSidebarView
            navigateToNewFile={navigateToNewFile}
            navigateToFile={navigateToFile}
            filesList={filesList}
            branchSelectorRenderer={
              <BranchSelectorContainer
                onSelectBranchorTag={selectBranchOrTag}
                selectedBranch={{ name: effectiveGitRefName, sha: repoDetails?.body?.latest_commit?.sha || '' }}
                preSelectedTab={selectedRefType}
                isFilesPage
                setCreateBranchDialogOpen={setCreateBranchDialogOpen}
                onBranchQueryChange={setBranchQueryForNewBranch}
              />
            }
          >
            {!!repoDetails?.body?.content?.entries?.length && (
              <Explorer repoDetails={repoDetails?.body} selectedBranch={prefixedGitRef} />
            )}
          </RepoSidebarView>
        )}

        <Outlet />
      </div>
      <CreateBranchDialog
        open={isCreateBranchDialogOpen}
        onClose={() => setCreateBranchDialogOpen(false)}
        onSuccess={() => {
          setCreateBranchDialogOpen(false)
          navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${branchQueryForNewBranch}`)
        }}
        onBranchQueryChange={setBranchQueryForNewBranch}
        preselectedBranchOrTag={prefixedGitRef ? { name: effectiveGitRefName, sha: '' } : null}
        preselectedTab={selectedRefType}
        prefilledName={branchQueryForNewBranch}
      />
    </>
  )
}
