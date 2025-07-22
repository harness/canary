import {
  EnumRuleState,
  OpenapiRule,
  OpenapiRuleDefinition,
  RepoRuleAddRequestBody,
  RepoRuleGetOkResponse
} from '@harnessio/code-service-client'
import { PatternsButtonType, RepoTagSettingsFormFields, TagRule, TagRuleId } from '@harnessio/ui/views'

const ruleIds = [TagRuleId.BLOCK_TAG_CREATION, TagRuleId.BLOCK_TAG_DELETION, TagRuleId.BLOCK_TAG_UPDATE]

// Util to transform API response into expected-form format for branch-rules-edit

const extractTagRules = (data: RepoRuleGetOkResponse): TagRule[] => {
  const rules = []

  for (const rule of ruleIds) {
    let checked = false
    let disabled = false
    const definition = data?.definition as OpenapiRuleDefinition

    switch (rule) {
      case TagRuleId.BLOCK_TAG_CREATION:
        checked = definition?.lifecycle?.create_forbidden || false
        break
      case TagRuleId.BLOCK_TAG_DELETION:
        checked = definition?.lifecycle?.delete_forbidden || false
        break
      case TagRuleId.BLOCK_TAG_UPDATE:
        checked = (definition?.lifecycle?.update_force_forbidden && definition?.pullreq?.merge?.block) || false
        break
      default:
        continue
    }

    rules.push({
      id: rule,
      checked,
      disabled
    })
  }

  return rules
}

export const transformDataFromApi = (data: RepoRuleGetOkResponse): RepoTagSettingsFormFields => {
  const includedPatterns = data?.pattern?.include || []
  const excludedPatterns = data?.pattern?.exclude || []
  const formatPatterns = [
    ...includedPatterns.map(pat => ({ pattern: pat, option: PatternsButtonType.INCLUDE })),
    ...excludedPatterns.map(pat => ({ pattern: pat, option: PatternsButtonType.EXCLUDE }))
  ]

  const rules = extractTagRules(data)

  const bypass = data?.definition?.bypass?.user_ids
    ? data?.definition?.bypass?.user_ids.reduce<RepoTagSettingsFormFields['bypass']>((acc, userId) => {
        const user = data?.users?.[userId]

        if (user) {
          acc.push({
            id: userId,
            key: user?.display_name || ''
          })
        }

        return acc
      }, [])
    : []

  return {
    identifier: data.identifier || '',
    description: data.description || '',
    pattern: '',
    patterns: formatPatterns,
    rules: rules,
    state: data.state === 'active',
    bypass
  }
}

// Util to transform form format to expected-API format for branch-rules-edit

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
    type: 'tag',
    description: formOutput.description,
    state: (formOutput.state ? 'active' : 'disabled') as EnumRuleState,
    pattern: {
      include,
      exclude
    },
    definition: {
      bypass: {
        user_ids: formOutput.bypass.map(it => it.id),
        repo_owners: true
      },
      lifecycle: {
        create_forbidden: rulesMap[TagRuleId.BLOCK_TAG_CREATION].checked,
        delete_forbidden: rulesMap[TagRuleId.BLOCK_TAG_DELETION].checked,
        update_force_forbidden: rulesMap[TagRuleId.BLOCK_TAG_UPDATE].checked
      }
    }
  }
}

export const getTotalRulesApplied = (obj: OpenapiRule) => {
  let totalRules = 0
  const transformRules = transformDataFromApi(obj)['rules']

  for (const rule of transformRules) {
    if (rule.checked === true && rule.disabled === false) {
      totalRules++
    }
  }

  return totalRules
}
