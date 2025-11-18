import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  TypesUserGroupInfo,
  useListPrincipalsQuery,
  useListReposQuery,
  useListStatusCheckRecentSpaceQuery,
  useListUsergroupsQuery,
  useSpaceRuleAddMutation,
  useSpaceRuleGetQuery,
  useSpaceRuleUpdateMutation
} from '@harnessio/code-service-client'
import { MessageTheme, Skeleton } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { PrincipalType } from '@harnessio/ui/types'
import {
  getPushRules,
  NotFoundPage,
  PushRulesActionType,
  RepoPushRulesSettingsFormFields,
  RepoPushSettingsRulesPage,
  SandboxLayout
} from '@harnessio/ui/views'

import { useRoutes } from '../../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../../framework/hooks/useGetSpaceParam'
import { useIsMFE } from '../../../framework/hooks/useIsMFE'
import { useMFEContext } from '../../../framework/hooks/useMFEContext'
import { transformDataFromApi } from '../../../utils/repo-branch-rules-utils'
import { transformFormOutput } from '../../../utils/repo-push-rules-utils'
import { usePushRulesStore } from '../../repo/stores/repo-push-rules-store'
import { useProjectRulesStore } from '../stores/project-rules-store'

export const ProjectPushRulesContainer = () => {
  const { t } = useTranslation()
  const routes = useRoutes()
  const navigate = useNavigate()

  const spaceRef = useGetSpaceURLParam()
  const { ruleId: ruleIdentifier } = useParams()
  const { setPresetRuleData, setPrincipals, setUserGroups, setRecentStatusChecks } = useProjectRulesStore()
  const [principalsSearchQuery, setPrincipalsSearchQuery] = useState('')
  const { dispatch, resetRules } = usePushRulesStore()
  const [isSubmitSuccess, setIsSubmitSuccess] = useState<boolean>()
  const {
    scope: { accountId, orgIdentifier, projectIdentifier }
  } = useMFEContext()

  const pushRules = useMemo(() => {
    return getPushRules(t)
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
      space_ref: `${spaceRef}/+`,
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

  const { data: { body: recentStatusChecks } = {}, error: statusChecksError } = useListStatusCheckRecentSpaceQuery({
    space_ref: `${spaceRef}/+`,
    queryParams: {
      recursive: true
    }
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

  const handleRuleUpdate = (data: RepoPushRulesSettingsFormFields) => {
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
    dispatch({ type: PushRulesActionType.TOGGLE_RULE, ruleId, checked })
  }

  const handleInputChange = (ruleId: string, value: string) => {
    dispatch({ type: PushRulesActionType.SET_INPUT_VALUE, ruleId, value })
  }

  const handleInitialRules = useCallback(
    (presetRuleData: RepoPushRulesSettingsFormFields | null) => {
      if (!presetRuleData) {
        dispatch({
          type: PushRulesActionType.SET_INITIAL_RULES,
          payload: pushRules.map(rule => ({
            id: rule.id,
            checked: false,
            disabled: false,
            hidden: false,
            validationMessage: {
              theme: MessageTheme.DEFAULT,
              message: ''
            },
            input: ''
          }))
        })
        return
      }

      dispatch({
        type: PushRulesActionType.SET_INITIAL_RULES,
        payload: presetRuleData.rules.map(rule => ({
          id: rule.id,
          checked: rule.checked || false,
          disabled: rule.disabled || false,
          hidden: rule.hidden || false,
          validationMessage: rule.validationMessage || {
            theme: MessageTheme.DEFAULT,
            message: ''
          },
          input: rule.input || ''
        }))
      })
    },
    [pushRules, dispatch]
  )

  useEffect(() => {
    if (rulesData) {
      const transformedData = transformDataFromApi(rulesData)
      setPresetRuleData(transformedData)
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

  const [query, setQuery] = useState<string | null>('')
  const {
    data: { body: repoData } = {},
    refetch: refetchListRepos,
    isFetching,
    isError,
    error
  } = useListReposQuery(
    {
      queryParams: {
        query: query ?? '',
        recursive: true
      },
      space_ref: `${spaceRef}/+`
    },
    {
      retry: 5
    }
  )

  const errors = {
    principals: principalsError?.message || null,
    userGroups: userGroupsError?.message || null,
    statusChecks: statusChecksError?.message || null,
    addRule: addRuleError?.message || null,
    updateRule: updateRuleError?.message || null
  }

  if (!!ruleIdentifier && fetchRuleIsLoading) {
    return <Skeleton.Form className="w-full h-fit" linesCount={4} />
  }

  if (!!ruleIdentifier && !!fetchRuleError) {
    return <NotFoundPage pageTypeText="rules" />
  }

  const searchPlaceholder = isMFE
    ? t('views:pullRequests.selectUsersUGAndServiceAccounts', 'Select users, user groups and service accounts')
    : t('views:pullRequests.selectUsers', 'Select users')

  return (
    <SandboxLayout.Content>
      <RepoPushSettingsRulesPage
        handleRuleUpdate={handleRuleUpdate}
        apiErrors={errors}
        isLoading={addingRule || updatingRule}
        useRepoRulesStore={useProjectRulesStore}
        usePushRulesStore={usePushRulesStore}
        handleCheckboxChange={handleCheckboxChange}
        handleInputChange={handleInputChange}
        handleInitialRules={handleInitialRules}
        setPrincipalsSearchQuery={setPrincipalsSearchQuery}
        principalsSearchQuery={principalsSearchQuery}
        isSubmitSuccess={isSubmitSuccess}
        bypassListPlaceholder={searchPlaceholder}
        projectScope
        repoQueryObj={{
          repositories: repoData ?? [],
          refetchListRepos,
          isFetching,
          isError,
          error,
          query,
          setQuery
        }}
      />
    </SandboxLayout.Content>
  )
}
