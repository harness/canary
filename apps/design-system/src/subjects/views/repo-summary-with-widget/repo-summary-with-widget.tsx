import { FC, useCallback, useMemo } from 'react'

import { useTranslationsStore } from '@utils/viewUtils'

import { Widget } from '@harnessio/ui/components'
import { BranchSelectorTab, IBranchSelectorStore, RepoSummaryView, RepoSummaryViewProps } from '@harnessio/ui/views'

import repoSummaryProps from './repo-summary-with-widget-props.json'

const noop = () => void 0

const RepoSummaryViewWithWidgetWrapper: FC<Partial<RepoSummaryViewProps>> = props => {
  const repoEntryPathToFileTypeMap = useMemo<RepoSummaryViewProps['repoEntryPathToFileTypeMap']>(() => {
    return new Map(repoSummaryProps.repoEntryPathToFileTypeMap as [string, string][])
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
      renderSidebarComponent={
        <>
          <Widget.Separator className="mt-6" />
          <Widget.SecurityWidget />
        </>
      }
      repoEntryPathToFileTypeMap={repoEntryPathToFileTypeMap}
      saveDescription={noop}
      handleCreateToken={noop}
      navigateToFile={noop}
      useTranslationStore={useTranslationsStore}
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

export default RepoSummaryViewWithWidgetWrapper
