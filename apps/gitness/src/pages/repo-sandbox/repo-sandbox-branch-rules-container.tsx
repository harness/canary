import { RepoBranchSettingsRulesPage } from '@harnessio/playground'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useRuleAddMutation, RuleAddOkResponse, RuleAddErrorResponse } from '@harnessio/code-service-client'

export const RepoBranchSettingsRulesPageContainer = () => {
  const repoRef = useGetRepoRef()
  function transformFormOutput(formOutput) {
    const transformed = {
      identifier: formOutput.identifier || '',
      type: 'branch',
      description: formOutput.description || '',
      state: formOutput.state === true ? 'active' : 'inactive',
      pattern: {
        default: formOutput.default || false,
        exclude: [],
        include: []
      },
      definition: {
        bypass: {
          user_ids: [Number(formOutput.bypass)],
          repo_owners: formOutput.repo_owners || false
        },
        pullreq: {
          approvals: {
            require_code_owners: true,
            require_latest_commit: formOutput.rules.find(rule => rule.id === 'require_latest_commit')?.checked || false,
            require_no_change_request:
              formOutput.rules.find(rule => rule.id === 'require_no_change_request')?.checked || false
          },
          comments: {
            require_resolve_all: formOutput.rules.find(rule => rule.id === 'comments')?.checked || false
          },
          merge: {
            strategies_allowed: formOutput.rules.find(rule => rule.id === 'merge')?.submenu || [],
            delete_branch: formOutput.rules.find(rule => rule.id === 'delete_branch')?.checked || false
          },
          status_checks: {
            require_identifiers: formOutput.rules.find(rule => rule.id === 'status_checks')?.selectOptions
              ? [formOutput.rules.find(rule => rule.id === 'status_checks')?.selectOptions]
              : []
          }
        }
        // lifecycle: {
        //   create_forbidden: true, // Assuming static
        //   delete_forbidden: true, // Assuming static
        //   update_forbidden: true // Assuming static
        // }
      }
    }

    return transformed
  }

  const addRuleMutation = useRuleAddMutation(
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

  const handleRuleUpdate = data => {
    const formattedData = transformFormOutput(data)
    addRuleMutation.mutate({
      body: formattedData
    })
  }

  return <RepoBranchSettingsRulesPage handleRuleUpdate={handleRuleUpdate} />
}
