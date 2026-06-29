// Mock for @harnessio/ui/components - provides only the types/enums needed for tests

export enum MeterState {
  Empty = 0,
  Error = 1,
  Warning = 2,
  Success = 3,
  Info = 4
}

export enum MessageTheme {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  DEFAULT = 'default'
}

// Mock IconV2 component
export const IconV2 = ({ name, size, className }: { name: string; size?: string; className?: string }) => {
  return null
}


export enum ScopeType {
  Account = 'Account',
  Organization = 'Organization',
  Project = 'Project',
  Repository = 'Repository'
}

export const determineScope = ({
  accountId,
  repoIdentifier,
  repoPath
}: {
  accountId: string
  repoIdentifier: string
  repoPath: string
}): ScopeType | undefined => {
  const parts = repoPath.split('/')

  if (parts.length === 2 && parts[0] === accountId && parts[1] === repoIdentifier) {
    return ScopeType.Account
  }

  if (parts.length === 3 && parts[0] === accountId && parts[2] === repoIdentifier) {
    return ScopeType.Organization
  }

  if (parts.length === 4 && parts[0] === accountId && parts[3] === repoIdentifier) {
    return ScopeType.Project
  }
}

export const getScopedPath = ({
  accountId,
  repoIdentifier,
  repoPath
}: {
  accountId: string
  repoIdentifier: string
  repoPath: string
}): string => {
  const parts = repoPath.split('/')
  const filteredParts = parts.filter(part => part !== accountId && part !== repoIdentifier)
  return filteredParts.join('/')
}

// Add any other exports that tests might need
export const Button = () => null
export const Text = () => null
export const Layout = {
  Horizontal: () => null,
  Vertical: () => null
}
