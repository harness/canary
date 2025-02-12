import { noop } from 'lodash-es'

import { BranchSelectorTab, ColorsEnum, IBranchSelectorStore } from '@harnessio/ui/views'

export const repoBranchesStoreMock: IBranchSelectorStore = {
  setBranchList: noop,
  setDefaultBranch: noop,
  setPage: noop,
  setPaginationFromHeaders: noop,
  setSelectedBranchTag: noop,
  setSelectedRefType: noop,
  setSpaceIdAndRepoId: noop,
  setTagList: noop,
  defaultBranch: 'main',
  spaceId: 'default',
  repoId: 'canary',
  tagList: [
    {
      name: '',
      sha: ''
    }
  ],
  branchList: [
    {
      id: 0,
      name: 'main',
      sha: '1234567890123456789012345678901234567890',
      timestamp: 'Jan 1, 2025',
      default: true,
      user: {
        name: 'HarnessUser',
        avatarUrl: ''
      },
      behindAhead: {
        behind: 0,
        ahead: 0,
        default: true
      },
      checks: {
        done: 2,
        total: 2,
        status: {
          failure: 0,
          error: 0,
          pending: 0,
          running: 0,
          success: 2
        }
      }
    },
    {
      id: 1,
      name: 'feature-1',
      sha: '2234567890123456789012345678901234567890',
      timestamp: 'Jan 2, 2025',
      default: false,
      user: {
        name: 'HarnessUser',
        avatarUrl: ''
      },
      behindAhead: {
        behind: 0,
        ahead: 0,
        default: true
      },
      checks: {
        done: 2,
        total: 2,
        status: {
          failure: 0,
          error: 0,
          pending: 0,
          running: 0,
          success: 2
        }
      }
    },
    {
      id: 2,
      name: 'feature-2',
      sha: '3234567890123456789012345678901234567890',
      timestamp: 'Jan 2, 2025',
      default: false,
      user: {
        name: 'HarnessUser',
        avatarUrl: ''
      },
      behindAhead: {
        behind: 0,
        ahead: 0,
        default: true
      },
      checks: {
        done: 2,
        total: 2,
        status: {
          failure: 0,
          error: 0,
          pending: 0,
          running: 0,
          success: 2
        }
      }
    }
  ],
  selectedRefType: BranchSelectorTab.BRANCHES,
  selectedBranchTag: {
    name: '',
    sha: ''
  },
  xNextPage: 2,
  xPrevPage: 0,
  page: 1
}
