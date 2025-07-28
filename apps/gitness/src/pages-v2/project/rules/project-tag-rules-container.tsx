import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  useListPrincipalsQuery,
  useListStatusCheckRecentSpaceQuery,
  useSpaceRuleAddMutation,
  useSpaceRuleGetQuery,
  useSpaceRuleUpdateMutation
} from '@harnessio/code-service-client'
import { SkeletonForm } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { PrincipalType } from '@harnessio/ui/types'
import {
  getTagRules,
  NotFoundPage,
  RepoTagSettingsFormFields,
  RepoTagSettingsRulesPage,
  TagRulesActionType
} from '@harnessio/ui/views'

import { useRoutes } from '../../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../../framework/hooks/useGetSpaceParam'
import { useMFEContext } from '../../../framework/hooks/useMFEContext'
import { transformDataFromApi } from '../../../utils/repo-branch-rules-utils'
import { transformFormOutput } from '../../../utils/repo-tag-rules-utils'
import { useTagRulesStore } from '../../repo/stores/repo-tags-rules-store'
import { useProjectRulesStore } from '../stores/project-rules-store'

export const ProjectTagRulesContainer = () => {
  const { t } = useTranslation()
  const routes = useRoutes()
  const navigate = useNavigate()

  const spaceRef = useGetSpaceURLParam()
  const { ruleId: ruleIdentifier } = useParams()
  const { setPresetRuleData, setPrincipals, setRecentStatusChecks } = useProjectRulesStore()
  const [principalsSearchQuery, setPrincipalsSearchQuery] = useState('')
  const { dispatch, resetRules } = useTagRulesStore()
  const [isSubmitSuccess, setIsSubmitSuccess] = useState<boolean>()
  const {
    scope: { accountId }
  } = useMFEContext()

  const tagRules = useMemo(() => {
    return getTagRules(t)
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
  } = useSpaceRuleGetQuery(
    { space_ref: `${spaceRef}/+` || '', rule_identifier: ruleIdentifier ?? '' },
    {
      enabled: !!ruleIdentifier
    }
  )

  const {
    mutate: addRule,
    error: addRuleError,
    isLoading: addingRule
  } = useSpaceRuleAddMutation(
    { space_ref: `${spaceRef}/+` || '' },
    {
      onSuccess: () => {
        setIsSubmitSuccess(true)
        navigate(routes.toProjectRules({ spaceRef }))
      }
    }
  )

  const { data: { body: principals } = {}, error: principalsError } = useListPrincipalsQuery({
    // @ts-expect-error : BE issue - not implemnted
    queryParams: { page: 1, limit: 100, type: 'user', query: principalsSearchQuery, accountIdentifier: accountId }
  })

  const { data: { body: recentStatusChecks } = {}, error: statusChecksError } = useListStatusCheckRecentSpaceQuery({
    space_ref: `${spaceRef}/+`,
    queryParams: {}
  })

  const {
    mutate: updateRule,
    error: updateRuleError,
    isLoading: updatingRule
  } = useSpaceRuleUpdateMutation(
    { space_ref: `${spaceRef}/+`, rule_identifier: ruleIdentifier! },
    {
      onSuccess: () => {
        setIsSubmitSuccess(true)
        navigate(routes.toProjectRules({ spaceRef }))
      }
    }
  )

  const handleRuleUpdate = (data: RepoTagSettingsFormFields) => {
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
    dispatch({ type: TagRulesActionType.TOGGLE_RULE, ruleId, checked })
  }

  const handleInitialRules = useCallback(
    (presetRuleData: RepoTagSettingsFormFields | null) => {
      if (!presetRuleData) {
        dispatch({
          type: TagRulesActionType.SET_INITIAL_RULES,
          payload: tagRules.map(rule => ({
            id: rule.id,
            checked: false,
            disabled: false
          }))
        })
        return
      }

      dispatch({
        type: TagRulesActionType.SET_INITIAL_RULES,
        payload: presetRuleData.rules.map(rule => ({
          id: rule.id,
          checked: rule.checked || false,
          disabled: rule.disabled || false
        }))
      })
    },
    [tagRules, dispatch]
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
    statusChecks: statusChecksError?.message || null,
    addRule: addRuleError?.message || null,
    updateRule: updateRuleError?.message || null
  }

  if (!!ruleIdentifier && fetchRuleIsLoading) {
    return <SkeletonForm className="mt-7" />
  }

  if (!!ruleIdentifier && !!fetchRuleError) {
    return <NotFoundPage pageTypeText="rules" />
  }

  return (
    <RepoTagSettingsRulesPage
      handleRuleUpdate={handleRuleUpdate}
      apiErrors={errors}
      isLoading={addingRule || updatingRule}
      useRepoRulesStore={useProjectRulesStore}
      useTagRulesStore={useTagRulesStore}
      handleCheckboxChange={handleCheckboxChange}
      handleInitialRules={handleInitialRules}
      setPrincipalsSearchQuery={setPrincipalsSearchQuery}
      principalsSearchQuery={principalsSearchQuery}
      isSubmitSuccess={isSubmitSuccess}
      projectScope
    />
  )
}
