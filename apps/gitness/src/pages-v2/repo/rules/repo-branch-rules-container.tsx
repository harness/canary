import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  TypesUserGroupInfo,
  useListPrincipalsQuery,
  useListStatusCheckRecentQuery,
  useListUsergroupsQuery,
  useRepoRuleAddMutation,
  useRepoRuleGetQuery,
  useRepoRuleUpdateMutation
} from '@harnessio/code-service-client'
import { MessageTheme, MultiSelectOption, Skeleton } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { PrincipalType } from '@harnessio/ui/types'
import {
  BranchRuleId,
  BranchRulesActionType,
  getBranchRules,
  MergeStrategy,
  NotFoundPage,
  RepoBranchSettingsFormFields,
  RepoBranchSettingsRulesPage
} from '@harnessio/ui/views'

import { useRoutes } from '../../../framework/context/NavigationContext'
import { useGetRepoId } from '../../../framework/hooks/useGetRepoId'
import { useGetRepoRef } from '../../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../../framework/hooks/useGetSpaceParam'
import { useIsMFE } from '../../../framework/hooks/useIsMFE'
import { useMFEContext } from '../../../framework/hooks/useMFEContext'
import { PathParams } from '../../../RouteDefinitions'
import { transformFormOutput } from '../../../utils/repo-branch-rules-utils'
import { useBranchRulesStore } from '../stores/repo-branch-rules-store'
import { useRepoRulesStore } from '../stores/repo-settings-store'

export const RepoBranchRulesContainer = () => {
  const { t } = useTranslation()
  const routes = useRoutes()
  const navigate = useNavigate()
  const repoRef = useGetRepoRef()
  const repoName = useGetRepoId()

  const { spaceId } = useParams<PathParams>()
  const { identifier } = useParams()
  const spaceURL = useGetSpaceURLParam()
  const { setPresetRuleData, setPrincipals, setUserGroups, setRecentStatusChecks } = useRepoRulesStore()
  const [principalsSearchQuery, setPrincipalsSearchQuery] = useState('')
  const { dispatch, resetRules } = useBranchRulesStore()
  const [isSubmitSuccess, setIsSubmitSuccess] = useState<boolean>()
  const {
    scope: { accountId, orgIdentifier, projectIdentifier }
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
      setUserGroups(null)
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
        navigate(routes.toRepoBranchRules({ spaceId, repoId: repoName }))
      }
    }
  )

  const isMFE = useIsMFE()

  const { data: { body: principals } = {}, error: principalsError } = useListPrincipalsQuery({
    queryParams: {
      page: 1,
      limit: 100,
      type: isMFE ? ['user', 'serviceaccount'] : ['user'],
      ...(isMFE && { inherited: true }),
      query: principalsSearchQuery,
      // @ts-expect-error : BE issue - not implemented
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier
    },
    stringifyQueryParamsOptions: {
      arrayFormat: 'repeat'
    }
  })

  const { data: { body: userGroups } = {}, error: userGroupsError } = useListUsergroupsQuery(
    {
      space_ref: `${spaceURL}/+`,
      queryParams: {
        page: 1,
        limit: 100,
        query: principalsSearchQuery
      }
    },
    {
      enabled: isMFE
    }
  )

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
        navigate(routes.toRepoBranchRules({ spaceId, repoId: repoName }))
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

  const handleSelectChangeForRule = (ruleId: string, selectedOptions: MultiSelectOption[]) => {
    dispatch({
      type: BranchRulesActionType.SET_SELECT_OPTION,
      ruleId,
      selectedOptions
    })
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
            disabled: false,
            hidden: rule.id === BranchRuleId.REQUIRE_MINIMUM_DEFAULT_REVIEWER_COUNT,
            validationMessage: {
              theme: MessageTheme.DEFAULT,
              message: ''
            },
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
          disabled: rule.disabled || false,
          hidden: rule.hidden || false,
          validationMessage: rule.validationMessage || {
            theme: MessageTheme.DEFAULT,
            message: ''
          },
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
    if (principals || userGroups) {
      setPrincipals(principals as PrincipalType[])
      setUserGroups(userGroups as TypesUserGroupInfo[])
    }
  }, [principals, setPrincipals, userGroups, setUserGroups])

  useEffect(() => {
    if (recentStatusChecks) {
      setRecentStatusChecks(recentStatusChecks)
    }
  }, [recentStatusChecks, setRecentStatusChecks])

  const errors = {
    principals: principalsError?.message || null,
    userGroups: userGroupsError?.message || null,
    statusChecks: statusChecksError?.message || null,
    addRule: addRuleError?.message || null,
    updateRule: updateRuleError?.message || null
  }

  if (!!identifier && fetchRuleIsLoading) {
    return <Skeleton.Form className="mt-7" />
  }

  if (!!identifier && !!fetchRuleError) {
    return <NotFoundPage pageTypeText="rules" />
  }

  const searchPlaceholder = isMFE
    ? t('views:pullRequests.selectUsersUGAndServiceAccounts', 'Select users, user groups and service accounts')
    : t('views:pullRequests.selectUsers', 'Select users')

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
      bypassListPlaceholder={searchPlaceholder}
    />
  )
}
