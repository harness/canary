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

  return url.replace('code', 'codeV2').replace('settings', 'manage-repositories/rules/' + ruleId)
}

/**
 * Generates a URL for a rule based on its scope and identifier
 * @param params Parameters needed to generate the URL
 * @returns The URL for the rule details page
 */
export function generateRuleDetailsUrl({
  scope,
  identifier,
  toAccountSettings,
  toOrgSettings,
  toProjectSettings,
  toRepoBranchRule,
  spaceId,
  repoId
}: {
  scope: number
  identifier: string
  toAccountSettings?: () => string
  toOrgSettings?: () => string
  toProjectSettings?: () => string
  toRepoBranchRule?: (params: { spaceId: string; repoId: string; identifier: string }) => string
  spaceId?: string
  repoId?: string
}): string {
  if (scope === 0) {
    return toRepoBranchRule?.({ spaceId: spaceId ?? '', repoId: repoId ?? '', identifier }) || ''
  }

  if (scope === 1) {
    return transformToRuleDetailsUrl(toAccountSettings?.(), identifier)
  }

  if (scope === 2) {
    return transformToRuleDetailsUrl(toOrgSettings?.(), identifier)
  }
  if (scope === 3) {
    return transformToRuleDetailsUrl(toProjectSettings?.(), identifier)
  }

  return ''
}
