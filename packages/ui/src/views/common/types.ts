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
