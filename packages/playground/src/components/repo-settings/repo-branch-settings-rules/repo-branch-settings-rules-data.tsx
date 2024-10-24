import { BranchRuleId, MergeStrategy } from './types'
export const branchRules = [
  {
    id: BranchRuleId.REQUIRE_LATEST_COMMIT,
    label: 'Request approval of new changes',
    description: 'Require re-approval when there are new changes in the pull request'
  },
  {
    id: BranchRuleId.REQUIRE_NO_CHANGE_REQUEST,
    label: 'Require resolution of change requests',
    description: 'All change requests on a pull request must be resolved before it can be merged'
  },
  {
    id: BranchRuleId.COMMENTS,
    label: 'Require comment resolution',
    description: 'All comments on a pull request must be resolved before it can be merged'
  },
  {
    id: BranchRuleId.STATUS_CHECKS,
    label: 'Require status checks to pass',
    description: 'Selected status checks must pass before a pull request can be merged',
    hasSelect: true
  },
  {
    id: BranchRuleId.MERGE,
    label: 'Limit merge strategies',
    description: 'Limit which merge strategies are available to merge a pull request',
    hasSubmenu: true,
    submenuOptions: [
      { id: MergeStrategy.Merge, label: 'Allow Merge Commit' },
      { id: MergeStrategy.Squash, label: 'Allow Squash and Merge' },
      { id: MergeStrategy.Rebase, label: 'Allow Rebase and Merge' }
    ]
  },
  {
    id: BranchRuleId.DELETE_BRANCH,
    label: 'Auto delete branch on merge',
    description: 'Automatically delete the source branch of a pull request after it is merged'
  }
]
