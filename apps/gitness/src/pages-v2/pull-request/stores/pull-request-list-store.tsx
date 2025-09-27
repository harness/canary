import { create } from 'zustand'

import { RepoRepositoryOutput, TypesPullReq } from '@harnessio/code-service-client'
import { ColorsEnum, PRState, PullRequest } from '@harnessio/ui/views'

import { PageResponseHeader } from '../../../types'

type PullRequestInterface = TypesPullReq & {
  repo?: Pick<RepoRepositoryOutput, 'identifier' | 'path'>
}

interface PullRequestListStore {
  pullRequests: PullRequest[] | null
  labelsQuery: string
  totalItems: number
  pageSize: number
  openPullReqs: number
  mergedPullReqs: number
  closedPullReqs: number
  page: number
  prState: Array<PRState>
  setPrState: (prState: Array<PRState>) => void
  setPage: (page: number) => void
  setLabelsQuery: (query: string) => void
  setPullRequests: (data: PullRequestInterface[], headers?: Headers) => void
  setOpenClosePullRequests: (openPullReqs: number, closedPullReqs: number, mergedPullReqs: number) => void
}

export const usePullRequestListStore = create<PullRequestListStore>(set => ({
  pullRequests: null,
  totalItems: 0,
  pageSize: 30,
  page: 1,
  prState: ['open'],
  openPullReqs: 0,
  closedPullReqs: 0,
  mergedPullReqs: 0,
  labels: [],
  labelsQuery: '',
  setPage: page => set({ page }),

  setPrState: (prState: Array<PRState>) => set({ prState }),

  setPullRequests: (data, headers) => {
    const getDisplayTimestamp = (item: PullRequestInterface): string => {
      let validTimestamp = 0
      if (item.state === 'open') validTimestamp = item?.created ?? 0
      else if (item.state === 'closed') validTimestamp = item?.closed ?? 0
      else if (item.state === 'merged') validTimestamp = item?.merged ?? 0

      return validTimestamp ? new Date(validTimestamp).toISOString() : ''
    }

    const transformedPullRequests: PullRequest[] = data.map(item => ({
      repo: { identifier: item.repo?.identifier || '', path: item.repo?.path || '' },
      is_draft: item?.is_draft,
      merged: item?.merged,
      name: item?.title,
      number: item?.number,
      sha: item?.merge_base_sha,
      author: item?.author?.display_name,
      // TODO: fix review required when its actually there
      reviewRequired: !item?.is_draft,
      sourceBranch: item?.source_branch,
      targetBranch: item?.target_branch,
      timestamp: getDisplayTimestamp(item),
      comments: item?.stats?.conversations,
      state: item?.state,
      updated: item?.updated ?? 0,
      labels:
        item?.labels?.map(label => ({
          key: label?.key || '',
          value: label?.value || undefined,
          color: (label?.value_color || label?.color) as ColorsEnum,
          id: label?.id,
          scope: label?.scope || 0
        })) || []
    }))

    set({
      pullRequests: transformedPullRequests,
      totalItems: parseInt(headers?.get(PageResponseHeader.xTotal) || '0'),
      pageSize: parseInt(headers?.get(PageResponseHeader.xPerPage) || '30')
    })
  },
  setOpenClosePullRequests: (openPullReqs, closedPullReqs, mergedPullReqs) => {
    set({
      openPullReqs,
      closedPullReqs,
      mergedPullReqs
    })
  },

  setLabelsQuery: (query: string) => set({ labelsQuery: query })
}))
