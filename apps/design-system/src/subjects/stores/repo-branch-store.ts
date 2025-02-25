import { noop } from '@utils/viewUtils.ts'

import { BranchSelectorTab, IBranchSelectorStore } from '@harnessio/ui/views'

export const repoBranchListStore = {
  selectedBranchTag: { name: 'main', sha: '1d0e5a9461b340ebb3d7e092a2d35ff6d0d5c952', default: true },
  selectedRefType: 'branches' as BranchSelectorTab,
  tagList: [
    {
      name: 'canary',
      sha: '1d0e5a9461b340ebb3d7e092a2d35ff6d0d5c952',
      default: true
    }
  ],
  branchList: [
    {
      id: 1,
      name: 'canary',
      sha: '1d0e5a9461b340ebb3d7e092a2d35ff6d0d5c952',
      timestamp: 'Dec 6, 2024',
      default: true,
      user: {
        name: 'canary',
        avatarUrl: ''
      },
      behindAhead: {
        behind: 0,
        ahead: 0,

        default: true
      }
    }
  ],
  spaceId: 'canary',
  repoId: 'canary',
  defaultBranch: 'main',
  xNextPage: 1,
  xPrevPage: 1,
  totalPages: 1,
  isRepoStillImporting: false,
  page: 1,
  setSelectedBranchTag: noop,
  setSelectedRefType: noop,
  setTagList: noop,
  setSpaceIdAndRepoId: noop,
  setBranchList: noop,
  setDefaultBranch: noop,
  setPage: noop,
  setPaginationFromHeaders: noop
} as IBranchSelectorStore
