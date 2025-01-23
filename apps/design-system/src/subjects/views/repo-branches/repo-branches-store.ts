import { noop } from '@utils/viewUtils'

import { BranchSelectorTab, IBranchSelectorStore } from '@harnessio/ui/views'

export const repoBranchesStore: IBranchSelectorStore = {
  setBranchList: noop,
  setDefaultBranch: noop,
  setPage: noop,
  setPaginationFromHeaders: noop,
  setSelectedBranchTag: noop,
  setSelectedRefType: noop,
  setSpaceIdAndRepoId: noop,
  setTagList: noop,
  defaultBranch: 'main',
  spaceId: 'iatopilskii',
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
      name: 'pixelpoint-dev',
      sha: 'b36e5fe5b90cf2b9dc90ce7b6919c28732fa8f29',
      timestamp: 'Nov 22, 2024',
      default: false,
      user: {
        name: 'Alex Zemlyakov',
        avatarUrl: ''
      },
      behindAhead: {
        behind: 172,
        ahead: 12,
        default: false
      },
      checks: {
        done: 3,
        total: 3,
        status: {
          failure: 0,
          error: 0,
          pending: 0,
          running: 0,
          success: 3
        }
      }
    },
    {
      id: 1,
      name: 'main',
      sha: 'b65133014b3090fa088628283aa4b309cc68b8fd',
      timestamp: 'Jan 13, 2025',
      default: true,
      user: {
        name: 'GitHub',
        avatarUrl: ''
      },
      behindAhead: {
        behind: 0,
        ahead: 0,
        default: true
      },
      checks: {
        done: 1,
        total: 2,
        status: {
          failure: 0,
          error: 0,
          pending: 0,
          running: 1,
          success: 1
        }
      }
    },
    {
      id: 2,
      name: 'fix-settings-ui',
      sha: '7a9eb92358e85dbe1d5b59629c35a9202766ac93',
      timestamp: 'Jan 13, 2025',
      default: false,
      user: {
        name: 'Alex Zemlyakov',
        avatarUrl: ''
      },
      behindAhead: {
        behind: 1,
        ahead: 1,
        default: false
      },
      checks: {
        done: 3,
        total: 3,
        status: {
          failure: 2,
          error: 0,
          pending: 0,
          running: 0,
          success: 1
        }
      },
      pullRequests: [
        {
          number: 5,
          updated: 1737045212396,
          state: 'open',
          is_draft: true,
          merged: null,
          timestamp: 'Jan 13, 2025',
          reviewRequired: false
        }
      ]
    },
    {
      id: 3,
      name: 'fix-settings',
      sha: '26e739e520e6253811c3c562a89786f74dcbf2b9',
      timestamp: 'Jan 13, 2025',
      default: false,
      user: {
        name: 'Alex Zemlyakov',
        avatarUrl: ''
      },
      behindAhead: {
        behind: 1,
        ahead: 2,
        default: false
      },
      checks: {
        done: 2,
        total: 3,
        status: {
          failure: 1,
          error: 0,
          pending: 0,
          running: 1,
          success: 1
        }
      }
    },
    {
      id: 4,
      name: 'fix-nav-ui',
      sha: 'da5a61dbed639944e81618e1f61aff7aa63129f1',
      timestamp: 'Nov 25, 2024',
      default: false,
      user: {
        name: 'Alex Zemlyakov',
        avatarUrl: ''
      },
      behindAhead: {
        behind: 167,
        ahead: 2,
        default: false
      },
      checks: {
        done: 1,
        total: 3,
        status: {
          failure: 0,
          error: 0,
          pending: 0,
          running: 2,
          success: 1
        }
      },
      pullRequests: [
        {
          number: 6,
          updated: 1737045218987,
          timestamp: 'Jan 13, 2025',
          reviewRequired: false,
          state: 'open',
          is_draft: false
        }
      ]
    },
    {
      id: 5,
      name: 'fix-layout-shift',
      sha: '37ac1c781fc4cc5985dfd1bc215c14534314e160',
      timestamp: 'Dec 5, 2024',
      default: false,
      user: {
        name: 'Andrew Golovanov',
        avatarUrl: ''
      },
      behindAhead: {
        behind: 122,
        ahead: 1,
        default: false
      },
      checks: {
        done: 1,
        total: 3,
        status: {
          failure: 1,
          error: 0,
          pending: 0,
          running: 2,
          success: 0
        }
      },
      pullRequests: [
        {
          number: 7,
          updated: 1737045224516,
          timestamp: 'Jan 13, 2025',
          reviewRequired: false,
          state: 'open',
          is_draft: false
        }
      ]
    },
    {
      id: 6,
      name: 'fix-layout',
      sha: '23c58e4b58004e5e34e216ae440316fba635c95a',
      timestamp: 'Nov 15, 2024',
      default: false,
      user: {
        name: 'Alex Zemlyakov',
        avatarUrl: ''
      },
      behindAhead: {
        behind: 193,
        ahead: 8,
        default: false
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
      id: 7,
      name: 'feat-upd-summary-page',
      sha: '51edcfd2fc6c77d876eafb8690690bb5fe2039b3',
      timestamp: 'Dec 27, 2024',
      default: false,
      user: {
        name: 'americano98',
        avatarUrl: ''
      },
      behindAhead: {
        behind: 29,
        ahead: 1,
        default: false
      },
      checks: {
        done: 0,
        total: 2,
        status: {
          failure: 0,
          error: 0,
          pending: 0,
          running: 2,
          success: 0
        }
      },
      pullRequests: [
        {
          number: 8,
          timestamp: 'Jan 13, 2025',
          reviewRequired: false,
          updated: 1737045230646,
          state: 'open',
          is_draft: false
        }
      ]
    },
    {
      id: 8,
      name: 'feat-tags-list',
      sha: '4e7163ffe79dc2bfa9c69856d0645639da3e8466',
      timestamp: 'Nov 12, 2024',
      default: false,
      user: {
        name: 'Alex Zemlyakov',
        avatarUrl: ''
      },
      behindAhead: {
        behind: 208,
        ahead: 14,
        default: false
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
      },
      pullRequests: [
        {
          number: 9,
          updated: 1737045235826,
          timestamp: 'Jan 13, 2025',
          reviewRequired: false,
          state: 'open',
          is_draft: true
        }
      ]
    },
    {
      id: 9,
      name: 'feat-signin-signup',
      sha: '7f100798a04fb82d5a1c6c954185c4f8ce5c15e7',
      timestamp: 'Dec 4, 2024',
      default: false,
      user: {
        name: 'Ilya Topilskii',
        avatarUrl: ''
      },
      behindAhead: {
        behind: 134,
        ahead: 4,
        default: false
      },
      checks: {
        done: 1,
        total: 2,
        status: {
          failure: 0,
          error: 1,
          pending: 0,
          running: 1,
          success: 0
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
