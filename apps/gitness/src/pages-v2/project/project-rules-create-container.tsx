import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  useListPrincipalsQuery,
  useListStatusCheckRecentSpaceQuery,
  useSpaceRuleAddMutation,
  useSpaceRuleGetQuery,
  useSpaceRuleUpdateMutation
} from '@harnessio/code-service-client'
import { useTranslation } from '@harnessio/ui/context'
import { PrincipalType } from '@harnessio/ui/types'
import {
  BranchRulesActionType,
  getBranchRules,
  MergeStrategy,
  RepoBranchSettingsFormFields,
  RepoBranchSettingsRulesPage
} from '@harnessio/ui/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { transformDataFromApi, transformFormOutput } from '../../utils/repo-branch-rules-utils'
import { useBranchRulesStore } from '../repo/stores/repo-branch-rules-store'
import { useProjectRulesStore } from './stores/project-rules-store'

export const ProjectRulesCreateOrUpdateContainer = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const spaceURL = useGetSpaceURLParam()

  const { ruleId: ruleIdentifier } = useParams()
  const { setPresetRuleData, setPrincipals, setRecentStatusChecks } = useProjectRulesStore()
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

  const { data: { body: rulesData } = {} } = useSpaceRuleGetQuery(
    { space_ref: `${spaceURL}/+`, rule_identifier: ruleIdentifier ?? '' },
    {
      enabled: !!ruleIdentifier
    }
  )

  const {
    mutate: addRule,
    error: addRuleError,
    isLoading: addingRule
  } = useSpaceRuleAddMutation(
    { space_ref: `${spaceURL}/+` },
    {
      onSuccess: () => {
        setIsSubmitSuccess(true)
        navigate('..')
      }
    }
  )

  const { data: { body: principals } = {}, error: principalsError } = useListPrincipalsQuery({
    // @ts-expect-error : BE issue - not implemnted
    queryParams: { page: 1, limit: 100, type: 'user', query: principalsSearchQuery, accountIdentifier: accountId }
  })

  const {
    mutate: updateRule,
    error: updateRuleError,
    isLoading: updatingRule
  } = useSpaceRuleUpdateMutation(
    { space_ref: `${spaceURL}/+`, rule_identifier: ruleIdentifier! },
    {
      onSuccess: () => {
        setIsSubmitSuccess(true)
        navigate('..')
      }
    }
  )
  const { data: { body: recentStatusChecks } = {}, error: statusChecksError } = useListStatusCheckRecentSpaceQuery({
    space_ref: `${spaceURL}/+`,
    queryParams: {}
  })

  const handleRuleUpdate = (data: RepoBranchSettingsFormFields) => {
    const formattedData = transformFormOutput(data)

    if (ruleIdentifier) {
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
      const transformedData = transformDataFromApi(rulesData)
      setPresetRuleData(transformedData)
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
    addRule: addRuleError?.message || null,
    updateRule: updateRuleError?.message || null,
    statusChecks: statusChecksError?.message || null
  }

  return (
    <RepoBranchSettingsRulesPage
      handleRuleUpdate={handleRuleUpdate}
      apiErrors={errors}
      isLoading={addingRule || updatingRule}
      useRepoRulesStore={useProjectRulesStore}
      useBranchRulesStore={useBranchRulesStore}
      handleCheckboxChange={handleCheckboxChange}
      handleSubmenuChange={handleSubmenuChange}
      handleSelectChangeForRule={handleSelectChangeForRule}
      handleInputChange={handleInputChange}
      handleInitialRules={handleInitialRules}
      setPrincipalsSearchQuery={setPrincipalsSearchQuery}
      principalsSearchQuery={principalsSearchQuery}
      isSubmitSuccess={isSubmitSuccess}
      projectScope
    />
  )
}
