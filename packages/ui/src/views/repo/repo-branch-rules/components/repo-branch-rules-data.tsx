import { MergeStrategy } from '@views/repo/pull-request'

import { BranchRuleId } from '../types'

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
      { id: MergeStrategy.MERGE, label: 'Allow Merge Commit' },
      { id: MergeStrategy.SQUASH, label: 'Allow Squash and Merge' },
      { id: MergeStrategy.REBASE, label: 'Allow Rebase and Merge' }
    ]
  },
  {
    id: BranchRuleId.DELETE_BRANCH,
    label: 'Auto delete branch on merge',
    description: 'Automatically delete the source branch of a pull request after it is merged'
  },
  {
    id: BranchRuleId.BLOCK_BRANCH_CREATION,
    label: 'Block branch creation',
    description: 'Only allow users with bypass permission to create matching branches'
  },
  {
    id: BranchRuleId.BLOCK_BRANCH_DELETION,
    label: 'Block branch deletion',
    description: 'Only allow users with bypass permission to delete matching branches'
  },
  {
    id: BranchRuleId.REQUIRE_PULL_REQUEST,
    label: 'Require pull request',
    description: 'Do not allow any changes to matching branches without a pull request'
  },
  {
    id: BranchRuleId.REQUIRE_CODE_REVIEW,
    label: 'Require a minimum number of reviewers',
    description: 'Require approval on pull requests from a minimum number of reviewers',
    hasInput: true
  }
]
