import { noop } from '@utils/viewUtils'

import { ColorsEnum, PullRequestListStore } from '@harnessio/ui/views'

export const pullRequestListStore: PullRequestListStore = {
  pullRequests: [
    {
      is_draft: false,
      merged: null,
      name: 'feat:  create skeleton',
      number: 34,
      sha: '1231',
      author: 'Administrator',
      reviewRequired: true,
      sourceBranch: 'changes',
      targetBranch: 'main',
      timestamp: 'Nov 14, 2024',
      state: 'open',
      updated: 1731605604491,
      labels: [
        {
          color: ColorsEnum.CYAN,
          key: 'label-1',
          value: 'value-1',
          scope: 0
        },
        {
          color: ColorsEnum.RED,
          key: 'label-2',
          value: 'value-2',
          scope: 1
        }
      ]
    }
  ],
  totalItems: 10,
  pageSize: 10,
  page: 1,
  openPullReqs: 1,
  closedPullReqs: 0,
  mergedPullReqs: 0,
  setPage: noop,
  setPageSize: noop,
  setLabelsQuery: noop,
  prState: ['open'],
  setPrState: noop
}
