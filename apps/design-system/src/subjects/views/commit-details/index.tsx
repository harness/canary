import { useCallback } from 'react'

import { useTranslationStore } from '@utils/viewUtils'

import { ICommitDetailsStore, RepoCommitDetailsView } from '@harnessio/ui/views'

import { commitDetailsStore } from './commit-details-store'

export const CommitDetailsView = () => {
  const useCommitDetailsStore = useCallback((): ICommitDetailsStore => commitDetailsStore, [])

  return (
    <RepoCommitDetailsView useCommitDetailsStore={useCommitDetailsStore} useTranslationStore={useTranslationStore} />
  )
}
