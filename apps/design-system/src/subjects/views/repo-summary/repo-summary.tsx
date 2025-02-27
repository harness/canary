import { FC, useMemo } from 'react'

import { useTranslationStore } from '@utils/viewUtils'

import { BranchSelectorV2, RepoSummaryView, RepoSummaryViewProps } from '@harnessio/ui/views'

import repoSummaryProps from './repo-summary-props.json'

const noop = () => void 0

const RepoSummaryViewWrapper: FC<Partial<RepoSummaryViewProps>> = props => {
  const repoEntryPathToFileTypeMap = useMemo<RepoSummaryViewProps['repoEntryPathToFileTypeMap']>(() => {
    return new Map(repoSummaryProps.repoEntryPathToFileTypeMap as [string, string][])
  }, [])

  return (
    <RepoSummaryView
      {...repoSummaryProps}
      repoEntryPathToFileTypeMap={repoEntryPathToFileTypeMap}
      selectedBranchOrTag={{ name: 'main', sha: '' }}
      saveDescription={noop}
      handleCreateToken={noop}
      navigateToFile={noop}
      useTranslationStore={useTranslationStore}
      gitRef=""
      updateRepoError=""
      isEditDialogOpen={false}
      setEditDialogOpen={noop}
      searchQuery=""
      setSearchQuery={noop}
      branchSelectorRenderer={
        <BranchSelectorV2
          repoId="canary"
          spaceId="org"
          branchList={[]}
          tagList={[]}
          selectedBranchorTag={{ name: 'main', sha: 'sha' }}
          onSelectBranch={noop}
          isBranchOnly={false}
          dynamicWidth={false}
          useTranslationStore={useTranslationStore}
          setSearchQuery={noop}
        />
      }
      {...props}
    />
  )
}

export default RepoSummaryViewWrapper
