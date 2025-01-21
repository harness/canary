import { noop } from '@utils/viewUtils'

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
            state: 'active',
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
  }
]
