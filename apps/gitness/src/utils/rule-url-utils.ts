/**
 * Generates a URL for a rule based on its scope and identifier
 * @param params Parameters needed to generate the URL
 * @returns The URL for the rule details page
 */

// @TODO: use ruleid and settings section mode props once NGUI catches up on harness0

export function getScopedRuleUrl({
  scope,
  identifier,
  toCODEManageRepositories,
  toCODERule,
  repoId,
  accountId,
  orgIdentifier,
  projectIdentifier
  // settingSection = 'rules',
  // settingSectionMode = 'edit'
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
    ruleId?: string
    settingSection?: string
    settingSectionMode?: string
  }) => void
  toCODERule?: ({
    repoPath,
    ruleId,
    settingSection,
    settingSectionMode
  }: {
    repoPath: string
    ruleId?: string
    settingSection?: string
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
        // ruleId: identifier,
        settingSection: `rules/${identifier}/edit`
        // settingSectionMode
      })
    }
  }

  if (scope === 1) {
    toCODEManageRepositories?.({
      space: `${accountId ?? ''}`,
      // ruleId: identifier,
      settingSection: `rules/${identifier}/edit`
      // settingSectionMode
    })
  }

  if (scope === 2) {
    toCODEManageRepositories?.({
      space: `${accountId ?? ''}/${orgIdentifier ?? ''}`,
      // ruleId: identifier,
      settingSection: `rules/${identifier}/edit`
      // settingSectionMode
    })
  }
  if (scope === 3) {
    toCODEManageRepositories?.({
      space: `${accountId ?? ''}/${orgIdentifier ?? ''}/${projectIdentifier ?? ''}`,
      // ruleId: identifier,
      settingSection: `rules/${identifier}/edit`
      // settingSectionMode
    })
  }
}
