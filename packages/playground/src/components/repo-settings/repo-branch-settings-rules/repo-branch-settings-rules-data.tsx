export const branchRules = [
  {
    id: 'require_latest_commit',
    label: 'Request approval of new changes',
    description: 'Require re-approval when there are new changes in the pull request'
  },
  {
    id: 'require_no_change_request',
    label: 'Require resolution of change requests',
    description: 'All change requests on a pull request must be resolved before it can be merged'
  },
  {
    id: 'comments',
    label: 'Require comment resolution',
    description: 'All comments on a pull request must be resolved before it can be merged'
  },
  {
    id: 'status_checks',
    label: 'Require status checks to pass',
    description: 'Selected status checks must pass before a pull request can be merged',
    hasSelect: true
  },
  {
    id: 'merge',
    label: 'Limit merge strategies',
    description: 'Limit which merge strategies are available to merge a pull request',
    hasSubmenu: true,
    submenuOptions: [
      { id: 'merge', label: 'Allow Merge Commit' },
      { id: 'squash', label: 'Allow Squash and Merge' },
      { id: 'rebase', label: 'Allow Rebase and Merge' }
    ]
  },
  {
    id: 'delete_branch',
    label: 'Auto delete branch on merge',
    description: 'Automatically delete the source branch of a pull request after it is merged'
  }
]
