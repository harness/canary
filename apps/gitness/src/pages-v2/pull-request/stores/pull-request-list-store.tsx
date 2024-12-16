import { create } from 'zustand'

import { FindRepositoryOkResponse, ListPullReqOkResponse } from '@harnessio/code-service-client'

import { timeAgoFromEpochTime } from '../../../pages/pipeline-edit/utils/time-utils'
import { PageResponseHeader } from '../../../types'

interface PullRequestListType {
  is_draft?: boolean
  merged?: number | null // TODO: Should merged really be all these??
  name?: string
  number?: number
  sha?: string
  author?: string
  reviewRequired: boolean
  tasks?: number
  sourceBranch?: string
  targetBranch?: string
  timestamp: string
  comments?: number
  state?: string
  updated: number
  labels?: {
    text: string
    color: string
  }[]
}
interface PullRequestListStore {
  pullRequests: PullRequestListType[] | null
  totalPages: number
  openPullReqs: number
  closedPullReqs: number
  page: number
  setPage: (page: number) => void
  setPullRequests: (data: ListPullReqOkResponse, headers?: Headers) => void
  setOpenClosePullRequests: (data: FindRepositoryOkResponse) => void
}

export const usePullRequestListStore = create<PullRequestListStore>(set => ({
  pullRequests: null,
  totalPages: 0,
  page: 1,
  openPullReqs: 0,
  closedPullReqs: 0,
  setPage: page => set({ page }),

  setPullRequests: (data, headers) => {
    const transformedPullRequests = data.map(item => ({
      author: item?.author?.display_name,
      name: item?.title,
      // TODO: fix review required when its actually there
      reviewRequired: !item?.is_draft,
      merged: item?.merged,
      comments: item?.stats?.conversations,
      number: item?.number,
      is_draft: item?.is_draft,
      // TODO: add label information to display associated labels for each pull request
      // labels: item?.labels?.map((key: string, color: string) => ({ text: key, color: color })),
      // TODO: fix 2 hours ago in timestamp
      timestamp: item?.created ? timeAgoFromEpochTime(item?.created) : '',
      updated: item?.updated ? item?.updated : 0,
      sourceBranch: item?.source_branch,
      targetBranch: item?.target_branch,
      state: item?.state,
      labels: item?.labels?.map(label => ({
        text: label?.key && label?.value ? `${label?.key}:${label?.value}` : (label.key ?? ''),
        color: label?.value_color || 'mint'
      }))
    }))

    set({
      pullRequests: transformedPullRequests,
      totalPages: parseInt(headers?.get(PageResponseHeader.xTotalPages) || '0')
    })
  },
  setOpenClosePullRequests: repoMetadata => {
    set({
      openPullReqs: repoMetadata.num_open_pulls || 0,
      closedPullReqs: (repoMetadata?.num_closed_pulls || 0) + (repoMetadata?.num_merged_pulls || 0)
    })
  }
}))
