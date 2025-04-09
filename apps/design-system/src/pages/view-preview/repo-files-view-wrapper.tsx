import { FC, HTMLAttributes, PropsWithChildren, useCallback } from 'react'

import { repoFilesStore } from '@subjects/views/repo-files/components/repo-files-store'
import { renderEntries } from '@utils/fileViewUtils'
import { noop, useTranslationStore } from '@utils/viewUtils'

import { FileExplorer } from '@harnessio/ui/components'
import { BranchSelectorTab, IBranchSelectorStore, RepoSidebar as RepoSidebarView } from '@harnessio/ui/views'

export const RepoFilesViewWrapper: FC<PropsWithChildren<HTMLAttributes<HTMLElement>>> = ({ children }) => {
  const useRepoBranchesStore = useCallback(
    (): IBranchSelectorStore => ({
      ...repoFilesStore.branchSelectorStore,
      selectedRefType: BranchSelectorTab.BRANCHES,
      setSelectedBranchTag: noop,
      setSelectedRefType: noop,
      xNextPage: 0,
      xPrevPage: 0,
      page: 1,
      setPage: noop,
      defaultBranch: '',
      branchList: [],
      setTagList: noop,
      setSpaceIdAndRepoId: noop,
      setBranchList: noop,
      setDefaultBranch: noop,
      setPaginationFromHeaders: noop
    }),
    []
  )

  return (
    <div className="grid" style={{ gridTemplateColumns: 'auto 1px 1fr' }}>
      <RepoSidebarView
        selectBranchOrTag={noop}
        useRepoBranchesStore={useRepoBranchesStore}
        useTranslationStore={useTranslationStore}
        navigateToNewFile={noop}
        navigateToFile={noop}
        filesList={repoFilesStore.filesList}
        searchQuery=""
        setSearchQuery={noop}
      >
        <FileExplorer.Root onValueChange={noop} value={[]}>
          {renderEntries(repoFilesStore.filesTreeData, '')}
        </FileExplorer.Root>
      </RepoSidebarView>
      <div className="min-h-[calc(100vh-var(--cn-page-nav-height))]">{children}</div>
    </div>
  )
}
