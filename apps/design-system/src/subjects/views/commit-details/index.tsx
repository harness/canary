import { useCallback } from 'react'

import { ICommitDetailsStore, RepoCommitDetailsView } from '@harnessio/views'

import { commitDetailsStore } from './commit-details-store'

export const CommitDetailsView = () => {
  const useCommitDetailsStore = useCallback((): ICommitDetailsStore => commitDetailsStore, [])

  return <RepoCommitDetailsView useCommitDetailsStore={useCommitDetailsStore} />
}
