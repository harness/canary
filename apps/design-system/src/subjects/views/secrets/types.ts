export enum ScopeEnum {
  ACCOUNT = 'account',
  ORGANIZATION = 'organization',
  PROJECT = 'project'
}

export type SecretScope = 'account' | 'organization' | 'project'

export const scopeHierarchy: Record<SecretScope, { parent: SecretScope | null; child: SecretScope | null }> = {
  account: { parent: null, child: ScopeEnum.ORGANIZATION },
  organization: { parent: ScopeEnum.ACCOUNT, child: ScopeEnum.PROJECT },
  project: { parent: ScopeEnum.ORGANIZATION, child: null }
}
