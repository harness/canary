import { FC, PropsWithChildren, useCallback } from 'react'

import { OpenapiContentInfo, repoFilesStore } from '@subjects/views/repo-files/components/repo-files-store'
import { noop, useTranslationsStore } from '@utils/viewUtils'

import { FileExplorer } from '@harnessio/ui/components'
import { BranchSelectorTab, IBranchSelectorStore, RepoSidebar as RepoSidebarView } from '@harnessio/ui/views'

const sortEntriesByType = (entries: OpenapiContentInfo[]): OpenapiContentInfo[] => {
  return entries.sort((a, b) => {
    if (a.type === 'dir' && b.type === 'file') {
      return -1
    } else if (a.type === 'file' && b.type === 'dir') {
      return 1
    }
    return 0
  })
}

export const RepoFilesViewWrapper: FC<PropsWithChildren> = ({ children }) => {
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

  const renderEntries = (entries: OpenapiContentInfo[], parentPath: string = '') => {
    const sortedEntries = sortEntriesByType(entries)
    return sortedEntries.map((item, idx) => {
      const itemPath = parentPath ? `${parentPath}/${item.name}` : item.name
      const fullPath = ''

      if (item.type === 'file') {
        return (
          <FileExplorer.FileItem key={itemPath || idx.toString()} isActive={false} link={undefined}>
            {item.name}
          </FileExplorer.FileItem>
        )
      } else {
        return (
          <FileExplorer.FolderItem key={itemPath || idx.toString()} value={itemPath} link={fullPath} isActive={false}>
            {item.name}
          </FileExplorer.FolderItem>
        )
      }
    })
  }

  return (
    <div className="grid grid-cols-[auto_1fr]">
      <RepoSidebarView
        selectBranchOrTag={noop}
        useRepoBranchesStore={useRepoBranchesStore}
        useTranslationStore={useTranslationsStore}
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
      {/* 100vh = screen height - (55px Breadcrumbs Height + 45px SubHeader Height = 100px) */}
      {/* Total height of both the divs should be 100vh */}
      <div className="min-h-[calc(100vh-100px)]">{children}</div>
    </div>
  )
}
