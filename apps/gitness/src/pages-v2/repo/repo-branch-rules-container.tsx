import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  useListPrincipalsQuery,
  useListStatusCheckRecentQuery,
  useRepoRuleAddMutation,
  useRepoRuleGetQuery,
  useRepoRuleUpdateMutation
} from '@harnessio/code-service-client'
import { SkeletonForm } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { PrincipalType } from '@harnessio/ui/types'
import {
  BranchRulesActionType,
  getBranchRules,
  MergeStrategy,
  NotFoundPage,
  RepoBranchSettingsFormFields,
  RepoBranchSettingsRulesPage
} from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoId } from '../../framework/hooks/useGetRepoId'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { PathParams } from '../../RouteDefinitions'
import { transformFormOutput } from '../../utils/repo-branch-rules-utils'
import { useBranchRulesStore } from './stores/repo-branch-rules-store'
import { useRepoRulesStore } from './stores/repo-settings-store'

export const RepoBranchSettingsRulesPageContainer = () => {
  const { t } = useTranslation()
  const routes = useRoutes()
  const navigate = useNavigate()
  const repoRef = useGetRepoRef()
  const repoName = useGetRepoId()

  const { spaceId } = useParams<PathParams>()
  const { identifier } = useParams()
  const { setPresetRuleData, setPrincipals, setRecentStatusChecks } = useRepoRulesStore()
  const [principalsSearchQuery, setPrincipalsSearchQuery] = useState('')
  const { dispatch, resetRules } = useBranchRulesStore()
  const [isSubmitSuccess, setIsSubmitSuccess] = useState<boolean>()
  const {
    scope: { accountId }
  } = useMFEContext()

  const branchRules = useMemo(() => {
    return getBranchRules(t)
  }, [t])

  /**
   * Reset form data
   */
  useEffect(() => {
    return () => {
      setPresetRuleData(null)
      setPrincipals(null)
      setRecentStatusChecks(null)
      resetRules()
    }
  }, [resetRules, setPresetRuleData, setPrincipals, setRecentStatusChecks])

  const {
    data: { body: rulesData } = {},
    error: fetchRuleError,
    isLoading: fetchRuleIsLoading
  } = useRepoRuleGetQuery(
    { repo_ref: repoRef, rule_identifier: identifier ?? '' },
    {
      enabled: !!identifier
    }
  )

  const {
    mutate: addRule,
    error: addRuleError,
    isLoading: addingRule
  } = useRepoRuleAddMutation(
    { repo_ref: repoRef },
    {
      onSuccess: () => {
        setIsSubmitSuccess(true)
        navigate(routes.toRepoGeneralSettings({ spaceId, repoId: repoName }))
      }
    }
  )

  const { data: { body: principals } = {}, error: principalsError } = useListPrincipalsQuery({
    // @ts-expect-error : BE issue - not implemnted
    queryParams: { page: 1, limit: 100, type: 'user', query: principalsSearchQuery, accountIdentifier: accountId }
  })

  const { data: { body: recentStatusChecks } = {}, error: statusChecksError } = useListStatusCheckRecentQuery({
    repo_ref: repoRef,
    queryParams: {}
  })

  const {
    mutate: updateRule,
    error: updateRuleError,
    isLoading: updatingRule
  } = useRepoRuleUpdateMutation(
    { repo_ref: repoRef, rule_identifier: identifier! },
    {
      onSuccess: () => {
        setIsSubmitSuccess(true)
        navigate(routes.toRepoGeneralSettings({ spaceId, repoId: repoName }))
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

  const handleInitialRules = useCallback(
    (presetRuleData: RepoBranchSettingsFormFields | null) => {
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
    },
    [branchRules, dispatch]
  )

  useEffect(() => {
    if (rulesData) {
      setPresetRuleData(rulesData)
    }
  }, [rulesData, setPresetRuleData])

  useEffect(() => {
    if (principals) {
      setPrincipals(principals as PrincipalType[])
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

  if (!!identifier && fetchRuleIsLoading) {
    return <SkeletonForm className="mt-7" />
  }

  if (!!identifier && !!fetchRuleError) {
    return <NotFoundPage pageTypeText="rules" />
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
      setPrincipalsSearchQuery={setPrincipalsSearchQuery}
      principalsSearchQuery={principalsSearchQuery}
      isSubmitSuccess={isSubmitSuccess}
    />
  )
}
