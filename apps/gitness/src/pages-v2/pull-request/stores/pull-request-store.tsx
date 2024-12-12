import { create } from 'zustand'

import { TypesPullReq, UsererrorError } from '@harnessio/code-service-client'

interface IPullRequestStore {
  pullRequest?: TypesPullReq | null
  pullReqError?: UsererrorError | null
  pullReqLoading: boolean
  refetchPullReq: () => void

  setPullRequest: (metadata: TypesPullReq | undefined) => void
  setPullReqError: (error: UsererrorError | null) => void
  setPullReqLoading: (loading: boolean) => void
  setRefetchPullReq: (refetch: () => void) => void
}

export const usePullRequestStore = create<IPullRequestStore>(set => ({
  pullRequest: null,
  pullReqError: null,
  pullReqLoading: false,
  refetchPullReq: () => {},

  setPullRequest: data => {
    set({
      pullRequest: data
    })
  },
  setPullReqError: error => {
    set({
      pullReqError: error
    })
  },
  setPullReqLoading: loading => {
    set({
      pullReqLoading: loading
    })
  },
  setRefetchPullReq: refetch => {
    set({
      refetchPullReq: refetch
    })
  }
}))
