import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  useListPrincipalsQuery,
  useListStatusCheckRecentQuery,
  useRuleAddMutation,
  useRuleGetQuery,
  useRuleUpdateMutation
} from '@harnessio/code-service-client'
import {
  branchRules,
  BranchRulesActionType,
  BypassUsersList,
  MergeStrategy,
  RepoBranchSettingsFormFields,
  RepoBranchSettingsRulesPage
} from '@harnessio/ui/views'

import { useGetRepoId } from '../../framework/hooks/useGetRepoId'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { transformFormOutput } from '../../utils/repo-branch-rules-utils'
import { useBranchRulesStore } from './stores/repo-branch-rules-store'
import { useRepoRulesStore } from './stores/repo-settings-store'

export const RepoBranchSettingsRulesPageContainer = () => {
  const navigate = useNavigate()
  const repoRef = useGetRepoRef()
  const repoName = useGetRepoId()

  const spaceId = useGetSpaceURLParam()
  const { identifier } = useParams()
  const { setPresetRuleData, setPrincipals, setRecentStatusChecks } = useRepoRulesStore()
  const { dispatch } = useBranchRulesStore()

  useEffect(() => {
    if (!identifier) {
      setPresetRuleData(null)
      setPrincipals(null)
      setRecentStatusChecks(null)
    }
  }, [identifier, setPresetRuleData, setPrincipals, setRecentStatusChecks])

  const { data: { body: rulesData } = {} } = useRuleGetQuery(
    { repo_ref: repoRef, rule_identifier: identifier ?? '' },
    {
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

        navigate(`/${spaceId}/repos/${repoName}/settings/general`)
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
        navigate(`/${spaceId}/repos/${repoName}/settings/general`)
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

  const handleCheckboxChange = (ruleId: string, checked: boolean) => {
    dispatch({ type: BranchRulesActionType.TOGGLE_RULE, ruleId, checked })
  }

  const handleSubmenuChange = (ruleId: string, submenuId: string, checked: boolean) => {
    dispatch({ type: BranchRulesActionType.TOGGLE_SUBMENU, ruleId, submenuId, checked })
  }

  const handleSelectChangeForRule = (ruleId: string, checkName: string) => {
    dispatch({ type: BranchRulesActionType.SET_SELECT_OPTION, ruleId, checkName })
  }

  const handleInputChange = (ruleId: string, value: string) => {
    dispatch({ type: BranchRulesActionType.SET_INPUT_VALUE, ruleId, value })
  }

  const handleInitialRules = (presetRuleData: RepoBranchSettingsFormFields | null) => {
    if (!presetRuleData) {
      dispatch({
        type: BranchRulesActionType.SET_INITIAL_RULES,
        payload: branchRules.map(rule => ({
          id: rule.id,
          checked: false,
          submenu: [],
          selectOptions: [],
          input: ''
        }))
      })
      return
    }
    dispatch({
      type: BranchRulesActionType.SET_INITIAL_RULES,
      payload: presetRuleData.rules.map(rule => ({
        id: rule.id,
        checked: rule.checked || false,
        submenu: (rule.submenu || []) as MergeStrategy[],
        selectOptions: rule.selectOptions || [],
        input: rule.input || ''
      }))
    })
  }

  useEffect(() => {
    if (rulesData) {
      setPresetRuleData(rulesData)
    }
  }, [rulesData, setPresetRuleData])

  useEffect(() => {
    if (principals) {
      setPrincipals(principals as BypassUsersList[])
    }
  }, [principals, setPrincipals])

  useEffect(() => {
    if (recentStatusChecks) {
      setRecentStatusChecks(recentStatusChecks)
    }
  }, [recentStatusChecks, setRecentStatusChecks])

  const errors = {
    principals: principalsError?.message || null,
    statusChecks: statusChecksError?.message || null,
    addRule: addRuleError?.message || null,
    updateRule: updateRuleError?.message || null
  }

  return (
    <RepoBranchSettingsRulesPage
      handleRuleUpdate={handleRuleUpdate}
      apiErrors={errors}
      isLoading={addingRule || updatingRule}
      useRepoRulesStore={useRepoRulesStore}
      useBranchRulesStore={useBranchRulesStore}
      handleCheckboxChange={handleCheckboxChange}
      handleSubmenuChange={handleSubmenuChange}
      handleSelectChangeForRule={handleSelectChangeForRule}
      handleInputChange={handleInputChange}
      handleInitialRules={handleInitialRules}
    />
  )
}
