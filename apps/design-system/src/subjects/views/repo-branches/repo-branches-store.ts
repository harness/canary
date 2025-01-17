import { noop } from '@utils/viewUtils'

import { IBranchSelectorStore } from '@harnessio/ui/views'

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
          created: 1737045212290,
          updated: 1737045212396,
          edited: 1737045212396,
          state: 'open',
          is_draft: true,
          title: 'fix: fix settings page and rules form',
          description: '',
          source_repo_id: 4,
          source_branch: 'fix-settings-ui',
          source_sha: '7a9eb92358e85dbe1d5b59629c35a9202766ac93',
          target_repo_id: 4,
          target_branch: 'main',
          merged: null,
          merge_method: null,
          merge_target_sha: 'b65133014b3090fa088628283aa4b309cc68b8fd',
          merge_base_sha: 'c300928664cff17732a30b88448be944987e42ed',
          merge_check_status: 'mergeable',
          rebase_check_status: 'unchecked',
          author: {
            id: 4,
            uid: 'iatopilskii',
            display_name: 'iatopilskii',
            email: 'iatopilskii@gmail.com',
            type: 'user',
            created: 1735910767538,
            updated: 1735910767538
          },
          merger: null,
          stats: {
            commits: 1,
            files_changed: 98,
            additions: 1854,
            deletions: 1803
          }
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
          created: 1737045218864,
          updated: 1737045218987,
          edited: 1737045218987,
          state: 'open',
          is_draft: false,
          title: 'fix: fixed scrollbar visibility, removed component animations, and simplified menu transfer logic',
          description: '',
          source_repo_id: 4,
          source_branch: 'fix-nav-ui',
          source_sha: 'da5a61dbed639944e81618e1f61aff7aa63129f1',
          target_repo_id: 4,
          target_branch: 'main',
          merged: null,
          merge_method: null,
          merge_target_sha: 'b65133014b3090fa088628283aa4b309cc68b8fd',
          merge_base_sha: '0968c46779d93d82214cb0effe72c1442d165be7',
          merge_check_status: 'conflict',
          merge_conflicts: [
            'apps/gitness/src/components/RootWrapper.tsx',
            'packages/ui/src/components/button.tsx',
            'packages/ui/src/components/dropdown-menu.tsx',
            'packages/ui/src/components/manage-navigation/index.tsx',
            'packages/ui/src/components/navbar/navbar-item/index.tsx',
            'packages/ui/src/components/navbar/navbar-skeleton/index.tsx',
            'packages/ui/src/components/navbar/navbar.tsx',
            'packages/ui/src/components/navbar/types.ts',
            'packages/ui/src/components/popover.tsx',
            'packages/ui/src/components/scroll-area.tsx',
            'packages/ui/src/styles.css',
            'packages/ui/src/views/layouts/SandboxRoot.tsx',
            'packages/ui/tailwind.ts'
          ],
          rebase_check_status: 'unchecked',
          author: {
            id: 4,
            uid: 'iatopilskii',
            display_name: 'iatopilskii',
            email: 'iatopilskii@gmail.com',
            type: 'user',
            created: 1735910767538,
            updated: 1735910767538
          },
          merger: null,
          stats: {
            commits: 2,
            files_changed: 20,
            additions: 130,
            deletions: 51
          }
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
          created: 1737045224424,
          updated: 1737045224516,
          edited: 1737045224516,
          state: 'open',
          is_draft: false,
          title: 'fix: layout shift on repo summary page',
          description: '',
          source_repo_id: 4,
          source_branch: 'fix-layout-shift',
          source_sha: '37ac1c781fc4cc5985dfd1bc215c14534314e160',
          target_repo_id: 4,
          target_branch: 'main',
          merged: null,
          merge_method: null,
          merge_target_sha: 'b65133014b3090fa088628283aa4b309cc68b8fd',
          merge_base_sha: 'e6ccba6605b69d82964516b03a421a85163365ec',
          merge_check_status: 'conflict',
          merge_conflicts: [
            'apps/gitness/src/pages-v2/repo/repo-summary.tsx',
            'packages/ui/src/views/repo/components/summary/summary.tsx',
            'packages/ui/src/views/repo/repo-summary/repo-summary.tsx'
          ],
          rebase_check_status: 'unchecked',
          author: {
            id: 4,
            uid: 'iatopilskii',
            display_name: 'iatopilskii',
            email: 'iatopilskii@gmail.com',
            type: 'user',
            created: 1735910767538,
            updated: 1735910767538
          },
          merger: null,
          stats: {
            commits: 1,
            files_changed: 3,
            additions: 48,
            deletions: 32
          }
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
          created: 1737045230562,
          updated: 1737045230646,
          edited: 1737045230646,
          state: 'open',
          is_draft: false,
          title: 'feat(styles): update summary page',
          description: '',
          source_repo_id: 4,
          source_branch: 'feat-upd-summary-page',
          source_sha: '51edcfd2fc6c77d876eafb8690690bb5fe2039b3',
          target_repo_id: 4,
          target_branch: 'main',
          merged: null,
          merge_method: null,
          merge_target_sha: 'b65133014b3090fa088628283aa4b309cc68b8fd',
          merge_base_sha: 'afe913597740f8333a5b794abf8cbf268f247e25',
          merge_check_status: 'conflict',
          merge_conflicts: [
            'packages/ui/locales/en/views.json',
            'packages/ui/locales/es/views.json',
            'packages/ui/locales/fr/views.json',
            'packages/ui/src/components/copy-button.tsx',
            'packages/ui/src/views/repo/components/token-dialog/clone-credential-dialog.tsx',
            'packages/ui/src/views/repo/repo-summary/components/clone-repo-dialog.tsx'
          ],
          rebase_check_status: 'unchecked',
          author: {
            id: 4,
            uid: 'iatopilskii',
            display_name: 'iatopilskii',
            email: 'iatopilskii@gmail.com',
            type: 'user',
            created: 1735910767538,
            updated: 1735910767538
          },
          merger: null,
          stats: {
            commits: 1,
            files_changed: 8,
            additions: 97,
            deletions: 47
          }
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
          created: 1737045235615,
          updated: 1737045235826,
          edited: 1737045235826,
          state: 'open',
          is_draft: true,
          title: 'fix: repository list',
          description: '',
          source_repo_id: 4,
          source_branch: 'feat-tags-list',
          source_sha: '4e7163ffe79dc2bfa9c69856d0645639da3e8466',
          target_repo_id: 4,
          target_branch: 'main',
          merged: null,
          merge_method: null,
          merge_target_sha: 'b65133014b3090fa088628283aa4b309cc68b8fd',
          merge_base_sha: '79c5ac7d7c485a01a7c30850d927cbcff7ec063e',
          merge_check_status: 'conflict',
          merge_conflicts: [
            'packages/canary/src/components/badge.tsx',
            'packages/canary/src/components/button.tsx',
            'packages/canary/src/components/dropdown-menu.tsx',
            'packages/canary/src/components/icon.tsx',
            'packages/canary/src/components/pagination.tsx',
            'packages/canary/src/components/skeleton.tsx',
            'packages/canary/src/components/spacer.tsx',
            'packages/canary/src/components/stacked-list.tsx',
            'packages/canary/src/components/table.tsx',
            'packages/canary/src/components/tabs.tsx',
            'packages/canary/src/components/text.tsx',
            'packages/canary/src/lib/utils.ts',
            'packages/canary/src/styles.css',
            'packages/canary/tailwind.config.js',
            'packages/playground/src/App.tsx',
            'packages/playground/src/components/commit-copy-actions.tsx',
            'packages/playground/src/components/loaders/skeleton-list.tsx',
            'packages/playground/src/components/repo-list.tsx',
            'packages/playground/src/components/sha-badge.tsx',
            'packages/playground/src/data/mockBranchData.ts',
            'packages/playground/src/data/mockReposData.ts',
            'packages/playground/src/layouts/RepoLayout.tsx',
            'packages/playground/src/layouts/SandboxPullrequestLayout.tsx',
            'packages/playground/src/pages/branches-list-page.tsx',
            'packages/playground/src/pages/commits-list-page.tsx',
            'packages/playground/src/pages/repo-list-page.tsx',
            'packages/playground/src/pages/repo-summary-page.tsx',
            'packages/playground/src/pages/sandbox-branches-list-page.tsx',
            'packages/playground/src/pages/sandbox-commits-list-page.tsx',
            'packages/playground/src/pages/sandbox-repo-code-page.tsx',
            'packages/playground/src/pages/sandbox-repo-summary-page.tsx',
            'packages/views/src/components/branch-chooser.tsx',
            'packages/views/src/components/branch-selector.tsx',
            'packages/views/src/components/branches-list.tsx',
            'packages/views/src/components/no-data.tsx',
            'packages/views/src/components/no-search-results.tsx',
            'packages/views/src/components/repo-tags/dialogs/create-tag-dialog.tsx',
            'packages/views/src/components/repo-tags/interfaces.ts',
            'packages/views/src/components/repo-tags/repo-tags-list.tsx',
            'packages/views/src/components/repo-tags/repo-tags-reducers/dialog-state-reducer.ts',
            'packages/views/src/data/mockTagsData.ts',
            'packages/views/src/index.ts',
            'packages/views/src/layouts/SandboxPullRequestLayout.tsx',
            'packages/views/src/layouts/SandboxPullrequestLayout.tsx',
            'packages/views/src/pages/repo-tags-list-page.tsx',
            'packages/views/src/types/branch.ts',
            'packages/views/vercel.json'
          ],
          rebase_check_status: 'unchecked',
          author: {
            id: 4,
            uid: 'iatopilskii',
            display_name: 'iatopilskii',
            email: 'iatopilskii@gmail.com',
            type: 'user',
            created: 1735910767538,
            updated: 1735910767538
          },
          merger: null,
          stats: {
            commits: 14,
            files_changed: 51,
            additions: 1355,
            deletions: 436
          }
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
  selectedRefType: 'branches',
  selectedBranchTag: {
    name: '',
    sha: ''
  },
  xNextPage: 2,
  xPrevPage: null,
  page: 1
}
