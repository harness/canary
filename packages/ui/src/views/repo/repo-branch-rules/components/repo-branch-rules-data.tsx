import { TFunctionWithFallback } from '@/context'
import { BranchRuleId, MergeStrategy } from '@/views'

export interface BranchRuleType {
  id: BranchRuleId
  label: string
  description: string
  hasSelect?: boolean
  hasSubmenu?: boolean
  submenuOptions?: {
    id: MergeStrategy
    label: string
  }[]
  hasInput?: boolean
  isNested?: boolean
}

export const getBranchRules = (t: TFunctionWithFallback): BranchRuleType[] => [
  {
    id: BranchRuleId.BLOCK_BRANCH_CREATION,
    label: t('views:repos.BlockBranchCreation', 'Block branch creation'),
    description: t(
      'views:repos.BlockBranchCreationDescription',
      'Only allow users with bypass permission to create matching branches'
    )
  },
  {
    id: BranchRuleId.BLOCK_BRANCH_DELETION,
    label: t('views:repos.BlockBranchDeletion', 'Block branch deletion'),
    description: t(
      'views:repos.BlockBranchDeletionDescription',
      'Only allow users with bypass permission to delete matching branches'
    )
  },
  {
    id: BranchRuleId.BLOCK_BRANCH_UPDATE,
    label: t('views:repos.BlockBranchUpdate', 'Block branch update'),
    description: t(
      'views:repos.BlockBranchUpdateDescription',
      'Only allow users with bypass permission to update matching branches'
    )
  },
  {
    id: BranchRuleId.BLOCK_FORCE_PUSH,
    label: t('views:repos.BlockForcePush', 'Block force push'),
    description: t(
      'views:repos.BlockForcePushDescription',
      'Only allow users with bypass permission to force push to matching branches'
    )
  },
  {
    id: BranchRuleId.REQUIRE_PULL_REQUEST,
    label: t('views:repos.RequirePullRequest', 'Require pull request'),
    description: t(
      'views:repos.RequirePullRequestDescription',
      'Do not allow any changes to matching branches without a pull request'
    )
  },
  {
    id: BranchRuleId.ENABLE_DEFAULT_REVIEWERS,
    label: t('views:repos.EnableDefaultReviewers', 'Enable default reviewers'),
    description: t(
      'views:repos.EnableDefaultReviewersDescription',
      'Automatically add default reviewers to pull requests'
    ),
    hasSelect: true
  },
  {
    id: BranchRuleId.REQUIRE_MINIMUM_DEFAULT_REVIEWER_COUNT,
    label: t('views:repos.RequireMinimumDefaultReviewerCount', 'Require minimum number of default reviewers'),
    description: t(
      'views:repos.RequireMinimumDefaultReviewerCountDescription',
      'Require a minimum number of default reviewers'
    ),
    hasInput: true,
    isNested: true
  },
  {
    id: BranchRuleId.REQUIRE_CODE_REVIEW,
    label: t('views:repos.RequireCodeReview', 'Require a minimum number of reviewers'),
    description: t(
      'views:repos.RequireCodeReviewDescription',
      'Require approval on pull requests from a minimum number of reviewers'
    ),
    hasInput: true
  },
  {
    id: BranchRuleId.AUTO_ADD_CODE_OWNERS,
    label: t('views:repos.AutoAddCodeOwners', 'Add Code Owners as reviewers'),
    description: t('views:repos.AutoAddCodeOwnersDescription', 'Automatically add relevant Code Owners as reviewers')
  },
  {
    id: BranchRuleId.REQUIRE_CODE_OWNERS,
    label: t('views:repos.RequireCodeOwners', 'Require review from code owners'),
    description: t(
      'views:repos.RequireCodeOwnersDescription',
      'Require approval on pull requests from one reviewer for each Code Owner rule'
    )
  },
  {
    id: BranchRuleId.REQUIRE_LATEST_COMMIT,
    label: t('views:repos.RequestApprovalRule', 'Request approval of new changes'),
    description: t(
      'views:repos.RequireLatestCommitDescription',
      'Require re-approval when there are new changes in the pull request'
    )
  },
  {
    id: BranchRuleId.REQUIRE_NO_CHANGE_REQUEST,
    label: t('views:repos.RequireNoChangeRequest', 'Require resolution of change requests'),
    description: t(
      'views:repos.RequireNoChangeRequestDescription',
      'All change requests on a pull request must be resolved before it can be merged'
    )
  },
  {
    id: BranchRuleId.COMMENTS,
    label: t('views:repos.RequireCommentResolution', 'Require comment resolution'),
    description: t(
      'views:repos.RequireCommentResolutionDescription',
      'All comments on a pull request must be resolved before it can be merged'
    )
  },
  {
    id: BranchRuleId.STATUS_CHECKS,
    label: t('views:repos.RequireStatusChecks', 'Require status checks to pass'),
    description: t(
      'views:repos.RequireStatusChecksDescription',
      'Selected status checks must pass before a pull request can be merged'
    ),
    hasSelect: true
  },
  {
    id: BranchRuleId.MERGE,
    label: t('views:repos.LimitMergeStrategies', 'Limit merge strategies'),
    description: t(
      'views:repos.LimitMergeStrategiesDescription',
      'Limit which merge strategies are available to merge a pull request'
    ),
    submenuOptions: [
      { id: MergeStrategy.MERGE, label: t('views:repos.MergeStrategy.Merge', 'Allow Merge Commit') },
      { id: MergeStrategy.SQUASH, label: t('views:repos.MergeStrategy.Squash', 'Allow Squash and Merge') },
      { id: MergeStrategy.REBASE, label: t('views:repos.MergeStrategy.Rebase', 'Allow Rebase and Merge') },
      { id: MergeStrategy.FAST_FORWARD, label: t('views:repos.MergeStrategy.FastForward', 'Allow Fast Forward') }
    ]
  },
  {
    id: BranchRuleId.DELETE_BRANCH,
    label: t('views:repos.AutoDeleteBranch', 'Auto delete branch on merge'),
    description: t(
      'views:repos.AutoDeleteBranchDescription',
      'Automatically delete the source branch of a pull request after it is merged'
    )
  }
]
