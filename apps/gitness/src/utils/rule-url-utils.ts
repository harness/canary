/**
 * Utility functions for rule URL transformations
 */

/**
 * Transforms a settings URL to a rules URL with the specified rule identifier
 * @param url The original settings URL (e.g., from toAccountSettings, toOrgSettings, toProjectSettings)
 * @param ruleId The rule identifier to include in the URL
 * @returns The transformed URL pointing to the rule details page
 */
export function transformToRuleDetailsUrl(url?: string, ruleId?: string): string {
  if (!url || !ruleId) return ''

  return url.replace('settings', 'manage-repositories/rules/' + ruleId)
}

/**
 * Generates a URL for a rule based on its scope and identifier
 * @param params Parameters needed to generate the URL
 * @returns The URL for the rule details page
 */

// @TODO: Remove navigate fallback once MFE route utils are available across all release branches

export function getScopedRuleUrl({
  scope,
  identifier,
  toCODEManageRepositories,
  toCODERule,
  toAccountSettings,
  toOrgSettings,
  toProjectSettings,
  toRepoBranchRule,
  spaceId,
  repoId,
  accountId,
  orgIdentifier,
  projectIdentifier,
  settingSection = 'rules',
  settingSectionMode = 'edit'
}: {
  scope: number
  identifier: string
  settingSection?: string
  settingSectionMode?: string
  toCODEManageRepositories?: ({
    space,
    ruleId,
    settingSection,
    settingSectionMode
  }: {
    space: string
    ruleId: string
    settingSection: string
    settingSectionMode?: string
  }) => void
  toCODERule?: ({
    repoPath,
    ruleId,
    settingSection,
    settingSectionMode
  }: {
    repoPath: string
    ruleId: string
    settingSection: string
    settingSectionMode?: string
  }) => void
  toAccountSettings?: () => string
  toOrgSettings?: () => string
  toProjectSettings?: () => string
  toRepoBranchRule?: (params: { spaceId: string; repoId: string; identifier: string }) => string
  spaceId?: string
  repoId?: string
  accountId?: string
  orgIdentifier?: string
  projectIdentifier?: string
}) {
  if (scope === 0) {
    const repoPath = [accountId, orgIdentifier, projectIdentifier, repoId].filter(Boolean).join('/')

    if (toCODERule) {
      toCODERule({
        repoPath,
        ruleId: identifier,
        settingSection,
        settingSectionMode
      })
    } else {
      const url = toRepoBranchRule?.({ spaceId: spaceId ?? '', repoId: repoId ?? '', identifier }) ?? ''
      window.location.href = transformToRuleDetailsUrl(url, identifier)
    }
  }

  if (scope === 1) {
    if (!toCODEManageRepositories)
      window.location.href = transformToRuleDetailsUrl(toAccountSettings?.() ?? '', identifier)
    toCODEManageRepositories?.({
      space: `${accountId ?? ''}`,
      ruleId: identifier,
      settingSection,
      settingSectionMode
    })
  }

  if (scope === 2) {
    if (!toCODEManageRepositories) window.location.href = transformToRuleDetailsUrl(toOrgSettings?.() ?? '', identifier)
    toCODEManageRepositories?.({
      space: `${accountId ?? ''}/${orgIdentifier ?? ''}`,
      ruleId: identifier,
      settingSection,
      settingSectionMode
    })
  }
  if (scope === 3) {
    if (!toCODEManageRepositories)
      window.location.href = transformToRuleDetailsUrl(toProjectSettings?.() ?? '', identifier)
    toCODEManageRepositories?.({
      space: `${accountId ?? ''}/${orgIdentifier ?? ''}/${projectIdentifier ?? ''}`,
      ruleId: identifier,
      settingSection,
      settingSectionMode
    })
  }
}
