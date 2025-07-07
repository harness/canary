import { FC, PropsWithChildren, useCallback } from 'react'

import { noop } from '@utils/viewUtils'

import { PullRequestCommitsView } from '@harnessio/ui/views'

import { repoCommitStore } from '../pull-request-compare/repo-commit-store'

const PullRequestCommits: FC<PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = () => {
  const useRepoCommitsListStore = useCallback(
    () => ({
      ...repoCommitStore,
      commitsList: repoCommitStore.commits,
      setPage: noop,
      isFetchingCommits: false,
      xNextPage: 0,
      xPrevPage: 0,
      setIsFetchingCommits: noop,
      setCommitList: noop
    }),

    []
  )
  return <PullRequestCommitsView usePullRequestCommitsStore={useRepoCommitsListStore} />
}

export default PullRequestCommits
