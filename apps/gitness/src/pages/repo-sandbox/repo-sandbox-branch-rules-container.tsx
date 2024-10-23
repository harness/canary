import { RepoBranchSettingsRulesPage } from '@harnessio/playground'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import {
  useRuleAddMutation,
  RuleAddOkResponse,
  RuleAddErrorResponse,
  useListPrincipalsQuery,
  ListPrincipalsOkResponse,
  ListPrincipalsErrorResponse,
  useListStatusCheckRecentQuery,
  ListStatusCheckRecentOkResponse,
  ListStatusCheckRecentErrorResponse
} from '@harnessio/code-service-client'

export const RepoBranchSettingsRulesPageContainer = () => {
  const repoRef = useGetRepoRef()

  const transformFormOutput = formOutput => {
    // Create a rules map for efficient lookups
    const rulesMap = formOutput.rules.reduce((acc, rule) => {
      acc[rule.id] = rule
      return acc
    }, {})

    const { include, exclude } = formOutput.patterns.reduce(
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

    const transformed = {
      identifier: formOutput.identifier || '',
      type: 'branch',
      description: formOutput.description || '',
      state: formOutput.state === true ? 'active' : 'disabled',
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
            strategies_allowed: rulesMap['merge']?.submenu || [],
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

  const { mutate: addRule } = useRuleAddMutation(
    { repo_ref: repoRef },
    {
      onSuccess: (data: RuleAddOkResponse) => {
        console.log('successsful call', data)
      },
      onError: (error: RuleAddErrorResponse) => {
        console.error(error)
      }
    }
  )

  const { data: principals } = useListPrincipalsQuery(
    { queryParams: { page: 1, limit: 100, type: 'user' } }
    // {
    //   onSuccess: data => {
    //     console.log('Fetched principals:', data)
    //   },
    //   onError: error => {
    //     console.error('Error fetching principals:', error)
    //   }
    // }
  )

  const { data: recentStatusChecks } = useListStatusCheckRecentQuery({
    repo_ref: repoRef,
    queryParams: {}
  })

  const handleRuleUpdate = data => {
    const formattedData = transformFormOutput(data)
    addRule({
      body: formattedData
    })
  }

  return (
    <RepoBranchSettingsRulesPage
      handleRuleUpdate={handleRuleUpdate}
      principals={principals}
      recentStatusChecks={recentStatusChecks}
    />
  )
}
