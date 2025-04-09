import { noop } from '@utils/viewUtils'

import { EnumPrincipalType } from '@harnessio/ui/types'
import {
  ColorsEnum,
  EnumCheckPayloadKind,
  EnumCheckStatus,
  EnumPullReqActivityKind,
  EnumPullReqActivityType,
  EnumPullReqReviewDecision,
  EnumRuleState,
  ILabelType,
  LabelAssignmentType,
  LabelType,
  TypesPullReqActivity
} from '@harnessio/ui/views'

export const prPanelInfo = {
  ruleViolation: true,
  ruleViolationArr: {
    data: {
      rule_violations: [
        {
          rule: {
            repo_path: 'test666/new',
            identifier: 'test',
            type: 'branch',
            state: 'active' as EnumRuleState,
            uid: 'test'
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
      ]
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
  },
  resolvedCommentArr: { params: [] }
}

export const changesInfoData = {
  title: 'No reviews required',
  statusMessage: 'Pull request can be merged without any reviews',
  statusColor: 'grey',
  statusIcon: 'success',
  isNotRequired: false
}
export const pendingChangesInfoData = {
  title: 'Approvals pending',
  statusMessage: 'Changes are pending approval from required reviewers',
  statusColor: 'text-warning',
  statusIcon: 'pending',
  isNotRequired: false
}

export const pullReqChecksDecisionSucceeded = {
  overallStatus: 'success',
  count: {
    error: 0,
    failure: 0,
    pending: 0,
    running: 0,
    success: 1,
    skipped: 0,
    killed: 0
  },
  error: null,
  data: {
    commit_sha: 'b179f4b0f7d3e217ed9898b67440ad7db96668be',
    checks: [
      {
        required: false,
        bypassable: false,
        check: {
          id: 2047,
          created: 1737596048847,
          updated: 1737596050264,
          identifier: 'dsadasd',
          status: 'success' as EnumCheckStatus,
          summary: 'dsadasd',
          metadata: {},
          payload: {
            version: '1',
            kind: 'pipeline' as EnumCheckPayloadKind,
            data: {
              execution_number: 104,
              repo_id: 22,
              pipeline_id: 15
            }
          },
          reported_by: {
            id: 1,
            uid: 'gitness',
            display_name: 'Gitness',
            email: 'system@gitness.io',
            type: 'service' as EnumPrincipalType,
            created: 1699863415934,
            updated: 1699863415934
          },
          uid: 'dsadasd'
        }
      }
    ]
  },
  color: 'text-success',
  background: 'text-success',
  message: '1/1 check succeeded.',
  checkInfo: {
    title: 'All checks have succeeded',
    content: '1 succeeded',
    color: 'text-cn-foreground-3',
    status: 'success'
  },
  summaryText: '1 succeeded'
}
export const mockPullRequestActions = [
  {
    id: '0',
    title: 'Squash and merge',
    description: 'All commits from this branch will be combined into one commit in the base branch.',
    action: () => {
      noop()
    }
  },
  {
    id: '1',
    title: 'Merge pull request',
    description: 'All commits from this branch will be added to the base branch via a merge commit.',
    action: () => {
      noop()
    }
  },
  {
    id: '2',
    title: 'Rebase and merge',
    description: 'All commits from this branch will be rebased and added to the base branch.',
    action: () => {
      noop()
    }
  },
  {
    id: '3',
    title: 'Fast-forward merge',
    description:
      'All commits from this branch will be added to the base branch without a merge commit. Rebase may be required.',
    action: () => {
      noop()
    }
  }
]

export const mockActivities = [
  {
    id: 795,
    created: 1737660580605,
    updated: 1737660580605,
    edited: 1737660580605,
    parent_id: null,
    repo_id: 22,
    pullreq_id: 174,
    order: 2,
    sub_order: 0,
    type: 'code-comment',
    kind: 'change-comment',
    text: 'We should add type checking for this function to improve type safety',
    payload: {
      title: '@@ -0,0 +1,4 @@',
      lines: [
        "+import tailwindcssAnimate from 'tailwindcss-animate'",
        "+import { PluginAPI } from 'tailwindcss/types/config'",
        '+',
        '+export default {'
      ],
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
    resolved: 1737660580605,
    resolver: {
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
      merge_base_sha: '12421f51a7cca90376cba8de0fe9b3289eb6e218',
      source_sha: '34f4d7bbfeda153e4965395ac6a20e80dec63e57',
      path: 'packages/canary/configs/tailwind.ts',
      line_new: 2,
      span_new: 1,
      line_old: 0,
      span_old: 0
    }
  },
  {
    id: 796,
    created: 1737660580605,
    updated: 1737660580605,
    edited: 1737660580605,
    parent_id: null,
    repo_id: 22,
    pullreq_id: 174,
    order: 2,
    sub_order: 0,
    type: 'comment',
    kind: 'comment',
    text: 'Should we consider adding unit tests for the new animation components?',
    payload: {},
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user',
      created: 1699863416002,
      updated: 1699863416002
    },
    resolved: 1737660580607,
    resolver: {
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
    id: 797,
    created: 1737660580606,
    updated: 1737660580606,
    edited: 1737660580606,
    parent_id: 796,
    repo_id: 22,
    pullreq_id: 174,
    order: 2,
    sub_order: 1,
    type: 'comment',
    kind: 'comment',
    text: 'Yes, I agree. I will add tests for basic animations first.',
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
    id: 798,
    created: 1737660580607,
    updated: 1737660580607,
    edited: 1737660580607,
    parent_id: 796,
    repo_id: 22,
    pullreq_id: 174,
    order: 2,
    sub_order: 2,
    type: 'comment',
    kind: 'comment',
    text: 'Tests have been added in PR #123. We can close this discussion.',
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
    id: 792,
    created: 1737660563002,
    updated: 1737660580604,
    edited: 1737660563002,
    parent_id: null,
    repo_id: 22,
    pullreq_id: 174,
    order: 1,
    sub_order: 0,
    type: 'comment',
    kind: 'comment',
    text: 'test-1',
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
    id: 793,
    created: 1737660571374,
    updated: 1737660571374,
    edited: 1737660571374,
    parent_id: 792,
    repo_id: 22,
    pullreq_id: 174,
    order: 1,
    sub_order: 1,
    type: 'comment',
    kind: 'comment',
    text: 'test-2',
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
    id: 794,
    created: 1737660580604,
    updated: 1737660580604,
    edited: 1737660580604,
    parent_id: 792,
    repo_id: 22,
    pullreq_id: 174,
    order: 1,
    sub_order: 2,
    type: 'comment',
    kind: 'comment',
    text: '> test-2\n\nbew',
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
    id: 776,
    created: 1737586392715,
    updated: 1737586392715,
    edited: 1737586392715,
    parent_id: null,
    repo_id: 22,
    pullreq_id: 165,
    order: 1,
    sub_order: 0,
    type: 'review-submit' as EnumPullReqActivityType,
    kind: 'system' as EnumPullReqActivityKind,
    text: '',
    payload: {
      commit_sha: '16f395ca0d46080096c55648ba1d227f329299f3',
      decision: 'approved'
    },
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    }
  },
  {
    id: 777,
    created: 1737586415419,
    updated: 1737586415419,
    edited: 1737586415419,
    parent_id: null,
    repo_id: 22,
    pullreq_id: 165,
    order: 2,
    sub_order: 0,
    type: 'review-submit' as EnumPullReqActivityType,
    kind: 'system' as EnumPullReqActivityKind,
    text: '',
    payload: {
      commit_sha: '16f395ca0d46080096c55648ba1d227f329299f3',
      decision: 'changereq'
    },
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    }
  },
  {
    id: 778,
    created: 1737586506874,
    updated: 1737586506874,
    edited: 1737586506874,
    parent_id: null,
    repo_id: 22,
    pullreq_id: 165,
    order: 3,
    sub_order: 0,
    type: 'state-change' as EnumPullReqActivityType,
    kind: 'system' as EnumPullReqActivityKind,
    text: '',
    payload: {
      old: 'open',
      new: 'open',
      old_draft: false,
      new_draft: true
    },
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    }
  },
  {
    id: 781,
    created: 1737595980736,
    updated: 1737595980736,
    edited: 1737595980736,
    parent_id: null,
    repo_id: 22,
    pullreq_id: 165,
    order: 4,
    sub_order: 0,
    type: 'state-change' as EnumPullReqActivityType,
    kind: 'system' as EnumPullReqActivityKind,
    text: '',
    payload: {
      old: 'open',
      new: 'open',
      old_draft: true,
      new_draft: false
    },
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    }
  },
  {
    id: 782,
    created: 1737595987073,
    updated: 1737595987073,
    edited: 1737595987073,
    parent_id: null,
    repo_id: 22,
    pullreq_id: 165,
    order: 5,
    sub_order: 0,
    type: 'state-change' as EnumPullReqActivityType,
    kind: 'system' as EnumPullReqActivityKind,
    text: '',
    payload: {
      old: 'open',
      new: 'closed',
      old_draft: false,
      new_draft: false
    },
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    }
  },
  {
    id: 783,
    created: 1737595990491,
    updated: 1737595990491,
    edited: 1737595990491,
    parent_id: null,
    repo_id: 22,
    pullreq_id: 165,
    order: 6,
    sub_order: 0,
    type: 'state-change' as EnumPullReqActivityType,
    kind: 'system' as EnumPullReqActivityKind,
    text: '',
    payload: {
      old: 'closed',
      new: 'open',
      old_draft: false,
      new_draft: false
    },
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    }
  },
  {
    id: 784,
    created: 1737596021748,
    updated: 1737596021748,
    edited: 1737596021748,
    parent_id: null,
    repo_id: 22,
    pullreq_id: 165,
    order: 7,
    sub_order: 0,
    type: 'title-change' as EnumPullReqActivityType,
    kind: 'system' as EnumPullReqActivityKind,
    text: '',
    payload: {
      old: 'Create newfile.tsx',
      new: 'Create newfile.tsx-edit'
    },
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    }
  },
  {
    id: 785,
    created: 1737596048780,
    updated: 1737596048780,
    edited: 1737596048780,
    parent_id: null,
    repo_id: 22,
    pullreq_id: 165,
    order: 8,
    sub_order: 0,
    type: 'branch-update' as EnumPullReqActivityType,
    kind: 'system' as EnumPullReqActivityKind,
    text: '',
    payload: {
      old: '16f395ca0d46080096c55648ba1d227f329299f3',
      new: 'b179f4b0f7d3e217ed9898b67440ad7db96668be',
      forced: false,
      commit_title: 'Create new-file.txt'
    },
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    }
  },
  {
    id: 786,
    created: 1737596113760,
    updated: 1737596113760,
    edited: 1737596113760,
    parent_id: null,
    repo_id: 22,
    pullreq_id: 165,
    order: 9,
    sub_order: 0,
    type: 'reviewer-delete' as EnumPullReqActivityType,
    kind: 'system' as EnumPullReqActivityKind,
    text: '',
    payload: {
      commit_sha: '16f395ca0d46080096c55648ba1d227f329299f3',
      decision: 'changereq',
      principal_id: 3
    },
    metadata: {
      mentions: {
        ids: [3]
      }
    },
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    mentions: {
      '3': {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user' as EnumPrincipalType,
        created: 1699863416002,
        updated: 1699863416002
      }
    }
  },
  {
    id: 787,
    created: 1737596173846,
    updated: 1737596173846,
    edited: 1737596173846,
    parent_id: null,
    repo_id: 22,
    pullreq_id: 165,
    order: 10,
    sub_order: 0,
    type: 'reviewer-add' as EnumPullReqActivityType,
    kind: 'system' as EnumPullReqActivityKind,
    text: '',
    payload: {
      principal_id: 3,
      reviewer_type: 'self_assigned'
    },
    metadata: {
      mentions: {
        ids: [3]
      }
    },
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    mentions: {
      '3': {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user' as EnumPrincipalType,
        created: 1699863416002,
        updated: 1699863416002
      }
    }
  },
  {
    id: 788,
    created: 1737596184246,
    updated: 1737596184246,
    edited: 1737596184246,
    parent_id: null,
    repo_id: 22,
    pullreq_id: 165,
    order: 11,
    sub_order: 0,
    type: 'reviewer-add' as EnumPullReqActivityType,
    kind: 'system' as EnumPullReqActivityKind,
    text: '',
    payload: {
      principal_id: 6,
      reviewer_type: 'assigned'
    },
    metadata: {
      mentions: {
        ids: [6]
      }
    },
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    mentions: {
      '6': {
        id: 6,
        uid: 'reader',
        display_name: 'reader',
        email: 'reader@harness.io',
        type: 'user' as EnumPrincipalType,
        created: 1701466561635,
        updated: 1701466561635
      }
    }
  },
  {
    id: 789,
    created: 1737596195811,
    updated: 1737596195811,
    edited: 1737596195811,
    parent_id: null,
    repo_id: 22,
    pullreq_id: 165,
    order: 12,
    sub_order: 0,
    type: 'label-modify' as EnumPullReqActivityType,
    kind: 'system' as EnumPullReqActivityKind,
    text: '',
    payload: {
      label: 'P0',
      label_color: 'red',
      label_scope: 1,
      type: 'assign'
    },
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    }
  },
  {
    id: 790,
    created: 1737596199321,
    updated: 1737596199321,
    edited: 1737596199321,
    parent_id: null,
    repo_id: 22,
    pullreq_id: 165,
    order: 13,
    sub_order: 0,
    type: 'label-modify' as EnumPullReqActivityType,
    kind: 'system' as EnumPullReqActivityKind,
    text: '',
    payload: {
      label: 'P0',
      label_color: 'red',
      label_scope: 1,
      type: 'unassign'
    },
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    }
  },
  {
    id: 791,
    created: 1737596204929,
    updated: 1737596204929,
    edited: 1737596204929,
    parent_id: null,
    repo_id: 22,
    pullreq_id: 165,
    order: 14,
    sub_order: 0,
    type: 'label-modify' as EnumPullReqActivityType,
    kind: 'system' as EnumPullReqActivityKind,
    text: '',
    payload: {
      label: 'P0',
      label_color: 'red',
      label_scope: 1,
      type: 'assign'
    },
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    }
  }
] as TypesPullReqActivity[]

export const mockReviewers = [
  {
    created: 1737596173845,
    updated: 1737596173845,
    type: 'self_assigned',
    latest_review_id: null,
    review_decision: 'pending' as EnumPullReqReviewDecision,
    sha: '',
    reviewer: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user',
      created: 1699863416002,
      updated: 1699863416002
    },
    added_by: {
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
    created: 1737596184244,
    updated: 1737596184244,
    type: 'assigned',
    latest_review_id: null,
    review_decision: 'pending' as EnumPullReqReviewDecision,
    sha: '',
    reviewer: {
      id: 6,
      uid: 'reader',
      display_name: 'reader',
      email: 'reader@harness.io',
      type: 'user',
      created: 1701466561635,
      updated: 1701466561635
    },
    added_by: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user',
      created: 1699863416002,
      updated: 1699863416002
    }
  }
]

export const mockLabelList: ILabelType[] = [
  {
    id: 1,
    space_id: 3,
    scope: 1,
    key: 'P0',
    description: '',
    type: LabelType.STATIC,
    color: ColorsEnum.BLUE,
    value_count: 0,
    created: 1723740581843,
    updated: 1723740581843,
    created_by: 3,
    updated_by: 3
  },
  {
    id: 8,
    repo_id: 22,
    scope: 0,
    key: 's',
    description: '',
    type: LabelType.DYNAMIC,
    color: ColorsEnum.CYAN,
    value_count: 0,
    created: 1736929623159,
    updated: 1736929623159,
    created_by: 3,
    updated_by: 3
  }
]

export interface PRLabelsData {
  scope_data: Array<{
    scope: number
    space: {
      id: number
      parent_id: number
      path: string
      identifier: string
      description: string
      created_by: number
      created: number
      updated: number
    }
  }>
  label_data: LabelAssignmentType[]
}

export const mockPrLabels: PRLabelsData = {
  scope_data: [
    {
      scope: 1,
      space: {
        id: 3,
        parent_id: 0,
        path: 'best',
        identifier: 'best',
        description: 'best',
        created_by: 3,
        created: 1700509266077,
        updated: 1700509266077
      }
    }
  ],
  label_data: [
    {
      scope: 1,
      id: 9,
      type: LabelType.DYNAMIC,
      key: '111',
      color: ColorsEnum.RED,
      assigned_value: {
        id: 10,
        value: 'newwwww',
        color: ColorsEnum.RED
      }
    }
  ]
}

export interface Label {
  id: number
  key: string
  color: string
  scope?: number
  type?: string
}
