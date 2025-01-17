import {
  DiffFileEntry,
  EnumPrincipalType,
  EnumPullReqState,
  TypesPullReqActivity,
  TypesRuleViolations
} from '@harnessio/ui/views'

export const pullRequestProviderStore = {
  repoMetadata: {
    id: 44,
    parent_id: 23,
    identifier: 'new',
    path: 'test666/new',
    description:
      'dsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsad',
    created_by: 22,
    created: 1736976067249,
    updated: 1737044851126,
    size: 332,
    size_updated: 1737011331966,
    default_branch: 'main',
    fork_id: 0,
    num_forks: 0,
    num_pulls: 1,
    num_closed_pulls: 0,
    num_open_pulls: 1,
    num_merged_pulls: 0,
    state: 0,
    git_url: 'http://localhost:3000/git/test666/new.git',
    git_ssh_url: 'ssh://git@localhost:2222/test666/new.git',
    is_public: true,
    importing: false,
    uid: 'new'
  },
  pullReqMetadata: {
    number: 1,
    created: 1737044851123,
    updated: 1737045007201,
    edited: 1737045007201,
    state: 'open' as EnumPullReqState,
    is_draft: false,
    title: 'Create cxzcxczx.txt',
    description: '',
    source_repo_id: 44,
    source_branch: 'dsad',
    source_sha: 'c59260ea5656e3e831b2d06a6524ad03c9f1ca9a',
    target_repo_id: 44,
    target_branch: 'main',

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
  pullReqStats: {
    commits: 2,
    files_changed: 2,
    additions: 2,
    deletions: 0,
    conversations: 3,
    unresolved_count: 3
  },
  pullReqCommits: {
    commits: [
      {
        sha: 'c59260ea5656e3e831b2d06a6524ad03c9f1ca9a',
        parent_shas: ['bf28bf043ef81c642a57b44b1b276e2eba4001fa'],
        title: 'Create gfdgfdgfdgfdg.txt',
        message: 'Create gfdgfdgfdgfdg.txt',
        author: {
          identity: {
            name: 'test1234',
            email: 'test1234@harness.io'
          },
          when: '2025-01-15T14:35:50-07:00'
        },
        committer: {
          identity: {
            name: 'Gitness',
            email: 'system@gitness.io'
          },
          when: '2025-01-15T14:35:50-07:00'
        }
      },
      {
        sha: 'bf28bf043ef81c642a57b44b1b276e2eba4001fa',
        parent_shas: ['0e5ec7a99e6a6d6dfc2781bd6834c0581f3361ca'],
        title: 'Create cxzcxczx.txt',
        message: 'Create cxzcxczx.txt',
        author: {
          identity: {
            name: 'test1234',
            email: 'test1234@harness.io'
          },
          when: '2025-01-15T14:35:30-07:00'
        },
        committer: {
          identity: {
            name: 'Gitness',
            email: 'system@gitness.io'
          },
          when: '2025-01-15T14:35:30-07:00'
        }
      }
    ],
    rename_details: [],
    total_commits: 2
  },
  pullReqActivities: [
    {
      id: 759,
      created: 1737044855598,
      updated: 1737044855598,
      edited: 1737044855598,
      parent_id: null,
      repo_id: 44,
      pullreq_id: 163,
      order: 1,
      sub_order: 0,
      type: 'comment',
      kind: 'comment',
      text: 's',
      payload: {},
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user',
        created: 1699863416002,
        updated: 1699863416002
      }
    },
    {
      id: 760,
      created: 1737044857799,
      updated: 1737044857799,
      edited: 1737044857799,
      parent_id: null,
      repo_id: 44,
      pullreq_id: 163,
      order: 2,
      sub_order: 0,
      type: 'comment',
      kind: 'comment',
      text: 'a',
      payload: {},
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user',
        created: 1699863416002,
        updated: 1699863416002
      }
    },
    {
      id: 761,
      created: 1737045007200,
      updated: 1737045007200,
      edited: 1737045007200,
      parent_id: null,
      repo_id: 44,
      pullreq_id: 163,
      order: 3,
      sub_order: 0,
      type: 'code-comment',
      kind: 'change-comment',
      text: 'ddd',
      payload: {
        title: '@@ -0,0 +1 @@',
        lines: ['+gfdgfdg'],
        line_start_new: true,
        line_end_new: true
      },
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user',
        created: 1699863416002,
        updated: 1699863416002
      },
      code_comment: {
        outdated: false,
        merge_base_sha: '0e5ec7a99e6a6d6dfc2781bd6834c0581f3361ca',
        source_sha: 'c59260ea5656e3e831b2d06a6524ad03c9f1ca9a',
        path: 'cxzcxczx.txt',
        line_new: 1,
        span_new: 1,
        line_old: 0,
        span_old: 0
      }
    }
  ] as TypesPullReqActivity[],
  loading: false,
  error: null,
  pullReqChecksDecision: {
    count: {
      error: 0,
      failure: 0,
      pending: 0,
      running: 0,
      success: 0,
      skipped: 0,
      killed: 0
    },
    error: null,
    data: {
      commit_sha: 'c59260ea5656e3e831b2d06a6524ad03c9f1ca9a',
      checks: null
    },
    color: 'GREEN_500',
    background: 'GREEN_50',
    message: '',
    checkInfo: {
      title: '',
      content: '',
      color: '',
      status: ''
    },
    summaryText: ''
  },
  showEditDescription: false,
  diffs: [
    {
      blocks: [
        {
          lines: [
            {
              content: '+gfdgfdg',
              type: 'insert',
              newNumber: 1
            }
          ],
          oldStartLine: 0,
          oldStartLine2: null,
          newStartLine: 1,
          header: '@@ -0,0 +1 @@'
        }
      ],
      deletedLines: 0,
      addedLines: 1,
      isGitDiff: true,
      newFileMode: '100644',
      isNew: true,
      checksumBefore: '0000000000000000000000000000000000000000',
      checksumAfter: '31a26d5db74951582e90d0620bc917eda0a77080',
      oldName: '/dev/null',
      language: 'txt',
      newName: 'cxzcxczx.txt',
      isCombined: false,
      containerId: 'container-/dev/null::::cxzcxczx.txt',
      contentId: 'content-/dev/null::::cxzcxczx.txt',
      fileId: '/dev/null::::cxzcxczx.txt',
      filePath: 'cxzcxczx.txt',
      fileViews: {
        has: () => {
          return false
        }
      },
      raw: 'diff --git a/cxzcxczx.txt b/cxzcxczx.txt\nnew file mode 100644\nindex 0000000000000000000000000000000000000000..31a26d5db74951582e90d0620bc917eda0a77080\n--- /dev/null\n+++ b/cxzcxczx.txt\n@@ -0,0 +1 @@\n+gfdgfdg\n\\ No newline at end of file\n'
    },
    {
      blocks: [
        {
          lines: [
            {
              content: '+ghfdgfdgfdg',
              type: 'insert',
              newNumber: 1
            }
          ],
          oldStartLine: 0,
          oldStartLine2: null,
          newStartLine: 1,
          header: '@@ -0,0 +1 @@'
        }
      ],
      deletedLines: 0,
      addedLines: 1,
      isGitDiff: true,
      newFileMode: '100644',
      isNew: true,
      checksumBefore: '0000000000000000000000000000000000000000',
      checksumAfter: '857f1f0597bf3e56b26d76db3d816911d0f0a3c7',
      oldName: '/dev/null',
      language: 'txt',
      newName: 'gfdgfdgfdgfdg.txt',
      isCombined: false,
      containerId: 'container-/dev/null::::gfdgfdgfdgfdg.txt',
      contentId: 'content-/dev/null::::gfdgfdgfdgfdg.txt',
      fileId: '/dev/null::::gfdgfdgfdgfdg.txt',
      filePath: 'gfdgfdgfdgfdg.txt',
      fileViews: {
        has: () => {
          return false
        }
      },
      raw: 'diff --git a/gfdgfdgfdgfdg.txt b/gfdgfdgfdgfdg.txt\nnew file mode 100644\nindex 0000000000000000000000000000000000000000..857f1f0597bf3e56b26d76db3d816911d0f0a3c7\n--- /dev/null\n+++ b/gfdgfdgfdgfdg.txt\n@@ -0,0 +1 @@\n+ghfdgfdgfdg\n\\ No newline at end of file\n'
    }
  ] as unknown as DiffFileEntry[],
  prPanelData: {
    ruleViolation: true,
    ruleViolationArr: {
      data: {
        rule_violations: [
          {
            rule: {
              repo_path: 'test666/new',
              identifier: 'test',
              type: 'branch',
              state: 'active'
            },
            bypassable: false,
            bypassed: false,
            violations: [
              {
                code: 'pullreq.merge.blocked',
                message: 'The merge for the branch main is not allowed.',
                params: ['main']
              }
            ]
          }
        ] as TypesRuleViolations[]
      }
    },
    requiresCommentApproval: false,
    atLeastOneReviewerRule: false,
    reqCodeOwnerApproval: false,
    minApproval: 0,
    reqCodeOwnerLatestApproval: false,
    minReqLatestApproval: 0,
    PRStateLoading: false,
    commentsLoading: false,
    commentsInfoData: {
      header: 'Unresolved comments',
      content: 'There are 0 unresolved comments',
      status: 'failed'
    }
  }
}
