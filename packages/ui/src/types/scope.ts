export interface Scope {
  accountId: string
  orgIdentifier?: string
  projectIdentifier?: string
}

export enum ScopeType {
  Account = 'Account',
  Organization = 'Organization',
  Project = 'Project',
  Repository = 'Repository'
}

export enum ScopeValue {
  // Backend 'scope' Values
  Repository = 0,
  Account = 1,
  Organization = 2,
  Project = 3
}
