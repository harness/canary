import { RepoBranchSettingsRulesPage, RepoBranchSettingsFormFields, BypassUsersList } from '@harnessio/playground'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useGetRepoId } from '../../framework/hooks/useGetRepoId'

import { useState } from 'react'
import {
  useRuleAddMutation,
  useListPrincipalsQuery,
  useListStatusCheckRecentQuery,
  useRuleGetQuery,
  useRuleUpdateMutation
} from '@harnessio/code-service-client'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { transformDataFromApi, transformFormOutput } from '../../utils/repo-branch-rules-utils'

export const RepoBranchSettingsRulesPageContainer = () => {
  const [preSetRuleData, setPreSetRuleData] = useState<RepoBranchSettingsFormFields | null>(null)
  const navigate = useNavigate()
  const repoRef = useGetRepoRef()
  const repoName = useGetRepoId()

  const spaceId = useGetSpaceURLParam()
  const { identifier } = useParams()

  useRuleGetQuery(
    { repo_ref: repoRef, rule_identifier: identifier ?? '' },
    {
      onSuccess: ({ body: data }) => {
        const transformedData = transformDataFromApi(data)
        setPreSetRuleData(transformedData)
      },
      enabled: !!identifier
    }
  )

  const {
    mutate: addRule,
    error: addRuleError,
    isLoading: addingRule
  } = useRuleAddMutation(
    { repo_ref: repoRef },
    {
      onSuccess: () => {
        const repoName = repoRef.split('/')[1]

        navigate(`/sandbox/spaces/${spaceId}/repos/${repoName}/settings/general`)
      }
    }
  )

  const { data: { body: principals } = {}, error: principalsError } = useListPrincipalsQuery({
    // @ts-expect-error : BE issue - not implemnted
    queryParams: { page: 1, limit: 100, type: 'user' }
  })

  const { data: { body: recentStatusChecks } = {}, error: statusChecksError } = useListStatusCheckRecentQuery({
    repo_ref: repoRef,
    queryParams: {}
  })

  const {
    mutate: updateRule,
    error: updateRuleError,
    isLoading: updatingRule
  } = useRuleUpdateMutation(
    { repo_ref: repoRef, rule_identifier: identifier! },
    {
      onSuccess: () => {
        navigate(`/sandbox/spaces/${spaceId}/repos/${repoName}/settings/general`)
      }
    }
  )

  const handleRuleUpdate = (data: RepoBranchSettingsFormFields) => {
    const formattedData = transformFormOutput(data)

    if (identifier) {
      // Update existing rule
      updateRule({
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
    addRule: addRuleError?.message || null,
    updateRule: updateRuleError?.message || null
  }

  return (
    <RepoBranchSettingsRulesPage
      handleRuleUpdate={handleRuleUpdate}
      principals={principals as BypassUsersList[]}
      recentStatusChecks={recentStatusChecks}
      apiErrors={errors}
      isLoading={addingRule || updatingRule}
      preSetRuleData={preSetRuleData}
    />
  )
}
