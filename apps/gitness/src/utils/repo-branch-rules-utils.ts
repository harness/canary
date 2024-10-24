import { Rule, RepoBranchSettingsFormFields, BranchRuleId, PatternsButtonType } from '@harnessio/playground'
import { EnumMergeMethod, EnumRuleState, RuleAddRequestBody, RuleGetOkResponse } from '@harnessio/code-service-client'

const ruleIds = [
  BranchRuleId.REQUIRE_LATEST_COMMIT,
  BranchRuleId.REQUIRE_NO_CHANGE_REQUEST,
  BranchRuleId.COMMENTS,
  BranchRuleId.STATUS_CHECKS,
  BranchRuleId.MERGE,
  BranchRuleId.DELETE_BRANCH
]

const extractBranchRules = (definition: any) => {
  const rules = []

  for (const rule of ruleIds) {
    let checked = false
    let submenu: EnumMergeMethod[] = []
    let selectOptions: string[] = []

    switch (rule) {
      case BranchRuleId.REQUIRE_LATEST_COMMIT:
        checked = definition?.pullreq?.approvals?.require_latest_commit || false
        break
      case BranchRuleId.REQUIRE_NO_CHANGE_REQUEST:
        checked = definition?.pullreq?.approvals?.require_no_change_request || false
        break
      case BranchRuleId.COMMENTS:
        checked = definition?.pullreq?.comments?.require_resolve_all || false
        break
      case BranchRuleId.STATUS_CHECKS:
        checked = definition?.pullreq?.status_checks?.require_identifiers?.length > 0
        selectOptions = definition?.pullreq?.status_checks?.require_identifiers || []
        break
      case BranchRuleId.MERGE:
        checked = definition?.pullreq?.merge?.strategies_allowed?.length > 0
        submenu = definition?.pullreq?.merge?.strategies_allowed || []
        break
      case BranchRuleId.DELETE_BRANCH:
        checked = definition?.pullreq?.merge?.delete_branch || false
        break
      default:
        continue
    }

    rules.push({
      id: rule,
      checked,
      submenu,
      selectOptions
    })
  }

  return rules
}

export const transformDataFromApi = (data: RuleGetOkResponse) => {
  const includedPatterns = data?.pattern?.include || []
  const excludedPatterns = data?.pattern?.exclude || []
  const formatPatterns = [
    ...includedPatterns.map(pat => ({ pattern: pat, option: PatternsButtonType.INCLUDE })),
    ...excludedPatterns.map(pat => ({ pattern: pat, option: PatternsButtonType.EXCLUDE }))
  ]

  const rules = extractBranchRules(data.definition)

  return {
    identifier: data.identifier || '',
    description: data.description || '',
    pattern: '',
    patterns: formatPatterns,
    rules: rules,
    state: data.state === 'active',
    bypass: data?.definition?.bypass?.user_ids || [],
    access: '1',
    default: data?.pattern?.default,
    repo_owners: data?.definition?.bypass?.repo_owners
  }
}

export const transformFormOutput = (formOutput: RepoBranchSettingsFormFields) => {
  const rulesMap = formOutput.rules.reduce<Record<string, Rule>>((acc, rule) => {
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

  const transformed: RuleAddRequestBody = {
    identifier: formOutput.identifier,
    type: 'branch',
    description: formOutput.description,
    state: (formOutput.state === true ? 'active' : 'disabled') as EnumRuleState,
    pattern: {
      default: formOutput.default || false,
      include,
      exclude
    },
    definition: {
      bypass: {
        user_ids: formOutput.bypass,
        repo_owners: formOutput.repo_owners || false
      },
      pullreq: {
        approvals: {
          require_code_owners: true,
          require_latest_commit: rulesMap['require_latest_commit']?.checked || false,
          require_no_change_request: rulesMap['require_no_change_request']?.checked || false
        },
        comments: {
          require_resolve_all: rulesMap['comments']?.checked || false
        },
        merge: {
          strategies_allowed: (rulesMap['merge']?.submenu || []) as EnumMergeMethod[],
          delete_branch: rulesMap['delete_branch']?.checked || false
        },
        status_checks: {
          require_identifiers: rulesMap['status_checks']?.selectOptions || []
        }
      }
    }
  }

  return transformed
}
