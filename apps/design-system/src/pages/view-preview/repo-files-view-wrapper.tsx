import { FC, PropsWithChildren, useCallback } from 'react'

import { FileExplorer } from '@harnessio/ui/components'
import { BranchSelectorTab, IBranchSelectorStore, RepoSidebar as RepoSidebarView } from '@harnessio/ui/views'

import { noop, useTranslationsStore } from '../../utils.ts'
import { OpenapiContentInfo, repoFilesStore } from '../../views/repo-files/components/repo-files-store.ts'

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
      selectedBranchType: BranchSelectorTab.BRANCHES,
      setSelectedBranchTag: noop,
      setSelectedBranchType: noop,
      xNextPage: 0,
      xPrevPage: 0,
      page: 1,
      setPage: noop,
      defaultBranch: '',
      branchDivergence: [],
      branchList: []
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
    <>
      <RepoSidebarView
        hasHeader
        hasSubHeader
        selectBranchOrTag={noop}
        useRepoBranchesStore={useRepoBranchesStore}
        useTranslationStore={useTranslationsStore}
        navigateToNewFile={noop}
        navigateToFile={noop}
        filesList={repoFilesStore.filesList}
      >
        <FileExplorer.Root onValueChange={noop} value={[]}>
          {renderEntries(repoFilesStore.filesTreeData, '')}
        </FileExplorer.Root>
      </RepoSidebarView>
      {children}
    </>
  )
}
