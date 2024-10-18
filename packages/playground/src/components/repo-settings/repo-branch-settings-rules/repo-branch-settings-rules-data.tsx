export const branchRules = [
  {
    id: 'request-approval',
    label: 'Request approval of new changes',
    description: 'Require re-approval when there are new changes in the pull request'
  },
  {
    id: 'change-requests',
    label: 'Require resolution of change requests',
    description: 'All change requests on a pull request must be resolved before it can be merged'
  },
  {
    id: 'comment-resolution',
    label: 'Require comment resolution',
    description: 'All comments on a pull request must be resolved before it can be merged'
  },
  {
    id: 'status-checks',
    label: 'Require status checks to pass',
    description: 'Selected status checks must pass before a pull request can be merged',
    hasSelect: true,
    selectOptions: [
      { id: 'test-check', label: 'Test Check' },
      { id: 'build-check', label: 'Build Check' },
      { id: 'lint-check', label: 'Lint Check' }
    ]
  },
  {
    id: 'merge-strategies',
    label: 'Limit merge strategies',
    description: 'Limit which merge strategies are available to merge a pull request',
    hasSubmenu: true,
    submenuOptions: [
      { id: 'merge-commit', label: 'Allow Merge Commit' },
      { id: 'squash', label: 'Allow Squash and Merge' },
      { id: 'rebase', label: 'Allow Rebase and Merge' }
    ]
  },
  {
    id: 'auto-delete',
    label: 'Auto delete branch on merge',
    description: 'Automatically delete the source branch of a pull request after it is merged'
  }
]
