import { noop } from '../../utils'

export const pullRequestListStore = {
  pullRequests: [
    {
      author: 'Administrator',
      name: 'feat:  create skeleton',
      reviewRequired: true,
      merged: null,
      number: 34,
      is_draft: false,
      timestamp: 'Nov 14, 2024',
      updated: 1731605604491,
      source_branch: 'changes',
      state: 'open'
    }
  ],
  totalPages: 1,
  page: 1,
  openPullReqs: 1,
  closedPullReqs: 0,
  setPage: noop,
  setSearchQuery: null
}
