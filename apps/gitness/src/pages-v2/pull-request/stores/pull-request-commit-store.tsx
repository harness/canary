import { create } from 'zustand'

import { ListPullReqCommitsOkResponse, TypesCommit } from '@harnessio/code-service-client'

import { PageResponseHeader } from '../../../types'

interface PullRequestCommitsStore {
  // state

  commitsList?: TypesCommit[]
  isFetchingCommits: boolean
  xNextPage: number
  xPrevPage: number
  page: number

  // actions
  setIsFetchingCommits: (loading: boolean) => void
  setCommitList: (data: ListPullReqCommitsOkResponse) => void
  setPage: (page: number) => void
  setPaginationFromHeaders: (headers?: Headers) => void
}

export const usePullRequestCommitsStore = create<PullRequestCommitsStore>(set => ({
  commitsList: [],
  isFetchingCommits: false,
  xNextPage: 0,
  xPrevPage: 0,
  page: 1,
  setCommitList: data => {
    set({ commitsList: data })
  },
  setIsFetchingCommits: loading => set({ isFetchingCommits: loading }),
  setPage: page => set({ page }),
  setPaginationFromHeaders: (headers?: Headers) => {
    const xNextPage = parseInt(headers?.get(PageResponseHeader.xNextPage) || '')
    const xPrevPage = parseInt(headers?.get(PageResponseHeader.xPrevPage) || '')

    set({ xNextPage, xPrevPage })
  }
}))
