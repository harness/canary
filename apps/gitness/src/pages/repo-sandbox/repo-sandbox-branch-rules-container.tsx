import { RepoBranchSettingsRulesPage, RepoBranchSettingsFormFields, Rule, BypassUsersList } from '@harnessio/playground'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'

import {
  useRuleAddMutation,
  useListPrincipalsQuery,
  useListStatusCheckRecentQuery,
  EnumMergeMethod,
  EnumRuleState,
  RuleAddRequestBody
} from '@harnessio/code-service-client'

export const RepoBranchSettingsRulesPageContainer = () => {
  const repoRef = useGetRepoRef()

  const transformFormOutput = (formOutput: RepoBranchSettingsFormFields) => {
    const rulesMap = formOutput.rules.reduce<Record<string, Rule>>((acc, rule) => {
      acc[rule.id] = rule
      return acc
    }, {})

    const { include, exclude } = formOutput.patterns.reduce<{ include: string[]; exclude: string[] }>(
      (acc, currentPattern) => {
        if (currentPattern.option === 'Include') {
          acc.include.push(currentPattern.pattern)
        } else if (currentPattern.option === 'Exclude') {
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

  const {
    mutate: addRule,
    error: addRuleError,
    isSuccess: addRuleSuccess,
    isLoading: addingRule
  } = useRuleAddMutation({ repo_ref: repoRef })

  const { data: principals, error: principalsError } = useListPrincipalsQuery({
    queryParams: { page: 1, limit: 100, type: 'user' }
  })

  const { data: recentStatusChecks, error: statusChecksError } = useListStatusCheckRecentQuery({
    repo_ref: repoRef,
    queryParams: {}
  })

  const handleRuleUpdate = (data: RepoBranchSettingsFormFields) => {
    const formattedData = transformFormOutput(data)
    addRule({
      body: formattedData
    })
  }

  const errors = {
    principals: principalsError?.message || null,
    statusChecks: statusChecksError?.message || null,
    addRule: addRuleError?.message || null
  }

  return (
    <RepoBranchSettingsRulesPage
      handleRuleUpdate={handleRuleUpdate}
      principals={principals as BypassUsersList[]}
      recentStatusChecks={recentStatusChecks}
      apiErrors={errors}
      addRuleSuccess={addRuleSuccess}
      isLoading={addingRule}
    />
  )
}
