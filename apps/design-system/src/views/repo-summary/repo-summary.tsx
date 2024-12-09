import { FC, useCallback, useMemo } from 'react'

import { BranchSelectorTab, IBranchSelectorStore, RepoSummaryView, RepoSummaryViewProps } from '@harnessio/ui/views'

import { useTranslationsStore } from '../../utils.ts'
import repoSummaryProps from './repo-summary-props.json'

const noop = () => void 0

const RepoSummaryViewWrapper: FC<Partial<RepoSummaryViewProps>> = props => {
  const repoEntryPathToFileTypeMap = useMemo<RepoSummaryViewProps['repoEntryPathToFileTypeMap']>(() => {
    return new Map(repoSummaryProps.repoEntryPathToFileTypeMap as [string, string][])
  }, [])

  const useRepoBranchesStore = useCallback(
    (): IBranchSelectorStore => ({
      ...repoSummaryProps,
      selectedBranchType: BranchSelectorTab.BRANCHES,
      setBranchList: noop,
      setSelectedBranchTag: noop,
      setSelectedBranchType: noop,
      setTagList: noop,
      setSpaceIdAndRepoId: noop
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
      useTranslationStore={useTranslationsStore}
      useRepoBranchesStore={useRepoBranchesStore}
      gitRef={''}
      updateRepoError={''}
      isEditDialogOpen={false}
      setEditDialogOpen={noop}
      {...props}
    />
  )
}

export default RepoSummaryViewWrapper
