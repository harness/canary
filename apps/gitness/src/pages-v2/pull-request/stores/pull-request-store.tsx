import { create } from 'zustand'

import { ListPullReqOkResponse } from '@harnessio/code-service-client'

import { timeAgoFromEpochTime } from '../../../pages/pipeline-edit/utils/time-utils'
import { PageResponseHeader } from '../../../types'

interface PullRequestType {
  is_draft?: boolean
  merged?: number | null // TODO: Should merged really be all these??
  name?: string
  number?: number
  sha?: string
  author?: string
  reviewRequired: boolean
  tasks?: number
  source_branch?: string
  timestamp: string
  comments?: number
  state?: string
  labels?: {
    text: string
    color: string
  }[]
}
interface PullRequestStore {
  pullRequests: PullRequestType[] | null
  totalPages: number
  setPullRequests: (data: ListPullReqOkResponse, headers?: Headers) => void
  page: number
  setPage: (page: number) => void
}

export const usePullRequestStore = create<PullRequestStore>(set => ({
  pullRequests: null,
  totalPages: 0,
  page: 1,
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
      source_branch: item?.source_branch,
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
  }
}))
