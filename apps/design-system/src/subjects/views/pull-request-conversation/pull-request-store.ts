import { noop } from '@utils/viewUtils.ts'

import { EnumPrincipalType } from '@harnessio/ui/types'
import { EnumPullReqState } from '@harnessio/ui/views'

export const pullRequestStore = {
  pullRequest: {
    number: 1,
    created: 1737044851123,
    updated: 1737045007201,
    edited: 1737045007201,
    state: 'open' as EnumPullReqState,
    is_draft: false,
    title: 'Create initial design system preview',
    description: '',
    source_repo_id: 44,
    source_branch: 'new',
    source_sha: 'c59260ea5656e3e831b2d06a6524ad03c9f1ca9a',
    target_repo_id: 44,
    target_branch: 'main',
    merged: null,
    merge_target_sha: 'c2769294883f8a86ec70bfc5dad6b6d315951634',
    merge_base_sha: '0e5ec7a99e6a6d6dfc2781bd6834c0581f3361ca',
    merge_check_status: 'mergeable',
    rebase_check_status: 'unchecked',
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    stats: {
      commits: 2,
      files_changed: 2,
      additions: 2,
      deletions: 0,
      conversations: 3,
      unresolved_count: 3
    }
  },
  pullReqError: null,
  pullReqLoading: false,
  refetchPullReq: noop,
  setPullRequest: noop,
  setPullReqError: noop,
  setPullReqLoading: noop,
  setRefetchPullReq: noop
}
