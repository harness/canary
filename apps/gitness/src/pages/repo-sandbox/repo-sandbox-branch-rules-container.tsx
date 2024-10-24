import { RepoBranchSettingsRulesPage, RepoBranchSettingsFormFields, Rule, BypassUsersList } from '@harnessio/playground'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useState } from 'react'
import {
  useRuleAddMutation,
  useListPrincipalsQuery,
  useListStatusCheckRecentQuery,
  EnumMergeMethod,
  EnumRuleState,
  RuleAddRequestBody,
  useRuleGetQuery,
  RuleGetOkResponse,
  RuleGetErrorResponse,
  useRuleUpdateMutation,
  RuleUpdateOkResponse,
  RuleUpdateErrorResponse
} from '@harnessio/code-service-client'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'

export const RepoBranchSettingsRulesPageContainer = () => {
  const [preSetRuleData, setPreSetRuleData] = useState()
  const navigate = useNavigate()
  const repoRef = useGetRepoRef()
  const spaceId = useGetSpaceURLParam()
  const { identifier } = useParams()

  const ruleIds = [
    'require_latest_commit',
    'require_no_change_request',
    'comments',
    'status_checks',
    'merge',
    'delete_branch'
  ]

  if (identifier?.length) {
    useRuleGetQuery(
      { repo_ref: repoRef, rule_identifier: identifier },
      {
        onSuccess: (data: RuleGetOkResponse) => {
          const transformedData = transformDataFromApi(data)
          setPreSetRuleData(transformedData)
          // setApiError(null)
        },
        onError: (error: RuleGetErrorResponse) => {
          console.error('Error fetching rule:', error)
          // setApiError(error.message || 'Error fetching rule')
        }
      }
    )
  }
  function transformDataFromApi(data: RuleGetOkResponse) {
    const includedPatterns = data?.pattern?.include || []
    const excludedPatterns = data?.pattern?.exclude || []
    const formatPatterns = [
      ...includedPatterns.map(pat => ({ pattern: pat, option: 'Include' })),
      ...excludedPatterns.map(pat => ({ pattern: pat, option: 'Exclude' }))
    ]

    const rules = extractBranchRules(data.definition)

    return {
      identifier: data.identifier,
      description: data.description,
      pattern: data?.pattern?.default,
      patterns: formatPatterns,
      rules: rules,
      state: data.state === 'active',
      bypass: data?.definition?.bypass?.user_ids,
      access: '1',
      default: data?.pattern?.default,
      repo_owners: data?.definition?.bypass?.repo_owners
    }
  }

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
    // isSuccess: addRuleSuccess,
    isLoading: addingRule
  } = useRuleAddMutation(
    { repo_ref: repoRef },
    {
      onSuccess: () => {
        const repoName = repoRef.split('/')[1]

        navigate(`/sandbox/spaces/${spaceId}/repos/${repoName}/settings/general`)
      },
      onError: (error: RuleGetErrorResponse) => {
        console.error('Error fetching rule:', error)
        // setApiError(error.message || 'Error fetching rule')
      }
    }
  )

  const { data: principals, error: principalsError } = useListPrincipalsQuery({
    queryParams: { page: 1, limit: 100, type: 'user' }
  })

  const { data: recentStatusChecks, error: statusChecksError } = useListStatusCheckRecentQuery({
    repo_ref: repoRef,
    queryParams: {}
  })

  const {
    mutate: updateRule,
    error: updateRuleError,
    isSuccess: updateRuleSuccess,
    isLoading: updatingRule
  } = useRuleUpdateMutation(
    { repo_ref: repoRef, rule_identifier: identifier! },
    {
      onSuccess: () => {
        const repoName = repoRef.split('/')[1]

        navigate(`/sandbox/spaces/${spaceId}/repos/${repoName}/settings/general`)
      },
      onError: (error: RuleGetErrorResponse) => {
        console.error('Error fetching rule:', error)
        // setApiError(error.message || 'Error fetching rule')
      }
    }
  )

  // const handleRuleUpdate = (data: RepoBranchSettingsFormFields) => {
  //   const formattedData = transformFormOutput(data)
  //   addRule({
  //     body: formattedData
  //   })
  // }
  const handleRuleUpdate = (data: RepoBranchSettingsFormFields) => {
    const formattedData = transformFormOutput(data)

    if (identifier) {
      // Update existing rule
      updateRule({
        // repo_ref: repoRef,
        // rule_identifier: identifier,
        body: formattedData
      })
    } else {
      // Add new rule
      addRule({
        body: formattedData
      })
    }
  }

  const errors = {
    principals: principalsError?.message || null,
    statusChecks: statusChecksError?.message || null,
    addRule: addRuleError?.message || null
  }

  function extractBranchRules(definition: any) {
    const rules = []

    for (const rule of ruleIds) {
      let checked = false
      let submenu: string[] = []
      let selectOptions: string[] = []

      console.log('cinfirmong ehat strategies allowed looks like?', definition?.pullreq?.merge?.strategies_allowed)

      switch (rule) {
        case 'require_latest_commit':
          checked = definition?.pullreq?.approvals?.require_latest_commit || false
          break
        case 'require_no_change_request':
          checked = definition?.pullreq?.approvals?.require_no_change_request || false
          break
        case 'comments':
          checked = definition?.pullreq?.comments?.require_resolve_all || false
          break
        case 'status_checks':
          checked = definition?.pullreq?.status_checks?.require_identifiers?.length > 0
          selectOptions = definition?.pullreq?.status_checks?.require_identifiers || []
          break
        case 'merge':
          checked = definition?.pullreq?.merge?.strategies_allowed?.length > 0
          submenu = definition?.pullreq?.merge?.strategies_allowed || []
          break
        case 'delete_branch':
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

  console.log('in branch rules general container', preSetRuleData)

  return (
    <RepoBranchSettingsRulesPage
      handleRuleUpdate={handleRuleUpdate}
      principals={principals as BypassUsersList[]}
      recentStatusChecks={recentStatusChecks}
      apiErrors={errors}
      // addRuleSuccess={addRuleSuccess}
      isLoading={addingRule}
      preSetRuleData={preSetRuleData}
    />
  )
}
