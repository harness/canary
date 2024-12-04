import { FC, useMemo } from 'react'

import { RepoSummaryView, RepoSummaryViewProps } from '@harnessio/ui/views'

import { useTranslationsStore } from '../../utils.ts'
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
      saveDescription={noop}
      setIsEditingDescription={noop}
      handleCreateToken={noop}
      navigateToFile={noop}
      selectBranch={noop}
      useTranslationStore={useTranslationsStore}
      {...props}
    />
  )
}

export default RepoSummaryViewWrapper
