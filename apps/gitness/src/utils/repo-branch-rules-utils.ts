import {
  EnumRuleState,
  OpenapiRule,
  OpenapiRuleDefinition,
  RepoRuleAddRequestBody,
  RepoRuleGetOkResponse,
  TypesPrincipalInfo
} from '@harnessio/code-service-client'
import { MessageTheme, MultiSelectOption } from '@harnessio/ui/components'
import {
  BranchRuleId,
  MergeStrategy,
  PatternsButtonType,
  RepoBranchSettingsFormFields,
  Rule
} from '@harnessio/ui/views'

import { getDefaultReviewersValidationMessage } from '../pages-v2/repo/transform-utils/handle_rule_interdependencies'

const ruleIds = [
  BranchRuleId.BLOCK_BRANCH_CREATION,
  BranchRuleId.BLOCK_BRANCH_DELETION,
  BranchRuleId.BLOCK_BRANCH_UPDATE,
  BranchRuleId.BLOCK_FORCE_PUSH,
  BranchRuleId.REQUIRE_PULL_REQUEST,
  BranchRuleId.ENABLE_DEFAULT_REVIEWERS,
  BranchRuleId.REQUIRE_MINIMUM_DEFAULT_REVIEWER_COUNT,
  BranchRuleId.REQUIRE_CODE_REVIEW,
  BranchRuleId.AUTO_ADD_CODE_OWNERS,
  BranchRuleId.REQUIRE_CODE_OWNERS,
  BranchRuleId.REQUIRE_LATEST_COMMIT,
  BranchRuleId.REQUIRE_NO_CHANGE_REQUEST,
  BranchRuleId.COMMENTS,
  BranchRuleId.STATUS_CHECKS,
  BranchRuleId.MERGE,
  BranchRuleId.DELETE_BRANCH
]

const getDetailsByIds = (ids: number[], objMap: { [key: string]: TypesPrincipalInfo }): MultiSelectOption[] => {
  return ids
    .map(id => objMap[id])
    .filter(user => user !== undefined)
    .map(user => ({
      id: String(user.id),
      key: user.display_name || '',
      value: user.email || ''
    }))
}

// Util to transform API response into expected-form format for branch-rules-edit

const extractBranchRules = (data: RepoRuleGetOkResponse): Rule[] => {
  const rules = []
  const users = data?.users || {}

  for (const rule of ruleIds) {
    let checked = false
    let disabled = false
    let hidden = false
    let validationMessage = {
      theme: MessageTheme.DEFAULT,
      message: ''
    }
    let submenu: MergeStrategy[] = []
    let selectOptions: MultiSelectOption[] = []
    let input: string = ''
    const definition = data?.definition as OpenapiRuleDefinition

    switch (rule) {
      case BranchRuleId.BLOCK_BRANCH_CREATION:
        checked = definition?.lifecycle?.create_forbidden || false
        break
      case BranchRuleId.BLOCK_BRANCH_DELETION:
        checked = definition?.lifecycle?.delete_forbidden || false
        break
      case BranchRuleId.BLOCK_BRANCH_UPDATE:
        checked = (definition?.lifecycle?.update_forbidden && definition?.pullreq?.merge?.block) || false
        break
      case BranchRuleId.BLOCK_FORCE_PUSH:
        checked = definition?.lifecycle?.update_force_forbidden || definition?.lifecycle?.update_forbidden || false
        disabled = definition?.lifecycle?.update_forbidden || false
        break
      case BranchRuleId.REQUIRE_PULL_REQUEST:
        checked = (definition?.lifecycle?.update_forbidden && !definition?.pullreq?.merge?.block) || false
        disabled = (definition?.lifecycle?.update_forbidden && definition?.pullreq?.merge?.block) || false
        break
      case BranchRuleId.ENABLE_DEFAULT_REVIEWERS:
        checked = (definition?.pullreq?.reviewers?.default_reviewer_ids?.length ?? 0) > 0
        selectOptions = getDetailsByIds(definition?.pullreq?.reviewers?.default_reviewer_ids || [], users)
        validationMessage = getDefaultReviewersValidationMessage(
          definition?.pullreq?.approvals?.require_minimum_default_reviewer_count ?? 0,
          definition?.pullreq?.reviewers?.default_reviewer_ids?.length ?? 0
        )
        break
      case BranchRuleId.REQUIRE_MINIMUM_DEFAULT_REVIEWER_COUNT:
        checked = (definition?.pullreq?.approvals?.require_minimum_default_reviewer_count ?? 0) > 0
        input = definition?.pullreq?.approvals?.require_minimum_default_reviewer_count?.toString() || ''
        hidden = !definition?.pullreq?.reviewers?.default_reviewer_ids?.length
        break
      case BranchRuleId.REQUIRE_CODE_REVIEW:
        checked = (definition?.pullreq?.approvals?.require_minimum_count ?? 0) > 0
        input = definition?.pullreq?.approvals?.require_minimum_count?.toString() || ''
        break
      case BranchRuleId.AUTO_ADD_CODE_OWNERS:
        checked = definition?.pullreq?.reviewers?.request_code_owners || false
        break
      case BranchRuleId.REQUIRE_CODE_OWNERS:
        checked = definition?.pullreq?.approvals?.require_code_owners || false
        break
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
        checked = (definition?.pullreq?.status_checks?.require_identifiers?.length ?? 0) > 0
        selectOptions = (definition?.pullreq?.status_checks?.require_identifiers || []).map(check => ({
          id: check,
          key: check
        }))
        break
      case BranchRuleId.MERGE:
        checked = (definition?.pullreq?.merge?.strategies_allowed?.length ?? 0) > 0
        submenu = (definition?.pullreq?.merge?.strategies_allowed as MergeStrategy[]) || []
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
      disabled,
      hidden,
      validationMessage,
      submenu,
      selectOptions,
      input
    })
  }

  return rules
}

export const transformDataFromApi = (data: RepoRuleGetOkResponse): RepoBranchSettingsFormFields => {
  const includedPatterns = data?.pattern?.include || []
  const excludedPatterns = data?.pattern?.exclude || []
  const formatPatterns = [
    ...includedPatterns.map(pat => ({ pattern: pat, option: PatternsButtonType.INCLUDE })),
    ...excludedPatterns.map(pat => ({ pattern: pat, option: PatternsButtonType.EXCLUDE }))
  ]

  const rules = extractBranchRules(data)

  const bypass = data?.definition?.bypass?.user_ids
    ? data?.definition?.bypass?.user_ids.reduce<RepoBranchSettingsFormFields['bypass']>((acc, userId) => {
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
    bypass,
    default: data?.pattern?.default,
    repo_owners: data?.definition?.bypass?.repo_owners
  }
}

// Util to transform form format to expected-API format for branch-rules-edit

export const transformFormOutput = (formOutput: RepoBranchSettingsFormFields): RepoRuleAddRequestBody => {
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

  return {
    identifier: formOutput.identifier,
    type: 'branch',
    description: formOutput.description,
    state: (formOutput.state ? 'active' : 'disabled') as EnumRuleState,
    pattern: {
      default: formOutput.default || false,
      include,
      exclude
    },
    definition: {
      bypass: {
        user_ids: formOutput.bypass.map(it => it.id),
        repo_owners: formOutput.repo_owners || false
      },
      lifecycle: {
        create_forbidden: rulesMap[BranchRuleId.BLOCK_BRANCH_CREATION]?.checked || false,
        delete_forbidden: rulesMap[BranchRuleId.BLOCK_BRANCH_DELETION]?.checked || false,
        update_forbidden:
          rulesMap[BranchRuleId.REQUIRE_PULL_REQUEST]?.checked ||
          rulesMap[BranchRuleId.BLOCK_BRANCH_UPDATE]?.checked ||
          false,
        update_force_forbidden:
          rulesMap[BranchRuleId.BLOCK_FORCE_PUSH]?.checked &&
          !rulesMap[BranchRuleId.REQUIRE_PULL_REQUEST]?.checked &&
          !rulesMap[BranchRuleId.BLOCK_BRANCH_UPDATE]?.checked
      },
      pullreq: {
        approvals: {
          require_code_owners: rulesMap[BranchRuleId.REQUIRE_CODE_OWNERS]?.checked || false,
          require_latest_commit: rulesMap[BranchRuleId.REQUIRE_LATEST_COMMIT]?.checked || false,
          require_no_change_request: rulesMap[BranchRuleId.REQUIRE_NO_CHANGE_REQUEST]?.checked || false,
          require_minimum_count: rulesMap[BranchRuleId.REQUIRE_CODE_REVIEW].checked
            ? parseInt(rulesMap[BranchRuleId.REQUIRE_CODE_REVIEW].input) || 0
            : 0,
          require_minimum_default_reviewer_count: rulesMap[BranchRuleId.REQUIRE_MINIMUM_DEFAULT_REVIEWER_COUNT].checked
            ? parseInt(rulesMap[BranchRuleId.REQUIRE_MINIMUM_DEFAULT_REVIEWER_COUNT].input) || 0
            : 0
        },
        comments: {
          require_resolve_all: rulesMap[BranchRuleId.COMMENTS]?.checked || false
        },
        merge: {
          strategies_allowed: rulesMap[BranchRuleId.MERGE]?.submenu || [],
          delete_branch: rulesMap[BranchRuleId.DELETE_BRANCH]?.checked || false,
          block: rulesMap[BranchRuleId.BLOCK_BRANCH_UPDATE]?.checked || false
        },
        status_checks: {
          require_identifiers:
            rulesMap[BranchRuleId.STATUS_CHECKS]?.selectOptions.map(option => String(option.id)) || []
        },
        reviewers: {
          request_code_owners: rulesMap[BranchRuleId.AUTO_ADD_CODE_OWNERS]?.checked || false,
          default_reviewer_ids: rulesMap[BranchRuleId.ENABLE_DEFAULT_REVIEWERS]?.checked
            ? rulesMap[BranchRuleId.ENABLE_DEFAULT_REVIEWERS].selectOptions.map(option => parseInt(String(option.id)))
            : []
        }
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
