import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import {
  getContent,
  useGetBranchQuery,
  useGetContentQuery,
  useListBranchesQuery,
  useListPathsQuery,
  useListTagsQuery
} from '@harnessio/code-service-client'
import { BranchSelectorListItem, BranchSelectorTab, RepoSidebar as RepoSidebarView } from '@harnessio/ui/views'

import { BranchSelectorContainer } from '../../components-v2/branch-selector-container'
import { CreateBranchDialog } from '../../components-v2/create-branch-dialog'
import Explorer from '../../components-v2/FileExplorer'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useGitRef } from '../../hooks/useGitRef'
import { PathParams } from '../../RouteDefinitions'
import { FILE_SEPERATOR, normalizeGitRef, REFS_BRANCH_PREFIX, REFS_TAGS_PREFIX } from '../../utils/git-utils'
import { transformBranchList } from './transform-utils/branch-transform'

const SIDEBAR_MIN_WIDTH = 210
const SIDEBAR_MAX_WIDTH = 700

/**
 * TODO: This code was migrated from V2 and needs to be refactored.
 */
export const RepoSidebar = () => {
  const routes = useRoutes()

  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()
  const navigate = useNavigate()
  const [isCreateBranchDialogOpen, setCreateBranchDialogOpen] = useState(false)
  const [branchQueryForNewBranch, setBranchQueryForNewBranch] = useState<string>('')
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_MIN_WIDTH)

  const {
    fullGitRef,
    gitRefName,
    repoData,
    fullResourcePath,
    preSelectedTab,
    setPreSelectedTab,
    prefixedDefaultBranch,
    fullGitRefWoDefault
  } = useGitRef()

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

  // Navigate to default branch if no branch is selected
  useEffect(() => {
    if (!fullGitRefWoDefault && prefixedDefaultBranch && fullGitRef) {
      navigate(routes.toRepoFiles({ spaceId, repoId, '*': fullGitRef }))
    }
  }, [fullGitRefWoDefault, prefixedDefaultBranch, fullGitRef])

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
    () => (branches ? transformBranchList(branches, repoData?.default_branch) : []),
    [branches, repoData?.default_branch]
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
    if (!repoData?.default_branch || !transformedBranchList.length) {
      return
    }
    if (!fullGitRef) {
      const defaultBranch = transformedBranchList.find(branch => branch.name === repoData.default_branch)
      const defaultBranchName = defaultBranch?.name || repoData?.default_branch
      if (defaultBranchName) {
        navigate(routes.toRepoFiles({ spaceId, repoId, '*': defaultBranchName }))
      }
    } else {
      const selectedGitRefTag = transformedTags.find(tag => tag.name === gitRefName)
      if (selectedGitRefBranch) {
        setPreSelectedTab(BranchSelectorTab.BRANCHES)
      } else if (selectedGitRefTag) {
        setPreSelectedTab(BranchSelectorTab.TAGS)
      } else {
        setPreSelectedTab(BranchSelectorTab.BRANCHES)
      }
    }
  }, [repoData?.default_branch, fullGitRef, transformedBranchList, transformedTags, gitRefName, selectedGitRefBranch])

  const { data: repoDetails } = useGetContentQuery({
    path: '',
    repo_ref: repoRef,
    queryParams: {
      include_commit: true,
      git_ref: normalizeGitRef(fullGitRef)
    }
  })

  const { data: filesData } = useListPathsQuery({
    repo_ref: repoRef,
    queryParams: { git_ref: normalizeGitRef(fullGitRef) }
  })

  const filesList = filesData?.body?.files || []

  const selectBranchOrTag = useCallback(
    (branchTagName: BranchSelectorListItem, type: BranchSelectorTab) => {
      if (type === BranchSelectorTab.BRANCHES) {
        setPreSelectedTab(type)
        navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${REFS_BRANCH_PREFIX + branchTagName.name}`)
      } else if (type === BranchSelectorTab.TAGS) {
        setPreSelectedTab(type)
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
          git_ref: normalizeGitRef(fullGitRef)
        }
      }).then(response => {
        if (response.body.type === 'dir') {
          navigate(routes.toRepoFiles({ spaceId, repoId, '*': `new/${fullGitRef}/~/${fullResourcePath}` }))
        } else {
          const parentDirPath = fullResourcePath?.split(FILE_SEPERATOR).slice(0, -1).join(FILE_SEPERATOR)
          navigate(routes.toRepoFiles({ spaceId, repoId, '*': `new/${fullGitRef}/~/${parentDirPath}` }))
        }
      })
    } else {
      navigate(routes.toRepoFiles({ spaceId, repoId, '*': `new/${fullGitRef}/~/` }))
    }
  }, [fullResourcePath, fullGitRef, navigate, repoId, repoRef])

  const navigateToFile = useCallback(
    (filePath: string) => {
      navigate(routes.toRepoFiles({ spaceId, repoId, '*': `${fullGitRef}/~/${filePath}` }))
    },
    [fullGitRef, navigate, repoId]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const startX = e.clientX
      const startWidth = sidebarWidth

      const handleMouseMove = (e: MouseEvent) => {
        const newWidth = startWidth + (e.clientX - startX)
        setSidebarWidth(Math.max(SIDEBAR_MIN_WIDTH, Math.min(SIDEBAR_MAX_WIDTH, newWidth)))
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [sidebarWidth]
  )

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 50 : 10 // Larger steps with Shift key

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        setSidebarWidth(prev => Math.max(SIDEBAR_MIN_WIDTH, prev - step))
        break
      case 'ArrowRight':
        e.preventDefault()
        setSidebarWidth(prev => Math.min(SIDEBAR_MAX_WIDTH, prev + step))
        break
      case 'Home':
        e.preventDefault()
        setSidebarWidth(SIDEBAR_MIN_WIDTH) // Minimum width
        break
      case 'End':
        e.preventDefault()
        setSidebarWidth(SIDEBAR_MAX_WIDTH) // Maximum width
        break
    }
  }, [])

  // TODO: repoId and spaceId must be defined
  if (!repoId) return <></>

  return (
    <>
      <div className="flex flex-1">
        <div
          className={`shrink-0 overflow-hidden min-w-[${SIDEBAR_MIN_WIDTH}px] max-w-[${SIDEBAR_MAX_WIDTH}px]`}
          style={{
            width: `${sidebarWidth}px`
          }}
        >
          <RepoSidebarView
            navigateToNewFile={navigateToNewFile}
            navigateToFile={navigateToFile}
            filesList={filesList}
            branchSelectorRenderer={
              <BranchSelectorContainer
                onSelectBranchorTag={selectBranchOrTag}
                selectedBranch={{ name: gitRefName, sha: repoDetails?.body?.latest_commit?.sha || '' }}
                preSelectedTab={preSelectedTab}
                isFilesPage
                setCreateBranchDialogOpen={setCreateBranchDialogOpen}
                onBranchQueryChange={setBranchQueryForNewBranch}
              />
            }
          >
            {!!repoDetails?.body?.content?.entries?.length && (
              <Explorer repoDetails={repoDetails?.body} selectedBranch={fullGitRef} />
            )}
          </RepoSidebarView>
        </div>

        {/* Resizable Divider */}
        <div
          onMouseDown={handleMouseDown}
          onKeyDown={handleKeyDown}
          className="border-cn-borders-2 focus-within:border-cn-borders-1 focus-visible:border-cn-borders-1 w-1 shrink-0 cursor-col-resize select-none border-r transition-colors"
          role="slider"
          aria-valuenow={sidebarWidth}
          aria-valuemax={SIDEBAR_MAX_WIDTH}
          aria-valuemin={SIDEBAR_MIN_WIDTH}
          tabIndex={0}
          aria-label="Resize panel by dragging or using arrow keys (with shift for larger steps)"
        />

        <Outlet />
      </div>
      <CreateBranchDialog
        open={isCreateBranchDialogOpen}
        onClose={() => setCreateBranchDialogOpen(false)}
        onSuccess={() => {
          setCreateBranchDialogOpen(false)
          navigate(routes.toRepoFiles({ spaceId, repoId, '*': branchQueryForNewBranch }))
        }}
        onBranchQueryChange={setBranchQueryForNewBranch}
        preselectedBranchOrTag={fullGitRef ? { name: gitRefName, sha: '' } : null}
        preselectedTab={preSelectedTab}
        prefilledName={branchQueryForNewBranch}
      />
    </>
  )
}
