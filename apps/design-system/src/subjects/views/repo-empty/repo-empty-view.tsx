import { FC, useMemo } from 'react'

import repoSummaryProps from '@subjects/views/repo-summary/repo-summary-props.json'
import { noop, useTranslationStore } from '@utils/viewUtils'

import { BranchSelectorV2, RepoSummaryView, RepoSummaryViewProps } from '@harnessio/ui/views'

export const RepoEmpty: FC<Partial<RepoSummaryViewProps>> = props => {
  const repoEntryPathToFileTypeMap = useMemo<RepoSummaryViewProps['repoEntryPathToFileTypeMap']>(() => {
    return new Map()
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
      isRepoEmpty={true}
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
