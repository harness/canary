import { EnumRuleState, RepoRuleAddRequestBody } from '@harnessio/code-service-client'
import {
  EnumBypassListType,
  PatternsButtonType,
  PushRule,
  PushRuleId,
  RepoPushRulesSettingsFormFields,
  TargetReposButtonType
} from '@harnessio/views'

export const transformFormOutput = (formOutput: RepoPushRulesSettingsFormFields): RepoRuleAddRequestBody => {
  const rulesMap = formOutput.rules.reduce<Record<string, PushRule>>((acc, rule) => {
    acc[rule.id] = rule
    return acc
  }, {})

  const { include, exclude } = formOutput.patterns.reduce<{ include: string[]; exclude: string[] }>(
    (acc, currentPattern) => {
      if (currentPattern.option === PatternsButtonType.INCLUDE) {
        acc.include.push(currentPattern.pattern)
      } else if (currentPattern.option === PatternsButtonType.EXCLUDE) {
        acc.exclude.push(currentPattern.pattern)
      }
      return acc
    },
    { include: [], exclude: [] }
  )

  const { include: repoInclude, exclude: repoExclude } = formOutput.repoPatterns.reduce<{
    include: string[]
    exclude: string[]
  }>(
    (acc, currentPattern) => {
      if (currentPattern.option === PatternsButtonType.INCLUDE) {
        acc.include.push(currentPattern.pattern)
      } else if (currentPattern.option === PatternsButtonType.EXCLUDE) {
        acc.exclude.push(currentPattern.pattern)
      }
      return acc
    },
    { include: [], exclude: [] }
  )

  const includedRepoIds =
    formOutput.targetRepos?.filter(it => it.type === TargetReposButtonType.SELECT_INCLUDED).map(it => it.id) || []
  const excludedRepoIds =
    formOutput.targetRepos?.filter(it => it.type === TargetReposButtonType.SELECT_EXCLUDED).map(it => it.id) || []

  return {
    identifier: formOutput.identifier,
    type: 'push',
    description: formOutput.description,
    state: (formOutput.state ? 'active' : 'disabled') as EnumRuleState,
    pattern: {
      include,
      exclude
    },
    repo_target: {
      include: {
        ids: includedRepoIds,
        patterns: repoInclude
      },
      exclude: {
        ids: excludedRepoIds,
        patterns: repoExclude
      }
    },
    definition: {
      bypass: {
        user_ids: formOutput.bypass.filter(it => it.type !== EnumBypassListType.USER_GROUP).map(it => it.id),
        user_group_ids: formOutput.bypass.filter(it => it.type === EnumBypassListType.USER_GROUP).map(it => it.id),
        repo_owners: formOutput.repo_owners || false
      },
      push: {
        ...(rulesMap[PushRuleId.FILE_SIZE_LIMIT].checked
          ? { file_size_limit: parseInt(rulesMap[PushRuleId.FILE_SIZE_LIMIT].input) }
          : {}),
        principal_committer_match: rulesMap[PushRuleId.PRINCIPAL_COMMITTER_MATCH].checked,
        secret_scanning_enabled: rulesMap[PushRuleId.SECRET_SCANNING_ENABLED].checked
      }
    }
  }
}
