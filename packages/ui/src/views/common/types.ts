export interface Scope {
  accountId: string
  orgIdentifier?: string
  projectIdentifier?: string
}

export enum ScopeType {
  Account = 'ACCOUNT',
  Org = 'ORG',
  Project = 'PROJECT',
  Repo = 'REPO'
}
