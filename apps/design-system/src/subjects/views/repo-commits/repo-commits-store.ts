import { RepoCommitsViewProps } from '@harnessio/ui/views'

interface RepoCommitsStore {
  commits: RepoCommitsViewProps['commitsList']
}

export const repoCommitsStore: RepoCommitsStore = {
  commits: [
    {
      sha: '1d0e5a9461b340ebb3d7e092a2d35ff6d0d5c952',
      parent_shas: ['fed1cc1d02f3fd079e71cc28080c5f85bddfcd01'],
      title: 'Branch selector store (#519)',
      message:
        'Branch selector store (#519)\n\n* Added branch selector store\r\n\r\n* Fixed default branch in summary\r\n\r\n* Removed commented code\r\n\r\n* Removed commented code\r\n\r\n* Removed className from store\r\n\r\n* Changed file name\r\n\r\n* Fixed lint error\r\n\r\n* Fixed lint and type issues\r\n\r\n* setBranchList if branches are available\r\n\r\n* Removed condition for setting selectedBranchTag\r\n\r\n* Removed unused code\r\n\r\n* Renamed repo-branch-selector-store to repo-branches-store\r\n\r\n* Removed commented code\r\n\r\n* Removed unnecessary null checks\r\n\r\n* Removed check for rendering branch selector dropdown\r\n\r\n* Removed null check\r\n\r\n* Improved code readability\r\n\r\n* Merged setSpaceId and setRepoId into one function',
      author: {
        identity: {
          name: 'vivek-harness',
          email: 'c_vivek.patel@harness.io'
        },
        when: '2024-12-05T21:20:46-08:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-05T21:20:46-08:00'
      },
      stats: {
        total: {
          insertions: 216,
          deletions: 217,
          changes: 433
        },
        files: [
          {
            path: 'packages/ui/src/views/repo/repo-commits/repo-commits-view.tsx',
            status: 'MODIFIED',
            insertions: 8,
            deletions: 24,
            changes: 32
          },
          {
            path: 'packages/ui/src/views/repo/repo.types.ts',
            status: 'MODIFIED',
            insertions: 20,
            deletions: 0,
            changes: 20
          },
          {
            path: 'apps/gitness/src/pages-v2/pull-request/pull-request-compare.tsx',
            status: 'MODIFIED',
            insertions: 13,
            deletions: 12,
            changes: 25
          },
          {
            path: 'apps/gitness/src/pages-v2/repo/stores/repo-branches-store.ts',
            status: 'ADDED',
            insertions: 21,
            deletions: 0,
            changes: 21
          },
          {
            path: 'packages/ui/src/views/layouts/PullRequestCompareLayout.tsx',
            status: 'MODIFIED',
            insertions: 9,
            deletions: 24,
            changes: 33
          },
          {
            path: 'packages/ui/src/views/repo/components/branch-selector/branch-selector.tsx',
            status: 'MODIFIED',
            insertions: 29,
            deletions: 20,
            changes: 49
          },
          {
            path: 'packages/ui/src/views/repo/components/branch-selector/types.ts',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 1,
            changes: 4
          },
          {
            path: 'packages/ui/src/views/repo/repo-summary/repo-summary.tsx',
            status: 'MODIFIED',
            insertions: 8,
            deletions: 24,
            changes: 32
          },
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-commits.tsx',
            status: 'MODIFIED',
            insertions: 22,
            deletions: 20,
            changes: 42
          },
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-sidebar.tsx',
            status: 'MODIFIED',
            insertions: 27,
            deletions: 28,
            changes: 55
          },
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-summary.tsx',
            status: 'MODIFIED',
            insertions: 38,
            deletions: 39,
            changes: 77
          },
          {
            path: 'packages/ui/src/views/repo/components/branch-selector/branch-selector-dropdown.tsx',
            status: 'MODIFIED',
            insertions: 11,
            deletions: 2,
            changes: 13
          },
          {
            path: 'packages/ui/src/views/repo/repo-sidebar/index.tsx',
            status: 'MODIFIED',
            insertions: 7,
            deletions: 23,
            changes: 30
          }
        ]
      }
    },
    {
      sha: 'fed1cc1d02f3fd079e71cc28080c5f85bddfcd01',
      parent_shas: ['685ed5cabb223e31b84af5e7b634ee82f584ea8d'],
      title: 'feat: [pipe-20716]: migrate diff viewer and use commit list (#529)',
      message:
        'feat: [pipe-20716]: migrate diff viewer and use commit list (#529)\n\n* feat: [pipe-20716]: migrate diff viewer and use commit list\r\n\r\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\n\r\n* feat: [pipe-20716]: migrate diff viewer and use commit list\r\n\r\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\n\r\n* feat: [pipe-20716]: migrate diff viewer and use commit list- comments\r\n\r\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\n\r\n---------\r\n\r\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\nCo-authored-by: Calvin Lee <cjlee@ualberta.ca>',
      author: {
        identity: {
          name: 'Calvin Lee',
          email: 'calvin.lee@harness.io'
        },
        when: '2024-12-05T19:13:42-07:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-05T19:13:42-07:00'
      },
      stats: {
        total: {
          insertions: 531,
          deletions: 166,
          changes: 697
        },
        files: [
          {
            path: 'packages/ui/package.json',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 0,
            changes: 1
          },
          {
            path: 'packages/ui/src/views/layouts/PullRequestCompareLayout.tsx',
            status: 'MODIFIED',
            insertions: 25,
            deletions: 14,
            changes: 39
          },
          {
            path: 'packages/ui/src/views/repo/pull-request/compare/components/pull-request-compare-form.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 3,
            changes: 4
          },
          {
            path: 'packages/ui/src/views/repo/pull-request/diff-viewer/constants.ts',
            status: 'ADDED',
            insertions: 22,
            deletions: 0,
            changes: 22
          },
          {
            path: 'packages/ui/src/views/repo/pull-request/diff-viewer/pull-request-diff-viewer.tsx',
            status: 'ADDED',
            insertions: 307,
            deletions: 0,
            changes: 307
          },
          {
            path: 'pnpm-lock.yaml',
            status: 'MODIFIED',
            insertions: 175,
            deletions: 149,
            changes: 324
          }
        ]
      }
    },
    {
      sha: '685ed5cabb223e31b84af5e7b634ee82f584ea8d',
      parent_shas: ['e6b6ed6b470ce5a6b23480343ce08163b9155ffb'],
      title: 'Finish pr list page (#528)',
      message:
        'Finish pr list page (#528)\n\n* feat: add searc/sort/filter and fix flicker\n\n* chore: fix comments\n\n* feat: add open/closed pr count, fix states\n\n* feat: add no results states\n\n* feat: add clear filters button\n\n* fix: review comments\n\n* fix: typecheck',
      author: {
        identity: {
          name: 'Sanskar',
          email: 'c_sanskar.sehgal@harness.io'
        },
        when: '2024-12-05T18:06:24-08:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-05T18:06:24-08:00'
      },
      stats: {
        total: {
          insertions: 455,
          deletions: 67,
          changes: 522
        },
        files: [
          {
            path: 'apps/gitness/src/pages-v2/pull-request/pull-request-list.tsx',
            status: 'MODIFIED',
            insertions: 13,
            deletions: 3,
            changes: 16
          },
          {
            path: 'apps/gitness/src/pages-v2/pull-request/stores/pull-request-store.tsx',
            status: 'MODIFIED',
            insertions: 15,
            deletions: 2,
            changes: 17
          },
          {
            path: 'packages/ui/locales/en/views.json',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/locales/es/views.json',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/locales/fr/views.json',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/src/views/repo/pull-request/pull-request-list-page.tsx',
            status: 'MODIFIED',
            insertions: 421,
            deletions: 59,
            changes: 480
          },
          {
            path: 'packages/ui/src/views/repo/pull-request/types.ts',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 0,
            changes: 3
          }
        ]
      }
    },
    {
      sha: 'e6b6ed6b470ce5a6b23480343ce08163b9155ffb',
      parent_shas: ['1e572442dc06747d8e49e3af60a2e705439dc1e6'],
      title: 'Removed theme selector from general settings (#527)',
      message: 'Removed theme selector from general settings (#527)',
      author: {
        identity: {
          name: 'vivek-harness',
          email: 'c_vivek.patel@harness.io'
        },
        when: '2024-12-05T15:18:47-08:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-05T15:18:47-08:00'
      },
      stats: {
        total: {
          insertions: 1,
          deletions: 6,
          changes: 7
        },
        files: [
          {
            path: 'apps/gitness/src/pages/profile-settings/profile-settings-general-page.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 6,
            changes: 7
          }
        ]
      }
    },
    {
      sha: '1e572442dc06747d8e49e3af60a2e705439dc1e6',
      parent_shas: ['232494b40ddb328649ebb8c83a5fcc3b175d2a7e'],
      title: 'feat: [pipe-20716]: remove star filter on webhook list page (#526)',
      message:
        'feat: [pipe-20716]: remove star filter on webhook list page (#526)\n\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\nCo-authored-by: Calvin Lee <cjlee@ualberta.ca>',
      author: {
        identity: {
          name: 'Calvin Lee',
          email: 'calvin.lee@harness.io'
        },
        when: '2024-12-05T13:50:39-07:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-05T13:50:39-07:00'
      },
      stats: {
        total: {
          insertions: 0,
          deletions: 18,
          changes: 18
        },
        files: [
          {
            path: 'packages/ui/src/views/repo/webhooks/webhook-list/repo-webhook-list-page.tsx',
            status: 'MODIFIED',
            insertions: 0,
            deletions: 18,
            changes: 18
          }
        ]
      }
    },
    {
      sha: '232494b40ddb328649ebb8c83a5fcc3b175d2a7e',
      parent_shas: ['fef15884b162749d7ebd464a2ccae0bb28c9b9db'],
      title: 'Fixed Summary Page Flicker (#525)',
      message:
        'Fixed Summary Page Flicker (#525)\n\n* Passed loading state correctly to the view layer\r\n\r\n* Handled data states correctly for repo summary page',
      author: {
        identity: {
          name: 'vivek-harness',
          email: 'c_vivek.patel@harness.io'
        },
        when: '2024-12-05T12:13:34-08:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-05T12:13:34-08:00'
      },
      stats: {
        total: {
          insertions: 16,
          deletions: 20,
          changes: 36
        },
        files: [
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-summary.tsx',
            status: 'MODIFIED',
            insertions: 4,
            deletions: 2,
            changes: 6
          },
          {
            path: 'packages/ui/src/views/repo/repo-summary/repo-summary.tsx',
            status: 'MODIFIED',
            insertions: 12,
            deletions: 18,
            changes: 30
          }
        ]
      }
    },
    {
      sha: 'fef15884b162749d7ebd464a2ccae0bb28c9b9db',
      parent_shas: ['32a79af99f0701cc4319b203f46a4a178a81b956'],
      title: 'fix: repo code files path on default branch (#521)',
      message:
        'fix: repo code files path on default branch (#521)\n\n* fix: repo code files path on default branch\r\n\r\n* fix: repo code files path on default branch',
      author: {
        identity: {
          name: 'Shaurya Kalia',
          email: '113332561+shaurya-harness@users.noreply.github.com'
        },
        when: '2024-12-06T00:02:56+05:30'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-06T00:02:56+05:30'
      },
      stats: {
        total: {
          insertions: 11,
          deletions: 11,
          changes: 22
        },
        files: [
          {
            path: 'apps/gitness/src/components/FileEditor.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'apps/gitness/src/components/FileExplorer.tsx',
            status: 'MODIFIED',
            insertions: 6,
            deletions: 6,
            changes: 12
          },
          {
            path: 'apps/gitness/src/components/FileViewer.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-code.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'apps/gitness/src/utils/path-utils.ts',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 2,
            changes: 4
          }
        ]
      }
    },
    {
      sha: '32a79af99f0701cc4319b203f46a4a178a81b956',
      parent_shas: ['e6ccba6605b69d82964516b03a421a85163365ec'],
      title: 'refactor: restructure form components (#523)',
      message:
        'refactor: restructure form components (#523)\n\n* refactor: restructure form components\r\n\r\n- Updated component exports in `index.ts` to include new form primitives.\r\n- Enhanced the `RepoCreatePage` to utilize the new `FormWrapper` component for better structure and readability.\r\n\r\n* fix: fixes after review',
      author: {
        identity: {
          name: 'Ilya Topilskii',
          email: 'iatopilskii@gmail.com'
        },
        when: '2024-12-05T16:00:58+01:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-05T16:00:58+01:00'
      },
      stats: {
        total: {
          insertions: 99,
          deletions: 163,
          changes: 262
        },
        files: [
          {
            path: '',
            status: '',
            insertions: 2,
            deletions: 6,
            changes: 8
          },
          {
            path: 'packages/ui/src/components/node-group.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: '',
            status: '',
            insertions: 0,
            deletions: 0,
            changes: 0
          },
          {
            path: 'packages/ui/src/views/auth/new-password-page.tsx',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 13,
            changes: 16
          },
          {
            path: 'packages/ui/src/views/repo/repo-commits/components/commits-list.tsx',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 3,
            changes: 6
          },
          {
            path: 'packages/ui/src/components/filters/filters-bar/sorts.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 3,
            changes: 4
          },
          {
            path: '',
            status: '',
            insertions: 0,
            deletions: 0,
            changes: 0
          },
          {
            path: '',
            status: '',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: '',
            status: '',
            insertions: 0,
            deletions: 0,
            changes: 0
          },
          {
            path: '',
            status: '',
            insertions: 3,
            deletions: 8,
            changes: 11
          },
          {
            path: 'packages/ui/src/components/filters/filters-bar/filter-variants/number.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 2,
            changes: 3
          },
          {
            path: 'packages/ui/src/components/filters/filter-trigger.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 2,
            changes: 3
          },
          {
            path: 'packages/ui/src/components/filters/filters-bar/filter-variants/calendar.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 2,
            changes: 3
          },
          {
            path: 'packages/ui/src/components/filters/filters-bar/filter-variants/checkbox.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 3,
            changes: 4
          },
          {
            path: 'packages/ui/src/components/index.ts',
            status: 'MODIFIED',
            insertions: 8,
            deletions: 1,
            changes: 9
          },
          {
            path: '',
            status: '',
            insertions: 6,
            deletions: 11,
            changes: 17
          },
          {
            path: 'packages/ui/src/views/auth/forgot-password-page.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 7,
            changes: 9
          },
          {
            path: '',
            status: '',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: '',
            status: '',
            insertions: 0,
            deletions: 0,
            changes: 0
          },
          {
            path: '',
            status: '',
            insertions: 0,
            deletions: 0,
            changes: 0
          },
          {
            path: '',
            status: '',
            insertions: 3,
            deletions: 8,
            changes: 11
          },
          {
            path: 'packages/ui/src/components/filters/filters-bar/filter-variants/text.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 3,
            changes: 4
          },
          {
            path: '',
            status: '',
            insertions: 1,
            deletions: 6,
            changes: 7
          },
          {
            path: 'packages/ui/src/views/auth/signin-page.tsx',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 13,
            changes: 16
          },
          {
            path: 'packages/ui/src/views/repo/pull-request/compare/components/pull-request-compare-form.tsx',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 8,
            changes: 11
          },
          {
            path: 'packages/ui/src/views/repo/repo-create/index.tsx',
            status: 'MODIFIED',
            insertions: 10,
            deletions: 29,
            changes: 39
          },
          {
            path: 'packages/ui/locales/en/views.json',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 2,
            changes: 4
          },
          {
            path: 'packages/ui/locales/es/views.json',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 2,
            changes: 4
          },
          {
            path: 'packages/ui/src/components/form-primitives/form-primitives.types.ts',
            status: 'ADDED',
            insertions: 6,
            deletions: 0,
            changes: 6
          },
          {
            path: '',
            status: '',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: '',
            status: '',
            insertions: 0,
            deletions: 0,
            changes: 0
          },
          {
            path: 'packages/ui/locales/fr/views.json',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 2,
            changes: 4
          },
          {
            path: 'packages/ui/src/components/form-primitives/form-wrapper.tsx',
            status: 'ADDED',
            insertions: 25,
            deletions: 0,
            changes: 25
          },
          {
            path: 'packages/ui/src/views/auth/signup-page.tsx',
            status: 'MODIFIED',
            insertions: 5,
            deletions: 25,
            changes: 30
          }
        ]
      }
    },
    {
      sha: 'e6ccba6605b69d82964516b03a421a85163365ec',
      parent_shas: ['7a615b2a9ed1e5bfd77a5fd2c2587fdb71e1689a'],
      title: 'feat: [pipe-20716]: first version of pr compare page (#522)',
      message:
        'feat: [pipe-20716]: first version of pr compare page (#522)\n\n* feat: [pipe-20716]: first version of pr compare page\r\n\r\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\n\r\n* feat: [pipe-20716]: first version of pr compare page\r\n\r\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\n\r\n---------\r\n\r\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\nCo-authored-by: Calvin Lee <cjlee@ualberta.ca>',
      author: {
        identity: {
          name: 'Calvin Lee',
          email: 'calvin.lee@harness.io'
        },
        when: '2024-12-05T01:13:38-07:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-05T01:13:38-07:00'
      },
      stats: {
        total: {
          insertions: 455,
          deletions: 31,
          changes: 486
        },
        files: [
          {
            path: 'packages/ui/src/views/repo/pull-request/pull-request-list-page.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/src/views/repo/repo-layout/index.tsx',
            status: 'MODIFIED',
            insertions: 9,
            deletions: 1,
            changes: 10
          },
          {
            path: 'apps/gitness/src/App.tsx',
            status: 'MODIFIED',
            insertions: 10,
            deletions: 3,
            changes: 13
          },
          {
            path: 'apps/gitness/src/pages-v2/pull-request/pull-request-compare.tsx',
            status: 'ADDED',
            insertions: 382,
            deletions: 0,
            changes: 382
          },
          {
            path: 'apps/gitness/src/pages-v2/pull-request/pull-request-list.tsx',
            status: 'MODIFIED',
            insertions: 9,
            deletions: 1,
            changes: 10
          },
          {
            path: 'packages/ui/src/views/index.ts',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 0,
            changes: 1
          },
          {
            path: 'packages/ui/src/views/layouts/PullRequestCompareLayout.tsx',
            status: 'MODIFIED',
            insertions: 40,
            deletions: 24,
            changes: 64
          },
          {
            path: 'packages/ui/src/views/repo/pull-request/compare/components/pull-request-compare-form.tsx',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 1,
            changes: 4
          }
        ]
      }
    },
    {
      sha: '7a615b2a9ed1e5bfd77a5fd2c2587fdb71e1689a',
      parent_shas: ['ad050337bfe1bfcf72fc63c8fd5a9e9ccdbbdec1'],
      title: 'Remove workspace paste formatting (#520)',
      message: 'Remove workspace paste formatting (#520)',
      author: {
        identity: {
          name: 'praneshg239',
          email: '95267551+praneshg239@users.noreply.github.com'
        },
        when: '2024-12-05T11:42:04+05:30'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-05T11:42:04+05:30'
      },
      stats: {
        total: {
          insertions: 3,
          deletions: 3,
          changes: 6
        },
        files: [
          {
            path: '.vscode/settings.json',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 3,
            changes: 6
          }
        ]
      }
    },
    {
      sha: 'ad050337bfe1bfcf72fc63c8fd5a9e9ccdbbdec1',
      parent_shas: ['4152164a2f2007b84521f9ef5856ba305ec08adf'],
      title: 'chore: remove unused packages (#517)',
      message: 'chore: remove unused packages (#517)',
      author: {
        identity: {
          name: 'Abhinav Rastogi',
          email: 'abhinav.rastogi@harness.io'
        },
        when: '2024-12-04T21:17:17-08:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-04T21:17:17-08:00'
      },
      stats: {
        total: {
          insertions: 0,
          deletions: 21,
          changes: 21
        },
        files: [
          {
            path: 'packages/ui/package.json',
            status: 'MODIFIED',
            insertions: 0,
            deletions: 3,
            changes: 3
          },
          {
            path: 'pnpm-lock.yaml',
            status: 'MODIFIED',
            insertions: 0,
            deletions: 18,
            changes: 18
          }
        ]
      }
    },
    {
      sha: '4152164a2f2007b84521f9ef5856ba305ec08adf',
      parent_shas: ['8a2157c41932d336740b2ecd8783b750108417cc'],
      title: 'Fixed markdown preview for light mode (#452)',
      message:
        'Fixed markdown preview for light mode (#452)\n\nCo-authored-by: Abhinav Rastogi <abhinav.rastogi@harness.io>',
      author: {
        identity: {
          name: 'vivek-harness',
          email: 'c_vivek.patel@harness.io'
        },
        when: '2024-12-04T21:13:48-08:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-04T21:13:48-08:00'
      },
      stats: {
        total: {
          insertions: 1,
          deletions: 1,
          changes: 2
        },
        files: [
          {
            path: 'packages/views/src/components/markdown-viewer.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          }
        ]
      }
    },
    {
      sha: '8a2157c41932d336740b2ecd8783b750108417cc',
      parent_shas: ['6e80e11ca274ec86fc85727180a3efdfb41b7e79'],
      title: 'fix: gitRef hook and tags selector (#510)',
      message:
        'fix: gitRef hook and tags selector (#510)\n\n* fix: gitRef hook and tags selector\r\n\r\n* fix: gitRef hook and tags selector\r\n\r\n* fix: gitRef hook and tags selector\r\n\r\n* fix: branch selector types\r\n\r\n* fix: gitRef hook and tags selector',
      author: {
        identity: {
          name: 'Shaurya Kalia',
          email: '113332561+shaurya-harness@users.noreply.github.com'
        },
        when: '2024-12-05T10:19:21+05:30'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-05T10:19:21+05:30'
      },
      stats: {
        total: {
          insertions: 222,
          deletions: 129,
          changes: 351
        },
        files: [
          {
            path: 'apps/gitness/src/App.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 8,
            changes: 10
          },
          {
            path: 'apps/gitness/src/hooks/useCodePathDetails.ts',
            status: 'ADDED',
            insertions: 32,
            deletions: 0,
            changes: 32
          },
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-sidebar.tsx',
            status: 'MODIFIED',
            insertions: 67,
            deletions: 37,
            changes: 104
          },
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-summary.tsx',
            status: 'MODIFIED',
            insertions: 60,
            deletions: 18,
            changes: 78
          },
          {
            path: 'packages/ui/src/views/repo/components/branch-selector/branch-selector-dropdown.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 29,
            changes: 31
          },
          {
            path: 'packages/ui/src/views/repo/components/branch-selector/branch-selector.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 9,
            changes: 11
          },
          {
            path: 'packages/ui/src/views/repo/components/branch-selector/index.ts',
            status: 'ADDED',
            insertions: 2,
            deletions: 0,
            changes: 2
          },
          {
            path: 'packages/ui/src/views/repo/components/index.ts',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/src/views/repo/repo-sidebar/index.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 2,
            changes: 4
          },
          {
            path: 'apps/gitness/src/components/FileExplorer.tsx',
            status: 'MODIFIED',
            insertions: 8,
            deletions: 9,
            changes: 17
          },
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-code.tsx',
            status: 'MODIFIED',
            insertions: 6,
            deletions: 14,
            changes: 20
          },
          {
            path: 'packages/ui/src/views/repo/components/branch-selector/types.ts',
            status: 'ADDED',
            insertions: 36,
            deletions: 0,
            changes: 36
          },
          {
            path: 'packages/ui/src/views/repo/repo-summary/repo-summary.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 2,
            changes: 4
          }
        ]
      }
    },
    {
      sha: '6e80e11ca274ec86fc85727180a3efdfb41b7e79',
      parent_shas: ['7662bb270e905ec6c63e5771b7561592e7081071'],
      title: 'feat: [pipe-20716]: fix routing & move files to repo (#518)',
      message:
        'feat: [pipe-20716]: fix routing & move files to repo (#518)\n\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\nCo-authored-by: Calvin Lee <cjlee@ualberta.ca>',
      author: {
        identity: {
          name: 'Calvin Lee',
          email: 'calvin.lee@harness.io'
        },
        when: '2024-12-04T17:29:05-07:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-04T17:29:05-07:00'
      },
      stats: {
        total: {
          insertions: 23,
          deletions: 23,
          changes: 46
        },
        files: [
          {
            path: '',
            status: '',
            insertions: 0,
            deletions: 0,
            changes: 0
          },
          {
            path: 'packages/ui/src/views/webhooks/index.ts',
            status: 'DELETED',
            insertions: 0,
            deletions: 3,
            changes: 3
          },
          {
            path: 'packages/ui/src/views/layouts/PullRequestCompareLayout.tsx',
            status: 'MODIFIED',
            insertions: 5,
            deletions: 5,
            changes: 10
          },
          {
            path: '',
            status: '',
            insertions: 0,
            deletions: 0,
            changes: 0
          },
          {
            path: '',
            status: '',
            insertions: 0,
            deletions: 0,
            changes: 0
          },
          {
            path: '',
            status: '',
            insertions: 2,
            deletions: 2,
            changes: 4
          },
          {
            path: '',
            status: '',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: '',
            status: '',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: '',
            status: '',
            insertions: 0,
            deletions: 0,
            changes: 0
          },
          {
            path: '',
            status: '',
            insertions: 2,
            deletions: 2,
            changes: 4
          },
          {
            path: '',
            status: '',
            insertions: 2,
            deletions: 2,
            changes: 4
          },
          {
            path: '',
            status: '',
            insertions: 4,
            deletions: 4,
            changes: 8
          },
          {
            path: '',
            status: '',
            insertions: 0,
            deletions: 0,
            changes: 0
          },
          {
            path: 'packages/ui/src/views/repo/repo-layout/index.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/src/views/repo/webhooks/index.ts',
            status: 'ADDED',
            insertions: 3,
            deletions: 0,
            changes: 3
          },
          {
            path: 'packages/ui/src/views/index.ts',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 2,
            changes: 4
          },
          {
            path: '',
            status: '',
            insertions: 0,
            deletions: 0,
            changes: 0
          },
          {
            path: '',
            status: '',
            insertions: 0,
            deletions: 0,
            changes: 0
          },
          {
            path: '',
            status: '',
            insertions: 0,
            deletions: 0,
            changes: 0
          },
          {
            path: '',
            status: '',
            insertions: 0,
            deletions: 0,
            changes: 0
          }
        ]
      }
    },
    {
      sha: '7662bb270e905ec6c63e5771b7561592e7081071',
      parent_shas: ['97a43ac3c87146bf8efa1ed8b051cf38c80c7aa8'],
      title: 'feat: [pipe-20716]: fix routing on breadcrumbs fr prs (#516)',
      message:
        'feat: [pipe-20716]: fix routing on breadcrumbs fr prs (#516)\n\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\nCo-authored-by: Calvin Lee <cjlee@ualberta.ca>',
      author: {
        identity: {
          name: 'Calvin Lee',
          email: 'calvin.lee@harness.io'
        },
        when: '2024-12-04T16:41:35-07:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-04T16:41:35-07:00'
      },
      stats: {
        total: {
          insertions: 1,
          deletions: 1,
          changes: 2
        },
        files: [
          {
            path: 'packages/ui/src/views/repo/repo-layout/index.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          }
        ]
      }
    },
    {
      sha: '97a43ac3c87146bf8efa1ed8b051cf38c80c7aa8',
      parent_shas: ['67adcfec71457f4186a1be98985cf6e1a8870edc'],
      title: 'Repo Commits (#512)',
      message:
        'Repo Commits (#512)\n\n* Initial changes for repo-commits v2\r\n\r\n* Removed nuqs and code service client from ui\r\n\r\n* Refactored code for removing dependencies from views and canary\r\n\r\n* Used nuqs instead of useCommonFilter\r\n\r\n* Removed Gitness as author name and prevented rendering the avatar if no author name is present\r\n\r\n* Removed comment\r\n\r\n* Used BranchSelector instead of creating a separate component\r\n\r\n* Renamed pull-request-commits to commits-list for reusability\r\n\r\n* Removed Filter from commits page since it was not being used\r\n\r\n* Fixed merge conflict\r\n\r\n* Fixed pagination component new props',
      author: {
        identity: {
          name: 'vivek-harness',
          email: 'c_vivek.patel@harness.io'
        },
        when: '2024-12-04T13:28:23-08:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-04T13:28:23-08:00'
      },
      stats: {
        total: {
          insertions: 435,
          deletions: 2,
          changes: 437
        },
        files: [
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-commits.tsx',
            status: 'ADDED',
            insertions: 71,
            deletions: 0,
            changes: 71
          },
          {
            path: 'packages/ui/src/components/index.ts',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 0,
            changes: 1
          },
          {
            path: 'packages/ui/src/views/repo/index.ts',
            status: 'MODIFIED',
            insertions: 6,
            deletions: 0,
            changes: 6
          },
          {
            path: 'packages/ui/src/views/repo/repo-commits/components/filter.tsx',
            status: 'ADDED',
            insertions: 59,
            deletions: 0,
            changes: 59
          },
          {
            path: 'packages/ui/src/views/repo/repo-commits/index.tsx',
            status: 'ADDED',
            insertions: 4,
            deletions: 0,
            changes: 4
          },
          {
            path: 'packages/ui/src/views/repo/repo-commits/types.ts',
            status: 'ADDED',
            insertions: 39,
            deletions: 0,
            changes: 39
          },
          {
            path: 'apps/gitness/src/App.tsx',
            status: 'MODIFIED',
            insertions: 7,
            deletions: 2,
            changes: 9
          },
          {
            path: 'packages/ui/src/components/node-group.tsx',
            status: 'ADDED',
            insertions: 73,
            deletions: 0,
            changes: 73
          },
          {
            path: 'packages/ui/src/views/repo/repo-commits/components/commits-list.tsx',
            status: 'ADDED',
            insertions: 83,
            deletions: 0,
            changes: 83
          },
          {
            path: 'packages/ui/src/views/repo/repo-commits/repo-commits-view.tsx',
            status: 'ADDED',
            insertions: 92,
            deletions: 0,
            changes: 92
          }
        ]
      }
    },
    {
      sha: '67adcfec71457f4186a1be98985cf6e1a8870edc',
      parent_shas: ['9d1c4b3e1365bf0806832b6c7baf5256de2f2830'],
      title: 'Add i18n to badge and pagination for repo-list (#515)',
      message:
        'Add i18n to badge and pagination for repo-list (#515)\n\n* feat: add i18n to badge in repo-list\n\n* feat: add i18n to pagination\n\n* chore: fix i18nconfig\n\n* fix: make t a required prop',
      author: {
        identity: {
          name: 'Sanskar',
          email: 'c_sanskar.sehgal@harness.io'
        },
        when: '2024-12-04T12:31:25-08:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-04T12:31:25-08:00'
      },
      stats: {
        total: {
          insertions: 62,
          deletions: 18,
          changes: 80
        },
        files: [
          {
            path: 'packages/ui/locales/en/component.json',
            status: 'MODIFIED',
            insertions: 4,
            deletions: 0,
            changes: 4
          },
          {
            path: 'packages/ui/locales/es/component.json',
            status: 'MODIFIED',
            insertions: 4,
            deletions: 0,
            changes: 4
          },
          {
            path: 'packages/ui/locales/es/views.json',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 0,
            changes: 2
          },
          {
            path: 'packages/ui/src/views/webhooks/webhook-list/repo-webhook-list-page.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/src/views/repo/repo-list/repo-list-page.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 1,
            changes: 3
          },
          {
            path: 'packages/ui/src/views/repo/repo-list/repo-list.tsx',
            status: 'MODIFIED',
            insertions: 9,
            deletions: 5,
            changes: 14
          },
          {
            path: 'packages/ui/i18n.config.ts',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 1,
            changes: 3
          },
          {
            path: 'packages/ui/locales/fr/component.json',
            status: 'MODIFIED',
            insertions: 4,
            deletions: 0,
            changes: 4
          },
          {
            path: 'packages/ui/src/components/pagination-component.tsx',
            status: 'MODIFIED',
            insertions: 8,
            deletions: 1,
            changes: 9
          },
          {
            path: 'packages/ui/src/views/pull-request/pull-request-list-page.tsx',
            status: 'MODIFIED',
            insertions: 11,
            deletions: 3,
            changes: 14
          },
          {
            path: 'apps/gitness/src/pages-v2/pull-request/pull-request-list.tsx',
            status: 'MODIFIED',
            insertions: 4,
            deletions: 1,
            changes: 5
          },
          {
            path: 'packages/ui/locales/fr/views.json',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 0,
            changes: 2
          },
          {
            path: 'packages/ui/locales/en/views.json',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 0,
            changes: 2
          },
          {
            path: 'packages/ui/src/components/pagination.tsx',
            status: 'MODIFIED',
            insertions: 7,
            deletions: 5,
            changes: 12
          }
        ]
      }
    },
    {
      sha: '9d1c4b3e1365bf0806832b6c7baf5256de2f2830',
      parent_shas: ['3bb8cb7db15f049576647f2826e70f267bdcc442'],
      title: 'feat: add create repo page (#500)',
      message:
        'feat: add create repo page (#500)\n\n* feat: add create repo page\r\n\r\n* Fix: fixes and refactoring after review\r\n\r\n* fix: small fixes after rebase\r\n\r\n* fix: fixes and refactoring after review\r\n\r\nfix: linter fixes\r\n\r\nfix: fix imports and small refactoring\r\n\r\n* refactor: update naming in label variants constant\r\n\r\n* feat: update input errors ui\r\n\r\n* feat: transfer form-field-set components to ui/components\r\n\r\n* refactor: migrate form components to a new structure and update imports\r\n\r\n- Renamed and exported ButtonGroup as a standalone component.\r\n- Removed deprecated FormErrorMessage and FormLegend components.\r\n- Introduced new form components: Caption, Checkbox, ControlGroup, Fieldset, Input, Label, Legend, Message, Option, Radio, Select, Separator, Textarea.\r\n- Updated imports across various components to use the new form structure.\r\n- Adjusted styling and class names for consistency.\r\n- Refactored error handling to utilize the new Message component.\r\n\r\n* fix: fix linters and types\r\n\r\n* refactor: update documentation and examples for form components',
      author: {
        identity: {
          name: 'Ilya Topilskii',
          email: 'iatopilskii@gmail.com'
        },
        when: '2024-12-04T19:58:56+01:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-04T19:58:56+01:00'
      },
      stats: {
        total: {
          insertions: 1304,
          deletions: 741,
          changes: 2045
        },
        files: [
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-create-page.tsx',
            status: 'ADDED',
            insertions: 73,
            deletions: 0,
            changes: 73
          },
          {
            path: 'packages/ui/src/components/form/message.tsx',
            status: 'ADDED',
            insertions: 49,
            deletions: 0,
            changes: 49
          },
          {
            path: '',
            status: '',
            insertions: 6,
            deletions: 6,
            changes: 12
          },
          {
            path: 'packages/ui/src/components/filters/filters-bar/filter-variants/text.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/src/components/form/select.tsx',
            status: 'ADDED',
            insertions: 168,
            deletions: 0,
            changes: 168
          },
          {
            path: 'packages/ui/src/components/index.ts',
            status: 'MODIFIED',
            insertions: 4,
            deletions: 7,
            changes: 11
          },
          {
            path: 'packages/ui/src/views/repo/index.ts',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 0,
            changes: 3
          },
          {
            path: 'packages/ui/src/views/auth/components/agreements.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 2,
            changes: 4
          },
          {
            path: 'packages/ui/src/views/auth/otp-page.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 2,
            changes: 4
          },
          {
            path: 'apps/gitness/src/App.tsx',
            status: 'MODIFIED',
            insertions: 11,
            deletions: 2,
            changes: 13
          },
          {
            path: 'packages/ui/src/components/form/caption.tsx',
            status: 'ADDED',
            insertions: 22,
            deletions: 0,
            changes: 22
          },
          {
            path: '',
            status: '',
            insertions: 7,
            deletions: 0,
            changes: 7
          },
          {
            path: 'packages/ui/src/components/form/textarea.tsx',
            status: 'ADDED',
            insertions: 57,
            deletions: 0,
            changes: 57
          },
          {
            path: '',
            status: '',
            insertions: 2,
            deletions: 2,
            changes: 4
          },
          {
            path: 'packages/ui/src/components/button-group.tsx',
            status: 'MODIFIED',
            insertions: 9,
            deletions: 5,
            changes: 14
          },
          {
            path: 'packages/ui/src/components/card.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/src/components/filters/filters-bar/filter-variants/number.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/views/src/components/form-field-set.tsx',
            status: 'MODIFIED',
            insertions: 11,
            deletions: 0,
            changes: 11
          },
          {
            path: 'packages/ui/src/components/spacer.tsx',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 2,
            changes: 5
          },
          {
            path: 'packages/ui/src/views/auth/signin-page.tsx',
            status: 'MODIFIED',
            insertions: 7,
            deletions: 7,
            changes: 14
          },
          {
            path: 'packages/ui/src/views/layouts/SandboxLayout.tsx',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 2,
            changes: 5
          },
          {
            path: 'packages/ui/src/components/dropdown-menu.tsx',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 3,
            changes: 6
          },
          {
            path: 'packages/ui/src/components/filters/filter-trigger.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/src/components/form-error-message.tsx',
            status: 'DELETED',
            insertions: 0,
            deletions: 37,
            changes: 37
          },
          {
            path: 'packages/ui/src/components/form/checkbox.tsx',
            status: 'ADDED',
            insertions: 32,
            deletions: 0,
            changes: 32
          },
          {
            path: 'packages/ui/src/components/radio-group.tsx',
            status: 'DELETED',
            insertions: 0,
            deletions: 36,
            changes: 36
          },
          {
            path: 'packages/ui/src/components/form/legend.tsx',
            status: 'ADDED',
            insertions: 33,
            deletions: 0,
            changes: 33
          },
          {
            path: 'packages/ui/src/components/toast/index.ts',
            status: 'ADDED',
            insertions: 4,
            deletions: 0,
            changes: 4
          },
          {
            path: 'packages/ui/src/views/auth/components/animated-harness-logo.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/src/views/pull-request/compare/components/pull-request-compare-button.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 2,
            changes: 4
          },
          {
            path: 'packages/ui/src/components/theme-selector/color-select.tsx',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 14,
            changes: 17
          },
          {
            path: 'packages/ui/src/views/auth/signup-page.tsx',
            status: 'MODIFIED',
            insertions: 12,
            deletions: 12,
            changes: 24
          },
          {
            path: 'packages/ui/src/views/repo/repo-list/repo-list-page.tsx',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 1,
            changes: 4
          },
          {
            path: 'packages/ui/src/views/pull-request/compare/components/pull-request-compare-form.tsx',
            status: 'MODIFIED',
            insertions: 23,
            deletions: 25,
            changes: 48
          },
          {
            path: 'packages/ui/src/views/repo/repo-summary/repo-summary.tsx',
            status: 'MODIFIED',
            insertions: 4,
            deletions: 4,
            changes: 8
          },
          {
            path: 'packages/ui/src/components/button.tsx',
            status: 'MODIFIED',
            insertions: 13,
            deletions: 13,
            changes: 26
          },
          {
            path: 'packages/ui/src/components/filters/filters-bar/filter-variants/calendar.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: '',
            status: '',
            insertions: 11,
            deletions: 5,
            changes: 16
          },
          {
            path: 'packages/ui/src/components/form/radio.tsx',
            status: 'ADDED',
            insertions: 47,
            deletions: 0,
            changes: 47
          },
          {
            path: 'packages/ui/src/components/theme-selector/contrast-select.tsx',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 4,
            changes: 7
          },
          {
            path: 'packages/ui/src/components/filters/filters-bar/filters.tsx',
            status: 'MODIFIED',
            insertions: 7,
            deletions: 7,
            changes: 14
          },
          {
            path: 'packages/ui/src/views/repo/repo-sidebar/index.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 2,
            changes: 4
          },
          {
            path: 'packages/ui/src/components/form/index.ts',
            status: 'ADDED',
            insertions: 13,
            deletions: 0,
            changes: 13
          },
          {
            path: 'packages/ui/src/components/form/option.tsx',
            status: 'ADDED',
            insertions: 55,
            deletions: 0,
            changes: 55
          },
          {
            path: 'packages/ui/src/components/form/separator.tsx',
            status: 'ADDED',
            insertions: 29,
            deletions: 0,
            changes: 29
          },
          {
            path: 'packages/ui/src/components/input-otp.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/src/components/toast/toast.tsx',
            status: 'ADDED',
            insertions: 115,
            deletions: 0,
            changes: 115
          },
          {
            path: 'packages/ui/src/components/manage-navigation/index.tsx',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 3,
            changes: 6
          },
          {
            path: 'packages/ui/src/components/select.tsx',
            status: 'DELETED',
            insertions: 0,
            deletions: 144,
            changes: 144
          },
          {
            path: 'packages/ui/src/views/repo/components/branch-selector/branch-selector-dropdown.tsx',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 3,
            changes: 6
          },
          {
            path: 'packages/canary/src/components/toast.tsx',
            status: 'DELETED',
            insertions: 0,
            deletions: 111,
            changes: 111
          },
          {
            path: 'packages/canary/src/index.ts',
            status: 'MODIFIED',
            insertions: 0,
            deletions: 3,
            changes: 3
          },
          {
            path: 'packages/ui/src/components/badge.tsx',
            status: 'MODIFIED',
            insertions: 7,
            deletions: 7,
            changes: 14
          },
          {
            path: 'packages/ui/src/components/filters/filters-bar/sorts.tsx',
            status: 'MODIFIED',
            insertions: 12,
            deletions: 12,
            changes: 24
          },
          {
            path: 'packages/ui/src/components/form-field-set.tsx',
            status: 'DELETED',
            insertions: 0,
            deletions: 188,
            changes: 188
          },
          {
            path: 'packages/ui/src/components/filters/filters-bar/filter-variants/checkbox.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/src/components/form/fieldset.tsx',
            status: 'ADDED',
            insertions: 32,
            deletions: 0,
            changes: 32
          },
          {
            path: 'packages/ui/src/views/repo/repo-create/index.tsx',
            status: 'ADDED',
            insertions: 289,
            deletions: 0,
            changes: 289
          },
          {
            path: 'packages/ui/src/components/textarea.tsx',
            status: 'DELETED',
            insertions: 0,
            deletions: 21,
            changes: 21
          },
          {
            path: 'packages/ui/src/views/auth/new-password-page.tsx',
            status: 'MODIFIED',
            insertions: 6,
            deletions: 6,
            changes: 12
          },
          {
            path: '',
            status: '',
            insertions: 27,
            deletions: 20,
            changes: 47
          },
          {
            path: 'packages/ui/src/styles.css',
            status: 'MODIFIED',
            insertions: 35,
            deletions: 0,
            changes: 35
          },
          {
            path: 'apps/gitness/src/pages/repo/repo-create-page.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/src/components/dialog.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/src/components/styled-link.tsx',
            status: 'ADDED',
            insertions: 17,
            deletions: 0,
            changes: 17
          },
          {
            path: 'packages/ui/src/components/theme-selector/mode-select.tsx',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 4,
            changes: 7
          },
          {
            path: 'packages/ui/src/views/auth/forgot-password-page.tsx',
            status: 'MODIFIED',
            insertions: 4,
            deletions: 4,
            changes: 8
          },
          {
            path: 'packages/ui/src/views/repo/repo-summary/components/summary-panel.tsx',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 3,
            changes: 6
          }
        ]
      }
    },
    {
      sha: '3bb8cb7db15f049576647f2826e70f267bdcc442',
      parent_shas: ['5767c57655acf215051bb0e27ce32f8f979c7af7'],
      title: 'feat: [XD-43]: Initial cut of view preview (#514)',
      message: 'feat: [XD-43]: Initial cut of view preview (#514)',
      author: {
        identity: {
          name: 'Kevin Nagurski',
          email: 'Kevin.nagurski@harness.io'
        },
        when: '2024-12-04T15:03:42Z'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-04T15:03:42Z'
      },
      stats: {
        total: {
          insertions: 5913,
          deletions: 5303,
          changes: 11216
        },
        files: [
          {
            path: 'apps/design-system/tsconfig.node.json',
            status: 'ADDED',
            insertions: 24,
            deletions: 0,
            changes: 24
          },
          {
            path: 'packages/ui/package.json',
            status: 'MODIFIED',
            insertions: 8,
            deletions: 6,
            changes: 14
          },
          {
            path: 'apps/design-system/package.json',
            status: 'ADDED',
            insertions: 38,
            deletions: 0,
            changes: 38
          },
          {
            path: 'apps/design-system/src/views/repo-list/repo-list-store.json',
            status: 'ADDED',
            insertions: 19,
            deletions: 0,
            changes: 19
          },
          {
            path: 'apps/design-system/tsconfig.json',
            status: 'ADDED',
            insertions: 7,
            deletions: 0,
            changes: 7
          },
          {
            path: 'packages/ui/vite-analyse.config.ts',
            status: 'ADDED',
            insertions: 6,
            deletions: 0,
            changes: 6
          },
          {
            path: 'apps/design-system/public/_redirects',
            status: 'ADDED',
            insertions: 1,
            deletions: 0,
            changes: 1
          },
          {
            path: 'apps/design-system/src/pages/view-preview/root-view-wrapper.tsx',
            status: 'ADDED',
            insertions: 32,
            deletions: 0,
            changes: 32
          },
          {
            path: 'apps/design-system/tsconfig.app.json',
            status: 'ADDED',
            insertions: 26,
            deletions: 0,
            changes: 26
          },
          {
            path: 'apps/design-system/src/pages/view-preview/view-preview.tsx',
            status: 'ADDED',
            insertions: 43,
            deletions: 0,
            changes: 43
          },
          {
            path: 'apps/design-system/src/utils.ts',
            status: 'ADDED',
            insertions: 7,
            deletions: 0,
            changes: 7
          },
          {
            path: 'packages/ui/vite.config.ts',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 1,
            changes: 3
          },
          {
            path: 'apps/design-system/src/views/repo-list/repo-list.tsx',
            status: 'ADDED',
            insertions: 28,
            deletions: 0,
            changes: 28
          },
          {
            path: 'packages/ui/locales/index.ts',
            status: 'MODIFIED',
            insertions: 0,
            deletions: 2,
            changes: 2
          },
          {
            path: 'packages/ui/src/views/repo/repo-summary/repo-summary.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'apps/design-system/.gitignore',
            status: 'ADDED',
            insertions: 24,
            deletions: 0,
            changes: 24
          },
          {
            path: 'apps/design-system/README.md',
            status: 'ADDED',
            insertions: 1,
            deletions: 0,
            changes: 1
          },
          {
            path: 'apps/design-system/index.html',
            status: 'ADDED',
            insertions: 12,
            deletions: 0,
            changes: 12
          },
          {
            path: 'packages/ui/src/views/repo/repo-list/repo-list-page.tsx',
            status: 'MODIFIED',
            insertions: 5,
            deletions: 5,
            changes: 10
          },
          {
            path: 'apps/design-system/src/main.tsx',
            status: 'ADDED',
            insertions: 10,
            deletions: 0,
            changes: 10
          },
          {
            path: 'apps/design-system/vite.config.ts',
            status: 'ADDED',
            insertions: 7,
            deletions: 0,
            changes: 7
          },
          {
            path: 'packages/ui/src/utils/cn.ts',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 2,
            changes: 4
          },
          {
            path: 'apps/design-system/src/views/repo-summary/repo-summary-props.json',
            status: 'ADDED',
            insertions: 1465,
            deletions: 0,
            changes: 1465
          },
          {
            path: 'packages/ui/tailwind.ts',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 2,
            changes: 4
          },
          {
            path: 'apps/design-system/src/pages/view-preview/repo-view-wrapper.tsx',
            status: 'ADDED',
            insertions: 34,
            deletions: 0,
            changes: 34
          },
          {
            path: 'apps/design-system/src/pages/view-preview/view-switcher.module.css',
            status: 'ADDED',
            insertions: 10,
            deletions: 0,
            changes: 10
          },
          {
            path: 'pnpm-lock.yaml',
            status: 'MODIFIED',
            insertions: 4017,
            deletions: 5283,
            changes: 9300
          },
          {
            path: 'apps/design-system/src/vite-env.d.ts',
            status: 'ADDED',
            insertions: 1,
            deletions: 0,
            changes: 1
          },
          {
            path: 'packages/ui/src/views/layouts/SandboxRoot.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'apps/design-system/src/App.tsx',
            status: 'ADDED',
            insertions: 12,
            deletions: 0,
            changes: 12
          },
          {
            path: 'apps/design-system/src/pages/view-preview/view-switcher.tsx',
            status: 'ADDED',
            insertions: 38,
            deletions: 0,
            changes: 38
          },
          {
            path: 'apps/design-system/src/views/repo-summary/repo-summary.tsx',
            status: 'ADDED',
            insertions: 30,
            deletions: 0,
            changes: 30
          }
        ]
      }
    },
    {
      sha: '5767c57655acf215051bb0e27ce32f8f979c7af7',
      parent_shas: ['43a0ad58aaeeb4d3313f2f529788fb899ce23ddc'],
      title: 'feat: update signin, signup, otp and new password pages (#499)',
      message:
        'feat: update signin, signup, otp and new password pages (#499)\n\n* feat: update signin, signup, otp and new password pages\r\n\r\n---------\r\n\r\nCo-authored-by: Ilya Topilskii <ilya@pixelpoint.io>\r\nCo-authored-by: Ilya Topilskii <iatopilskii@gmail.com>',
      author: {
        identity: {
          name: 'Nick Bazarov',
          email: 'mr.nik.bazarov@gmail.com'
        },
        when: '2024-12-04T13:05:56+03:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-04T18:05:56+08:00'
      },
      stats: {
        total: {
          insertions: 6596,
          deletions: 3427,
          changes: 10023
        },
        files: [
          {
            path: 'packages/ui/src/views/auth/components/animated-harness-logo.tsx',
            status: 'ADDED',
            insertions: 60,
            deletions: 0,
            changes: 60
          },
          {
            path: 'packages/views/src/components/pull-request/pull-request-diff-viewer.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/src/components/card.tsx',
            status: 'ADDED',
            insertions: 82,
            deletions: 0,
            changes: 82
          },
          {
            path: 'packages/ui/src/components/form-error-message.tsx',
            status: 'ADDED',
            insertions: 37,
            deletions: 0,
            changes: 37
          },
          {
            path: 'packages/ui/src/views/auth/components/agreements.tsx',
            status: 'ADDED',
            insertions: 24,
            deletions: 0,
            changes: 24
          },
          {
            path: 'apps/gitness/src/pages-v2/signin.tsx',
            status: 'ADDED',
            insertions: 46,
            deletions: 0,
            changes: 46
          },
          {
            path: 'packages/canary/src/index.ts',
            status: 'MODIFIED',
            insertions: 0,
            deletions: 2,
            changes: 2
          },
          {
            path: 'packages/ui/src/components/filters/filters-bar/sorts.tsx',
            status: 'MODIFIED',
            insertions: 12,
            deletions: 12,
            changes: 24
          },
          {
            path: 'packages/ui/src/components/input-otp.tsx',
            status: 'ADDED',
            insertions: 66,
            deletions: 0,
            changes: 66
          },
          {
            path: 'packages/ui/src/styles.css',
            status: 'MODIFIED',
            insertions: 24,
            deletions: 0,
            changes: 24
          },
          {
            path: 'packages/ui/src/views/auth/index.ts',
            status: 'ADDED',
            insertions: 5,
            deletions: 0,
            changes: 5
          },
          {
            path: 'packages/ui/src/views/auth/new-password-page.tsx',
            status: 'ADDED',
            insertions: 141,
            deletions: 0,
            changes: 141
          },
          {
            path: 'packages/ui/src/views/layouts/Floating1ColumnLayout.tsx',
            status: 'ADDED',
            insertions: 110,
            deletions: 0,
            changes: 110
          },
          {
            path: 'packages/canary/src/components/input-otp.tsx',
            status: 'DELETED',
            insertions: 0,
            deletions: 72,
            changes: 72
          },
          {
            path: 'packages/ui/src/components/calendar.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/views/src/components/otp-page.tsx',
            status: 'MODIFIED',
            insertions: 7,
            deletions: 9,
            changes: 16
          },
          {
            path: 'packages/views/src/layouts/PullRequestLayout.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/tailwind.ts',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 1,
            changes: 3
          },
          {
            path: 'packages/views/src/components/new-password-page.tsx',
            status: 'MODIFIED',
            insertions: 15,
            deletions: 9,
            changes: 24
          },
          {
            path: 'packages/ui/src/views/auth/signin-page.tsx',
            status: 'ADDED',
            insertions: 148,
            deletions: 0,
            changes: 148
          },
          {
            path: 'packages/ui/src/components/filters/filters-bar/filters.tsx',
            status: 'MODIFIED',
            insertions: 9,
            deletions: 8,
            changes: 17
          },
          {
            path: 'packages/ui/src/components/spacer.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 2,
            changes: 3
          },
          {
            path: 'packages/ui/src/components/text.tsx',
            status: 'MODIFIED',
            insertions: 4,
            deletions: 2,
            changes: 6
          },
          {
            path: 'packages/views/src/index.ts',
            status: 'MODIFIED',
            insertions: 0,
            deletions: 1,
            changes: 1
          },
          {
            path: 'apps/gitness/src/pages-v2/signup.tsx',
            status: 'ADDED',
            insertions: 35,
            deletions: 0,
            changes: 35
          },
          {
            path: 'packages/canary/src/components/card.tsx',
            status: 'DELETED',
            insertions: 0,
            deletions: 75,
            changes: 75
          },
          {
            path: 'packages/ui/src/components/dialog.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 3,
            changes: 5
          },
          {
            path: 'packages/ui/src/components/dropdown-menu.tsx',
            status: 'MODIFIED',
            insertions: 4,
            deletions: 4,
            changes: 8
          },
          {
            path: 'packages/ui/src/components/input.tsx',
            status: 'MODIFIED',
            insertions: 74,
            deletions: 62,
            changes: 136
          },
          {
            path: 'packages/ui/src/views/auth/forgot-password-page.tsx',
            status: 'ADDED',
            insertions: 127,
            deletions: 0,
            changes: 127
          },
          {
            path: 'apps/gitness/src/App.tsx',
            status: 'MODIFIED',
            insertions: 33,
            deletions: 6,
            changes: 39
          },
          {
            path: 'packages/ui/src/components/control-group.tsx',
            status: 'ADDED',
            insertions: 20,
            deletions: 0,
            changes: 20
          },
          {
            path: 'packages/ui/src/components/label.tsx',
            status: 'MODIFIED',
            insertions: 31,
            deletions: 11,
            changes: 42
          },
          {
            path: 'packages/ui/src/components/pagination.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 1,
            changes: 3
          },
          {
            path: 'packages/ui/src/views/auth/signup-page.tsx',
            status: 'ADDED',
            insertions: 182,
            deletions: 0,
            changes: 182
          },
          {
            path: 'packages/views/src/components/create-project-page.tsx',
            status: 'MODIFIED',
            insertions: 13,
            deletions: 4,
            changes: 17
          },
          {
            path: 'packages/views/src/components/forgot-password-page.tsx',
            status: 'MODIFIED',
            insertions: 14,
            deletions: 6,
            changes: 20
          },
          {
            path: 'packages/views/src/components/pull-request/pull-request-timeline-item.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 1,
            changes: 3
          },
          {
            path: 'packages/ui/src/components/badge.tsx',
            status: 'MODIFIED',
            insertions: 8,
            deletions: 9,
            changes: 17
          },
          {
            path: 'packages/ui/src/components/button.tsx',
            status: 'MODIFIED',
            insertions: 7,
            deletions: 6,
            changes: 13
          },
          {
            path: 'packages/views/src/components/signup-page.tsx',
            status: 'MODIFIED',
            insertions: 7,
            deletions: 16,
            changes: 23
          },
          {
            path: 'pnpm-lock.yaml',
            status: 'MODIFIED',
            insertions: 5054,
            deletions: 3063,
            changes: 8117
          },
          {
            path: 'packages/ui/src/views/index.ts',
            status: 'MODIFIED',
            insertions: 4,
            deletions: 0,
            changes: 4
          },
          {
            path: 'packages/views/src/components/signin-page.tsx',
            status: 'MODIFIED',
            insertions: 15,
            deletions: 9,
            changes: 24
          },
          {
            path: 'packages/views/src/layouts/Floating1ColumnLayout.tsx',
            status: 'DELETED',
            insertions: 0,
            deletions: 30,
            changes: 30
          },
          {
            path: 'packages/ui/src/components/index.ts',
            status: 'MODIFIED',
            insertions: 4,
            deletions: 0,
            changes: 4
          },
          {
            path: 'packages/ui/src/views/auth/otp-page.tsx',
            status: 'ADDED',
            insertions: 162,
            deletions: 0,
            changes: 162
          }
        ]
      }
    },
    {
      sha: '43a0ad58aaeeb4d3313f2f529788fb899ce23ddc',
      parent_shas: ['568ce590d6a8b940a4536534bebb4eeef83a9f00'],
      title: 'feat: [pipe-22241: fix comments from last pr- webhook list page (#509)',
      message:
        'feat: [pipe-22241: fix comments from last pr- webhook list page (#509)\n\n* feat: [pipe-22241: fix comments from last pr- webhook list page\r\n\r\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\n\r\n* feat: [pipe-22241: fix comments from last pr- webhook list page\r\n\r\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\n\r\n---------\r\n\r\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\nCo-authored-by: Calvin Lee <cjlee@ualberta.ca>',
      author: {
        identity: {
          name: 'Calvin Lee',
          email: 'calvin.lee@harness.io'
        },
        when: '2024-12-03T14:24:29-07:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-03T14:24:29-07:00'
      },
      stats: {
        total: {
          insertions: 1423,
          deletions: 154,
          changes: 1577
        },
        files: [
          {
            path: 'packages/ui/src/views/pull-request/compare/components/pull-request-compare-form.tsx',
            status: 'ADDED',
            insertions: 71,
            deletions: 0,
            changes: 71
          },
          {
            path: 'packages/ui/src/views/pull-request/compare/components/pull-request-compare-tab-trigger-item.tsx',
            status: 'ADDED',
            insertions: 32,
            deletions: 0,
            changes: 32
          },
          {
            path: 'packages/ui/src/components/form-field-set.tsx',
            status: 'ADDED',
            insertions: 188,
            deletions: 0,
            changes: 188
          },
          {
            path: 'packages/ui/src/views/layouts/PullRequestCompareLayout.tsx',
            status: 'ADDED',
            insertions: 402,
            deletions: 0,
            changes: 402
          },
          {
            path: 'packages/ui/src/views/pull-request/utils.ts',
            status: 'MODIFIED',
            insertions: 22,
            deletions: 0,
            changes: 22
          },
          {
            path: 'packages/ui/src/components/radio-group.tsx',
            status: 'ADDED',
            insertions: 36,
            deletions: 0,
            changes: 36
          },
          {
            path: 'packages/ui/src/components/branch-chooser.tsx',
            status: 'ADDED',
            insertions: 64,
            deletions: 0,
            changes: 64
          },
          {
            path: 'packages/ui/src/views/pull-request/hooks/useDiffConfig.ts',
            status: 'ADDED',
            insertions: 69,
            deletions: 0,
            changes: 69
          },
          {
            path: 'pnpm-lock.yaml',
            status: 'MODIFIED',
            insertions: 365,
            deletions: 152,
            changes: 517
          },
          {
            path: 'packages/ui/package.json',
            status: 'MODIFIED',
            insertions: 5,
            deletions: 0,
            changes: 5
          },
          {
            path: 'packages/ui/src/views/layouts/layout.tsx',
            status: 'ADDED',
            insertions: 22,
            deletions: 0,
            changes: 22
          },
          {
            path: 'packages/ui/src/views/pull-request/compare/components/pull-request-compare-button.tsx',
            status: 'ADDED',
            insertions: 96,
            deletions: 0,
            changes: 96
          },
          {
            path: 'packages/ui/src/views/pull-request/types.ts',
            status: 'MODIFIED',
            insertions: 49,
            deletions: 0,
            changes: 49
          },
          {
            path: 'packages/views/src/layouts/types.ts',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/src/views/index.ts',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          }
        ]
      }
    },
    {
      sha: '568ce590d6a8b940a4536534bebb4eeef83a9f00',
      parent_shas: ['7a93efe86c1361ae801d3f2d292a84befd9b1b19'],
      title: 'Externalize summary/files page (#511)',
      message:
        'Externalize summary/files page (#511)\n\n* feat: continue externalization on summary/files\n\n* feat: translate summary/files e2e\n\n* fix: lint issues\n\n* chore: remove comments',
      author: {
        identity: {
          name: 'Sanskar',
          email: 'c_sanskar.sehgal@harness.io'
        },
        when: '2024-12-03T12:45:19-08:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-03T12:45:19-08:00'
      },
      stats: {
        total: {
          insertions: 148,
          deletions: 48,
          changes: 196
        },
        files: [
          {
            path: 'packages/ui/locales/fr/views.json',
            status: 'MODIFIED',
            insertions: 18,
            deletions: 5,
            changes: 23
          },
          {
            path: 'packages/ui/src/views/repo/repo-files/index.tsx',
            status: 'MODIFIED',
            insertions: 7,
            deletions: 4,
            changes: 11
          },
          {
            path: 'packages/ui/src/views/repo/repo-summary/repo-summary.tsx',
            status: 'MODIFIED',
            insertions: 22,
            deletions: 11,
            changes: 33
          },
          {
            path: 'packages/ui/locales/fr/component.json',
            status: 'MODIFIED',
            insertions: 4,
            deletions: 0,
            changes: 4
          },
          {
            path: 'packages/ui/locales/es/views.json',
            status: 'MODIFIED',
            insertions: 15,
            deletions: 2,
            changes: 17
          },
          {
            path: 'packages/ui/src/views/repo/components/branch-selector/branch-selector-dropdown.tsx',
            status: 'MODIFIED',
            insertions: 19,
            deletions: 11,
            changes: 30
          },
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-sidebar.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 0,
            changes: 2
          },
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-summary.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 0,
            changes: 2
          },
          {
            path: 'packages/ui/locales/en/component.json',
            status: 'MODIFIED',
            insertions: 4,
            deletions: 0,
            changes: 4
          },
          {
            path: 'packages/ui/locales/es/component.json',
            status: 'MODIFIED',
            insertions: 4,
            deletions: 0,
            changes: 4
          },
          {
            path: 'packages/ui/src/views/repo/repo-sidebar/index.tsx',
            status: 'MODIFIED',
            insertions: 10,
            deletions: 3,
            changes: 13
          },
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-code.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 0,
            changes: 2
          },
          {
            path: 'packages/ui/src/components/search-files.tsx',
            status: 'MODIFIED',
            insertions: 11,
            deletions: 3,
            changes: 14
          },
          {
            path: 'packages/ui/src/views/repo/components/branch-selector/branch-selector.tsx',
            status: 'MODIFIED',
            insertions: 5,
            deletions: 1,
            changes: 6
          },
          {
            path: 'packages/ui/src/views/repo/components/summary/summary.tsx',
            status: 'MODIFIED',
            insertions: 8,
            deletions: 6,
            changes: 14
          },
          {
            path: 'packages/ui/locales/en/views.json',
            status: 'MODIFIED',
            insertions: 15,
            deletions: 2,
            changes: 17
          }
        ]
      }
    },
    {
      sha: '7a93efe86c1361ae801d3f2d292a84befd9b1b19',
      parent_shas: ['ec92d11cdfecb96917956cb95e0ac91f2eeede12'],
      title: 'feat: minor styling improvements (#503)',
      message:
        'feat: minor styling improvements (#503)\n\nfeat: minor styling improvements\r\n\r\nfix: minor changes\r\n\r\nchore: roll back changes',
      author: {
        identity: {
          name: 'Andrew Golovanov',
          email: 'spacewebdeveloper@gmail.com'
        },
        when: '2024-12-03T20:19:28+03:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-03T09:19:28-08:00'
      },
      stats: {
        total: {
          insertions: 23,
          deletions: 33,
          changes: 56
        },
        files: [
          {
            path: 'packages/ui/src/components/button.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/src/components/dropdown-menu.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          },
          {
            path: 'packages/ui/src/components/tabs.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 2,
            changes: 4
          },
          {
            path: 'packages/ui/src/views/repo/components/branch-selector/branch-selector-dropdown.tsx',
            status: 'MODIFIED',
            insertions: 9,
            deletions: 15,
            changes: 24
          },
          {
            path: 'packages/ui/src/views/repo/repo-summary/components/summary-panel.tsx',
            status: 'MODIFIED',
            insertions: 10,
            deletions: 14,
            changes: 24
          }
        ]
      }
    },
    {
      sha: 'ec92d11cdfecb96917956cb95e0ac91f2eeede12',
      parent_shas: ['751ca0820f5848d420230339e0a6b823c9956d54'],
      title: 'fix: branch/gitRef normalization from routes (#505)',
      message: 'fix: branch/gitRef normalization from routes (#505)',
      author: {
        identity: {
          name: 'Shaurya Kalia',
          email: '113332561+shaurya-harness@users.noreply.github.com'
        },
        when: '2024-12-03T14:25:26+05:30'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-03T14:25:26+05:30'
      },
      stats: {
        total: {
          insertions: 57,
          deletions: 32,
          changes: 89
        },
        files: [
          {
            path: 'apps/gitness/src/App.tsx',
            status: 'MODIFIED',
            insertions: 10,
            deletions: 0,
            changes: 10
          },
          {
            path: 'apps/gitness/src/components/FileExplorer.tsx',
            status: 'MODIFIED',
            insertions: 5,
            deletions: 4,
            changes: 9
          },
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-code.tsx',
            status: 'MODIFIED',
            insertions: 20,
            deletions: 12,
            changes: 32
          },
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-sidebar.tsx',
            status: 'MODIFIED',
            insertions: 19,
            deletions: 13,
            changes: 32
          },
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-summary.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 2,
            changes: 4
          },
          {
            path: 'packages/ui/src/views/repo/repo-summary/repo-summary.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          }
        ]
      }
    },
    {
      sha: '751ca0820f5848d420230339e0a6b823c9956d54',
      parent_shas: ['efc850e26a7c02664431ef93b9ca15f07d074664'],
      title: 'feat: [pipe-20761]: add webhook list page (#495)',
      message:
        'feat: [pipe-20761]: add webhook list page (#495)\n\n* feat: [pipe-20761]: add webhook list page\r\n\r\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\n\r\n* feat: [pipe-20761]: add webhook list page\r\n\r\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\n\r\n* feat: [pipe-20716]: fix comments from last pr- webhook list page\r\n\r\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\n\r\n* feat: [pipe-20716]: fix comments from last pr- webhook list page\r\n\r\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\n\r\n* feat: [pipe-20716]: fix comments from last pr- webhook list page\r\n\r\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\n\r\n* feat: [pipe-22241: fix comments from last pr- webhook list page\r\n\r\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\n\r\n---------\r\n\r\nSigned-off-by: Calvin Lee <cjlee@ualberta.ca>\r\nCo-authored-by: Calvin Lee <cjlee@ualberta.ca>',
      author: {
        identity: {
          name: 'Calvin Lee',
          email: 'calvin.lee@harness.io'
        },
        when: '2024-12-02T23:29:04-07:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-02T23:29:04-07:00'
      },
      stats: {
        total: {
          insertions: 803,
          deletions: 2,
          changes: 805
        },
        files: [
          {
            path: 'apps/gitness/src/App.tsx',
            status: 'MODIFIED',
            insertions: 5,
            deletions: 0,
            changes: 5
          },
          {
            path: 'apps/gitness/src/pages-v2/webhooks/webhook-list.tsx',
            status: 'ADDED',
            insertions: 84,
            deletions: 0,
            changes: 84
          },
          {
            path: 'apps/gitness/src/utils/error-utils.ts',
            status: 'ADDED',
            insertions: 4,
            deletions: 0,
            changes: 4
          },
          {
            path: 'packages/ui/src/views/index.ts',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 0,
            changes: 3
          },
          {
            path: 'packages/ui/src/views/pull-request/index.ts',
            status: 'ADDED',
            insertions: 2,
            deletions: 0,
            changes: 2
          },
          {
            path: 'packages/ui/src/views/webhooks/index.ts',
            status: 'ADDED',
            insertions: 3,
            deletions: 0,
            changes: 3
          },
          {
            path: 'packages/ui/src/views/webhooks/webhook-list/repo-webhook-list-page.tsx',
            status: 'ADDED',
            insertions: 491,
            deletions: 0,
            changes: 491
          },
          {
            path: 'packages/ui/src/views/webhooks/webhook-list/types.ts',
            status: 'ADDED',
            insertions: 68,
            deletions: 0,
            changes: 68
          },
          {
            path: 'apps/gitness/src/pages-v2/webhooks/stores/webhook-store.tsx',
            status: 'ADDED',
            insertions: 32,
            deletions: 0,
            changes: 32
          },
          {
            path: 'packages/ui/src/views/repo/repo-list/repo-list-page.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 2,
            changes: 3
          },
          {
            path: 'packages/ui/src/views/webhooks/webhook-list/repo-webhook-list.tsx',
            status: 'ADDED',
            insertions: 110,
            deletions: 0,
            changes: 110
          }
        ]
      }
    },
    {
      sha: 'efc850e26a7c02664431ef93b9ca15f07d074664',
      parent_shas: ['3db9b7c4c6de7835cec3441c8383725f16eda254'],
      title: 'Update recent links feature to the root and sandbox component (#502)',
      message:
        'Update recent links feature to the root and sandbox component (#502)\n\n* recent links\r\n\r\n* Update recent links feature to the root and sandbox component\r\n\r\n* Fix type issue\r\n\r\n* Fix edge cases\r\n\r\n* Update type in gitness from components package\r\n\r\n* Update test changes\r\n\r\n* Remove unused package styles',
      author: {
        identity: {
          name: 'praneshg239',
          email: '95267551+praneshg239@users.noreply.github.com'
        },
        when: '2024-12-03T11:21:32+05:30'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-03T11:21:32+05:30'
      },
      stats: {
        total: {
          insertions: 107,
          deletions: 36,
          changes: 143
        },
        files: [
          {
            path: 'packages/ui/src/components/app-sidebar/types.ts',
            status: 'MODIFIED',
            insertions: 6,
            deletions: 4,
            changes: 10
          },
          {
            path: 'packages/ui/src/views/layouts/SandboxRoot.tsx',
            status: 'MODIFIED',
            insertions: 39,
            deletions: 21,
            changes: 60
          },
          {
            path: 'packages/ui/.gitignore',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 0,
            changes: 2
          },
          {
            path: 'packages/ui/src/components/index.ts',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 0,
            changes: 2
          },
          {
            path: 'packages/ui/src/components/app-sidebar/index.tsx',
            status: 'MODIFIED',
            insertions: 5,
            deletions: 3,
            changes: 8
          },
          {
            path: 'packages/ui/src/components/app-sidebar/navbar-item/index.tsx',
            status: 'MODIFIED',
            insertions: 4,
            deletions: 3,
            changes: 7
          },
          {
            path: 'packages/ui/src/hooks/useLocationChange.tsx',
            status: 'ADDED',
            insertions: 28,
            deletions: 0,
            changes: 28
          },
          {
            path: 'packages/ui/src/types/index.ts',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 0,
            changes: 2
          },
          {
            path: 'apps/gitness/src/components/RootWrapper.tsx',
            status: 'MODIFIED',
            insertions: 18,
            deletions: 4,
            changes: 22
          },
          {
            path: 'packages/ui/src/components/manage-navigation/index.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 1,
            changes: 2
          }
        ]
      }
    },
    {
      sha: '3db9b7c4c6de7835cec3441c8383725f16eda254',
      parent_shas: ['ba6ab3b037a0d5193085e96ff51b1651d440a434'],
      title: 'Handled loading and error states in view (#508)',
      message: 'Handled loading and error states in view (#508)',
      author: {
        identity: {
          name: 'vivek-harness',
          email: 'c_vivek.patel@harness.io'
        },
        when: '2024-12-02T16:56:19-08:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-02T16:56:19-08:00'
      },
      stats: {
        total: {
          insertions: 94,
          deletions: 73,
          changes: 167
        },
        files: [
          {
            path: 'packages/ui/src/views/repo/repo-list/types.ts',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 0,
            changes: 3
          },
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-list.tsx',
            status: 'MODIFIED',
            insertions: 9,
            deletions: 14,
            changes: 23
          },
          {
            path: 'packages/ui/src/views/repo/repo-list/repo-list-page.tsx',
            status: 'MODIFIED',
            insertions: 20,
            deletions: 1,
            changes: 21
          },
          {
            path: 'packages/ui/src/views/repo/repo-list/repo-list.tsx',
            status: 'MODIFIED',
            insertions: 62,
            deletions: 58,
            changes: 120
          }
        ]
      }
    },
    {
      sha: 'ba6ab3b037a0d5193085e96ff51b1651d440a434',
      parent_shas: ['534ee483e4a835f8ef1849070e68e86cdbf44d81'],
      title: 'Integrate 18n store (#507)',
      message: 'Integrate 18n store (#507)\n\n* feat: add i18n store\r\n\r\n* feat: translate repo-nav',
      author: {
        identity: {
          name: 'Sanskar',
          email: 'c_sanskar.sehgal@harness.io'
        },
        when: '2024-12-02T16:06:45-08:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-02T16:06:45-08:00'
      },
      stats: {
        total: {
          insertions: 75,
          deletions: 39,
          changes: 114
        },
        files: [
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-list.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 3,
            changes: 5
          },
          {
            path: 'apps/gitness/src/pages/profile-settings/profile-settings-general-page.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 1,
            changes: 3
          },
          {
            path: 'packages/ui/locales/es/views.json',
            status: 'MODIFIED',
            insertions: 8,
            deletions: 0,
            changes: 8
          },
          {
            path: 'packages/ui/src/views/repo/repo-list/types.ts',
            status: 'MODIFIED',
            insertions: 8,
            deletions: 2,
            changes: 10
          },
          {
            path: 'apps/gitness/src/i18n/i18n.ts',
            status: 'MODIFIED',
            insertions: 0,
            deletions: 21,
            changes: 21
          },
          {
            path: 'apps/gitness/src/i18n/stores/i18n-store.ts',
            status: 'ADDED',
            insertions: 23,
            deletions: 0,
            changes: 23
          },
          {
            path: 'packages/ui/locales/fr/views.json',
            status: 'MODIFIED',
            insertions: 8,
            deletions: 0,
            changes: 8
          },
          {
            path: 'packages/ui/src/views/repo/repo-layout/index.tsx',
            status: 'MODIFIED',
            insertions: 11,
            deletions: 10,
            changes: 21
          },
          {
            path: 'packages/ui/src/views/repo/repo-list/repo-list-page.tsx',
            status: 'MODIFIED',
            insertions: 2,
            deletions: 1,
            changes: 3
          },
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-layout.tsx',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 1,
            changes: 4
          },
          {
            path: 'packages/ui/locales/en/views.json',
            status: 'MODIFIED',
            insertions: 8,
            deletions: 0,
            changes: 8
          }
        ]
      }
    },
    {
      sha: '534ee483e4a835f8ef1849070e68e86cdbf44d81',
      parent_shas: ['6cb94d41b86272145ed3c5e1eade9b86e6c55de3'],
      title: 'Add i18n to repo-list page (#506)',
      message:
        'Add i18n to repo-list page (#506)\n\n* rebase\r\n\r\n* feat: add translation to filters\r\n\r\n* chore: fix config\r\n\r\n* chore: remove unused imports, comments\r\n\r\n* feat: add translations to navbar\r\n\r\n* feat: add translations to user list\r\n\r\n* chore: remove comments',
      author: {
        identity: {
          name: 'Sanskar',
          email: 'c_sanskar.sehgal@harness.io'
        },
        when: '2024-12-02T15:24:33-08:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-02T15:24:33-08:00'
      },
      stats: {
        total: {
          insertions: 338,
          deletions: 136,
          changes: 474
        },
        files: [
          {
            path: 'packages/ui/locales/fr/component.json',
            status: 'MODIFIED',
            insertions: 45,
            deletions: 2,
            changes: 47
          },
          {
            path: 'packages/ui/src/components/app-sidebar/data.ts',
            status: 'MODIFIED',
            insertions: 13,
            deletions: 9,
            changes: 22
          },
          {
            path: 'packages/ui/src/components/app-sidebar/navbar-user/index.tsx',
            status: 'MODIFIED',
            insertions: 5,
            deletions: 2,
            changes: 7
          },
          {
            path: 'packages/ui/src/views/repo/repo-list/filter-options.ts',
            status: 'ADDED',
            insertions: 85,
            deletions: 0,
            changes: 85
          },
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-list.tsx',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 1,
            changes: 4
          },
          {
            path: 'packages/ui/locales/en/component.json',
            status: 'MODIFIED',
            insertions: 44,
            deletions: 1,
            changes: 45
          },
          {
            path: 'packages/ui/locales/index.ts',
            status: 'MODIFIED',
            insertions: 11,
            deletions: 3,
            changes: 14
          },
          {
            path: 'packages/ui/src/components/filters/filter-trigger.tsx',
            status: 'MODIFIED',
            insertions: 15,
            deletions: 10,
            changes: 25
          },
          {
            path: 'packages/ui/src/views/layouts/SandboxRoot.tsx',
            status: 'MODIFIED',
            insertions: 1,
            deletions: 0,
            changes: 1
          },
          {
            path: 'packages/ui/locales/es/views.json',
            status: 'ADDED',
            insertions: 7,
            deletions: 0,
            changes: 7
          },
          {
            path: 'packages/ui/locales/fr/views.json',
            status: 'ADDED',
            insertions: 7,
            deletions: 0,
            changes: 7
          },
          {
            path: 'packages/ui/src/components/filters/filters.tsx',
            status: 'MODIFIED',
            insertions: 7,
            deletions: 1,
            changes: 8
          },
          {
            path: 'packages/ui/src/components/app-sidebar/index.tsx',
            status: 'MODIFIED',
            insertions: 7,
            deletions: 4,
            changes: 11
          },
          {
            path: 'packages/ui/src/views/repo/repo-list/repo-list-page.tsx',
            status: 'MODIFIED',
            insertions: 17,
            deletions: 98,
            changes: 115
          },
          {
            path: 'packages/ui/src/views/repo/repo-list/types.ts',
            status: 'MODIFIED',
            insertions: 3,
            deletions: 0,
            changes: 3
          },
          {
            path: 'packages/ui/locales/en/views.json',
            status: 'ADDED',
            insertions: 7,
            deletions: 0,
            changes: 7
          },
          {
            path: 'packages/ui/src/components/filters/filters-bar/filters-bar.tsx',
            status: 'MODIFIED',
            insertions: 8,
            deletions: 3,
            changes: 11
          },
          {
            path: 'packages/ui/locales/es/component.json',
            status: 'MODIFIED',
            insertions: 44,
            deletions: 1,
            changes: 45
          },
          {
            path: 'packages/ui/vite.config.ts',
            status: 'MODIFIED',
            insertions: 9,
            deletions: 1,
            changes: 10
          }
        ]
      }
    },
    {
      sha: '6cb94d41b86272145ed3c5e1eade9b86e6c55de3',
      parent_shas: ['29890fac84cbd16a816c35da2cd737be78b37e2e'],
      title: 'Fixed NoData flicker while loading repo list (#492)',
      message:
        'Fixed NoData flicker while loading repo list (#492)\n\n* Fixed NoData flickr while loading repo list\r\n\r\n* Removed skeleton-list since it got added as skeleton in ui\r\n\r\n* Used skeleton instead of skeleton-list\r\n\r\n* Prettier formatting\r\n\r\n* Removed harness-oss and harness-oss-fs\r\n\r\n* Removed playground styles.css from public\r\n\r\n* Fixed skeleton styles changed due to merge conflict\r\n\r\n* Used skeleton-list in repo-list page',
      author: {
        identity: {
          name: 'vivek-harness',
          email: 'c_vivek.patel@harness.io'
        },
        when: '2024-12-02T10:14:55-08:00'
      },
      committer: {
        identity: {
          name: 'GitHub',
          email: 'noreply@github.com'
        },
        when: '2024-12-02T10:14:55-08:00'
      },
      stats: {
        total: {
          insertions: 20,
          deletions: 1,
          changes: 21
        },
        files: [
          {
            path: 'apps/gitness/src/pages-v2/repo/repo-list.tsx',
            status: 'MODIFIED',
            insertions: 20,
            deletions: 1,
            changes: 21
          }
        ]
      }
    }
  ]
}
