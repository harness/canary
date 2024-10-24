import { RepoBranchSettingsRulesPage, RepoBranchSettingsFormFields, BypassUsersList } from '@harnessio/playground'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useState } from 'react'
import {
  useRuleAddMutation,
  useListPrincipalsQuery,
  useListStatusCheckRecentQuery,
  // EnumMergeMethod,
  // EnumRuleState,
  // RuleAddRequestBody,
  useRuleGetQuery,
  RuleGetOkResponse,
  RuleGetErrorResponse,
  useRuleUpdateMutation
  // RuleUpdateOkResponse,
  // RuleUpdateErrorResponse
} from '@harnessio/code-service-client'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { transformDataFromApi, transformFormOutput } from '../../utils/repo-branch-rules-utils'

export const RepoBranchSettingsRulesPageContainer = () => {
  const [preSetRuleData, setPreSetRuleData] = useState()
  const navigate = useNavigate()
  const repoRef = useGetRepoRef()
  const spaceId = useGetSpaceURLParam()
  const { identifier } = useParams()

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

  // console.log('in branch rules general container', preSetRuleData)

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
