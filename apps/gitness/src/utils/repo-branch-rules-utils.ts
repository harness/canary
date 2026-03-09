import {
  EnumRuleState,
  OpenapiRule,
  OpenapiRuleDefinition,
  RepoRuleAddRequestBody,
  RepoRuleGetOkResponse,
  TypesPrincipalInfo,
  TypesRepositoryCore,
  TypesUserGroupInfo
} from '@harnessio/code-service-client'
import { MessageTheme, MultiSelectOption } from '@harnessio/ui/components'
import {
  BranchRuleId,
  EnumBypassListType,
  MergeStrategy,
  PatternsButtonType,
  PushRuleId,
  RepoBranchSettingsFormFields,
  Rule,
  TargetReposButtonType
} from '@harnessio/views'

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
  BranchRuleId.DELETE_BRANCH,
  PushRuleId.FILE_SIZE_LIMIT,
  PushRuleId.PRINCIPAL_COMMITTER_MATCH,
  PushRuleId.SECRET_SCANNING_ENABLED
]

const getDetailsByIds = (ids: number[], objMap: { [key: string]: TypesPrincipalInfo }): MultiSelectOption[] => {
  return ids
    .map(id => objMap[id])
    .filter(Boolean)
    .map(user => ({
      id: String(user.id),
      key: user.display_name || '',
      value: user.email || '',
      icon: 'user'
    }))
}

const getUGDetailsByIds = (ids: number[], objMap: { [key: string]: TypesUserGroupInfo }): MultiSelectOption[] => {
  return ids
    .map(id => objMap[id])
    .filter(Boolean)
    .map(ug => ({
      id: String(ug.id),
      key: ug.name || '',
      value: ug.identifier || '',
      icon: 'group-1'
    }))
}

// Util to transform API response into expected-form format for branch-rules-edit
const extractBranchRules = (data: RepoRuleGetOkResponse): Rule[] => {
  const rules = []
  const users = data?.users || {}
  const useGroups = data?.user_groups || {}

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

    const { lifecycle, pullreq, push } = (data?.definition || {}) as OpenapiRuleDefinition

    switch (rule) {
      case BranchRuleId.BLOCK_BRANCH_CREATION:
        checked = lifecycle?.create_forbidden || false
        break
      case BranchRuleId.BLOCK_BRANCH_DELETION:
        checked = lifecycle?.delete_forbidden || false
        break
      case BranchRuleId.BLOCK_BRANCH_UPDATE:
        checked = (lifecycle?.update_forbidden && pullreq?.merge?.block) || false
        break
      case BranchRuleId.BLOCK_FORCE_PUSH:
        checked = lifecycle?.update_force_forbidden || lifecycle?.update_forbidden || false
        disabled = lifecycle?.update_forbidden || false
        break
      case BranchRuleId.REQUIRE_PULL_REQUEST:
        checked = (lifecycle?.update_forbidden && !pullreq?.merge?.block) || false
        disabled = (lifecycle?.update_forbidden && pullreq?.merge?.block) || false
        break
      case BranchRuleId.ENABLE_DEFAULT_REVIEWERS:
        checked =
          (pullreq?.reviewers?.default_reviewer_ids?.length ?? 0) +
            (pullreq?.reviewers?.default_user_group_reviewer_ids?.length ?? 0) >
          0
        selectOptions = [
          ...getDetailsByIds(pullreq?.reviewers?.default_reviewer_ids || [], users),
          ...getUGDetailsByIds(pullreq?.reviewers?.default_user_group_reviewer_ids || [], useGroups)
        ]
        validationMessage = getDefaultReviewersValidationMessage(
          pullreq?.approvals?.require_minimum_default_reviewer_count ?? 0,
          pullreq?.reviewers?.default_reviewer_ids?.length ?? 0,
          pullreq?.reviewers?.default_user_group_reviewer_ids?.length
        )
        break
      case BranchRuleId.REQUIRE_MINIMUM_DEFAULT_REVIEWER_COUNT:
        checked = (pullreq?.approvals?.require_minimum_default_reviewer_count ?? 0) > 0
        input = pullreq?.approvals?.require_minimum_default_reviewer_count?.toString() || ''
        hidden =
          !pullreq?.reviewers?.default_reviewer_ids?.length &&
          !pullreq?.reviewers?.default_user_group_reviewer_ids?.length
        break
      case BranchRuleId.REQUIRE_CODE_REVIEW:
        checked = (pullreq?.approvals?.require_minimum_count ?? 0) > 0
        input = pullreq?.approvals?.require_minimum_count?.toString() || ''
        break
      case BranchRuleId.AUTO_ADD_CODE_OWNERS:
        checked = pullreq?.reviewers?.request_code_owners || false
        break
      case BranchRuleId.REQUIRE_CODE_OWNERS:
        checked = pullreq?.approvals?.require_code_owners || false
        break
      case BranchRuleId.REQUIRE_LATEST_COMMIT:
        checked = pullreq?.approvals?.require_latest_commit || false
        break
      case BranchRuleId.REQUIRE_NO_CHANGE_REQUEST:
        checked = pullreq?.approvals?.require_no_change_request || false
        break
      case BranchRuleId.COMMENTS:
        checked = pullreq?.comments?.require_resolve_all || false
        break
      case BranchRuleId.STATUS_CHECKS:
        checked = (pullreq?.status_checks?.require_identifiers?.length ?? 0) > 0
        selectOptions = (pullreq?.status_checks?.require_identifiers || []).map(check => ({
          id: check,
          key: check
        }))
        break
      case BranchRuleId.MERGE:
        checked = (pullreq?.merge?.strategies_allowed?.length ?? 0) > 0
        submenu = (pullreq?.merge?.strategies_allowed as MergeStrategy[]) || []
        break
      case BranchRuleId.DELETE_BRANCH:
        checked = pullreq?.merge?.delete_branch || false
        break
      case PushRuleId.FILE_SIZE_LIMIT:
        checked = (push?.file_size_limit ?? 0) > 0
        input = (push?.file_size_limit ?? 0).toString()
        break
      case PushRuleId.PRINCIPAL_COMMITTER_MATCH:
        checked = push?.principal_committer_match || false
        break
      case PushRuleId.SECRET_SCANNING_ENABLED:
        checked = push?.secret_scanning_enabled || false
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

const getTargetRepos = (
  ids: number[],
  type: TargetReposButtonType,
  repositories: { [key: number]: TypesRepositoryCore }
): RepoBranchSettingsFormFields['targetRepos'] => {
  return ids.reduce<RepoBranchSettingsFormFields['targetRepos']>((acc, id: number) => {
    const repoInfo = repositories[id]
    if (repoInfo) {
      acc?.push({
        id,
        type,
        info: {
          id: repoInfo.id ?? -1,
          path: repoInfo.path ?? '',
          identifier: repoInfo.identifier ?? '',
          default_branch: repoInfo.default_branch ?? '',
          parent_id: repoInfo.parent_id ?? -1
        }
      })
    }
    return acc
  }, [])
}

export const transformDataFromApi = (data: RepoRuleGetOkResponse): RepoBranchSettingsFormFields => {
  const includedPatterns = data?.pattern?.include || []
  const excludedPatterns = data?.pattern?.exclude || []
  const formatPatterns = [
    ...includedPatterns.map(pat => ({ pattern: pat, option: PatternsButtonType.INCLUDE })),
    ...excludedPatterns.map(pat => ({ pattern: pat, option: PatternsButtonType.EXCLUDE }))
  ]

  const repoPatternsExcluded = data?.repo_target?.exclude?.patterns || []
  const repoPatternsIncluded = data?.repo_target?.include?.patterns || []

  const repoTargetsPattern = [
    ...repoPatternsIncluded.map(pat => ({ pattern: pat, option: PatternsButtonType.INCLUDE })),
    ...repoPatternsExcluded.map(pat => ({ pattern: pat, option: PatternsButtonType.EXCLUDE }))
  ]

  const targetReposIncluded =
    getTargetRepos(
      data?.repo_target?.include?.ids || [],
      TargetReposButtonType.SELECT_INCLUDED,
      data?.repositories || {}
    ) || []

  const targetReposExcluded =
    getTargetRepos(
      data?.repo_target?.exclude?.ids || [],
      TargetReposButtonType.SELECT_EXCLUDED,
      data?.repositories || {}
    ) || []

  const targetRepos = [...targetReposIncluded, ...targetReposExcluded]

  const rules = extractBranchRules(data)

  const { definition, description, identifier, state, pattern, users, user_groups } = data || {}

  const bypass = definition?.bypass?.user_ids
    ? definition?.bypass?.user_ids.reduce<RepoBranchSettingsFormFields['bypass']>((acc, userId) => {
        const user = users?.[userId]
        if (user) {
          acc.push({
            id: userId,
            key: user?.display_name || '',
            type: (user.type as EnumBypassListType) || EnumBypassListType.USER,
            title: user?.email || '',
            icon: user?.type === EnumBypassListType.USER ? 'user' : 'service-accounts'
          })
        }
        return acc
      }, [])
    : []

  const bypassUserGroups = definition?.bypass?.user_group_ids
    ? definition?.bypass?.user_group_ids.reduce<RepoBranchSettingsFormFields['bypass']>((acc, userGroupId) => {
        const userGroup = user_groups?.[userGroupId]
        if (userGroup) {
          acc.push({
            id: userGroupId,
            key: userGroup?.name || '',
            type: EnumBypassListType.USER_GROUP,
            title: userGroup?.identifier || '',
            icon: 'group-1'
          })
        }
        return acc
      }, [])
    : []

  return {
    identifier: identifier || '',
    description: description || '',
    pattern: '',
    patterns: formatPatterns,
    repoPattern: '',
    repoPatterns: repoTargetsPattern,
    targetRepos: targetRepos ?? [],
    rules: rules,
    state: state === 'active',
    bypass: [...bypass, ...bypassUserGroups],
    default: pattern?.default,
    repo_owners: definition?.bypass?.repo_owners
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
    type: 'branch',
    description: formOutput.description,
    state: (formOutput.state ? 'active' : 'disabled') as EnumRuleState,
    pattern: {
      default: formOutput.default || false,
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
            ? rulesMap[BranchRuleId.ENABLE_DEFAULT_REVIEWERS].selectOptions
                .filter(it => it.icon === EnumBypassListType.USER)
                .map(option => parseInt(String(option.id)))
            : [],
          default_user_group_reviewer_ids: rulesMap[BranchRuleId.ENABLE_DEFAULT_REVIEWERS]?.checked
            ? rulesMap[BranchRuleId.ENABLE_DEFAULT_REVIEWERS].selectOptions
                .filter(it => it.icon !== EnumBypassListType.USER)
                .map(option => parseInt(String(option.id)))
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
