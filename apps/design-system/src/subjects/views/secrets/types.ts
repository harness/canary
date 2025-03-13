export enum ScopeEnum {
  ACCOUNT = 'account',
  ORGANIZATION = 'organization',
  PROJECT = 'project'
}

export type Scope = 'account' | 'organization' | 'project'

export const scopeHierarchy: Record<Scope, { parent: Scope | null; child: Scope | null }> = {
  account: { parent: null, child: ScopeEnum.ORGANIZATION },
  organization: { parent: ScopeEnum.ACCOUNT, child: ScopeEnum.PROJECT },
  project: { parent: ScopeEnum.ORGANIZATION, child: null }
}
