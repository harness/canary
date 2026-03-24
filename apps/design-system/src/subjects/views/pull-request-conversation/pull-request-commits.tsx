import { FC, PropsWithChildren, useCallback } from 'react'

import { noop } from '@utils/viewUtils'

import { PullRequestCommitsView } from '@harnessio/views'

import { repoCommitStore } from '../pull-request-compare/repo-commit-store'

const PullRequestCommits: FC<PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = () => {
  const useRepoCommitsListStore = useCallback(
    () => ({
      ...repoCommitStore,
      commitsList: repoCommitStore.commits,
      isFetchingCommits: false,
      setIsFetchingCommits: noop,
      setCommitList: noop
    }),

    []
  )
  return <PullRequestCommitsView usePullRequestCommitsStore={useRepoCommitsListStore} />
}

export default PullRequestCommits
