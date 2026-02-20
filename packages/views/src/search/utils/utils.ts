// Helper function to generate scope options based on available scope levels
export const getScopeOptions = (scope: { accountId: string; orgIdentifier?: string; projectIdentifier?: string }) => {
  const options = []

  if (scope.accountId && scope.orgIdentifier) {
    options.push({ label: 'Organization', value: 'org' })
    options.push({ label: 'Organizations and Projects', value: 'all' })
  } else if (scope.accountId) {
    options.push({ label: 'Account', value: 'account' })
    options.push({ label: 'Account, Organizations and Projects', value: 'all' })
  }

  return options
}
