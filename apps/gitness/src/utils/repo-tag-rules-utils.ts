import { EnumRuleState, RepoRuleAddRequestBody } from '@harnessio/code-service-client'
import {
  EnumBypassListType,
  PatternsButtonType,
  RepoTagSettingsFormFields,
  TagRule,
  TagRuleId
} from '@harnessio/ui/views'
import { RuleType } from '../types/rule'

export const transformFormOutput = (formOutput: RepoTagSettingsFormFields): RepoRuleAddRequestBody => {
  const rulesMap = formOutput.rules.reduce<Record<string, TagRule>>((acc, rule) => {
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

  return {
    identifier: formOutput.identifier,
    type: RuleType.TAG,
    description: formOutput.description,
    state: (formOutput.state ? 'active' : 'disabled') as EnumRuleState,
    pattern: {
      include,
      exclude
    },
    definition: {
      bypass: {
        user_ids: formOutput.bypass.filter(it => it.type !== EnumBypassListType.USER_GROUP).map(it => it.id),
        user_group_ids: formOutput.bypass.filter(it => it.type === EnumBypassListType.USER_GROUP).map(it => it.id),
        repo_owners: formOutput.repo_owners || false
      },
      lifecycle: {
        create_forbidden: rulesMap[TagRuleId.BLOCK_TAG_CREATION].checked,
        delete_forbidden: rulesMap[TagRuleId.BLOCK_TAG_DELETION].checked,
        update_force_forbidden: rulesMap[TagRuleId.BLOCK_TAG_UPDATE].checked
      }
    }
  }
}
