import { create } from 'zustand'

import { ListPullReqCommitsOkResponse, TypesCommit } from '@harnessio/code-service-client'

interface PullRequestCommitsStore {
  // state

  commitsList?: TypesCommit[]
  isFetchingCommits: boolean

  // actions
  setIsFetchingCommits: (loading: boolean) => void
  setCommitList: (data: ListPullReqCommitsOkResponse) => void
}

export const usePullRequestCommitsStore = create<PullRequestCommitsStore>(set => ({
  commitsList: [],
  isFetchingCommits: false,
  setCommitList: data => {
    set({ commitsList: data })
  },
  setIsFetchingCommits: loading => set({ isFetchingCommits: loading })
}))
