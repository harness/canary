import { FC, useCallback, useMemo } from 'react'

import repoSummaryProps from '@subjects/views/repo-summary/repo-summary-props.json'
import { noop, useTranslationStore } from '@utils/viewUtils'

import { BranchSelectorTab, IBranchSelectorStore, RepoSummaryView, RepoSummaryViewProps } from '@harnessio/ui/views'

export const RepoEmpty: FC<Partial<RepoSummaryViewProps>> = props => {
  const repoEntryPathToFileTypeMap = useMemo<RepoSummaryViewProps['repoEntryPathToFileTypeMap']>(() => {
    return new Map()
  }, [])

  const useRepoBranchesStore = useCallback(
    (): IBranchSelectorStore => ({
      ...repoSummaryProps,
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
    <RepoSummaryView
      {...repoSummaryProps}
      repoEntryPathToFileTypeMap={repoEntryPathToFileTypeMap}
      saveDescription={noop}
      handleCreateToken={noop}
      navigateToFile={noop}
      useTranslationStore={useTranslationStore}
      useRepoBranchesStore={useRepoBranchesStore}
      gitRef=""
      updateRepoError=""
      isEditDialogOpen={false}
      setEditDialogOpen={noop}
      selectBranchOrTag={noop}
      searchQuery=""
      setSearchQuery={noop}
      {...props}
    />
  )
}
