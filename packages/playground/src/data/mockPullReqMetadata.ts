import { EnumPrincipalType, EnumPullReqState } from '../interfaces'

export const mockPullReqMetadata = {
  number: 5,
  created: 1723594951898,
  edited: 1723594951898,
  state: 'open' as EnumPullReqState,
  is_draft: false,
  title: 'prwithnoConflicts.txt',
  description: '',
  source_repo_id: 24,
  source_branch: 'noConflicts',
  source_sha: '048f7030a246c1935e1ae836f3a8e112f9e1bc2a',
  target_repo_id: 24,
  target_branch: 'main',
  merged: null,
  merge_method: undefined,
  merge_check_status: 'mergeable',
  merge_target_sha: '3ecbdea21a7d5f20e9a2e4136b93179743c15add',
  merge_base_sha: '3ecbdea21a7d5f20e9a2e4136b93179743c15add',
  author: {
    id: 3,
    uid: 'admin',
    display_name: 'Administrator',
    email: 'admin@gitness.io',
    type: 'user' as EnumPrincipalType,
    created: 1699863416002,
    updated: 1699863416002
  },
  merger: undefined,
  stats: {
    commits: 1,
    files_changed: 1,
    additions: 1,
    deletions: 0
  }
}
