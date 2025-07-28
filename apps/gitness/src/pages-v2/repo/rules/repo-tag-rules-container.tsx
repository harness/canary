import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  useListPrincipalsQuery,
  useListStatusCheckRecentQuery,
  useListUsergroupsQuery,
  useRepoRuleAddMutation,
  useRepoRuleGetQuery,
  useRepoRuleUpdateMutation
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
import { useGetRepoId } from '../../../framework/hooks/useGetRepoId'
import { useGetRepoRef } from '../../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../../framework/hooks/useGetSpaceParam'
import { useIsMFE } from '../../../framework/hooks/useIsMFE'
import { useMFEContext } from '../../../framework/hooks/useMFEContext'
import { PathParams } from '../../../RouteDefinitions'
import { transformFormOutput } from '../../../utils/repo-tag-rules-utils'
import { useRepoRulesStore } from '../stores/repo-settings-store'
import { useTagRulesStore } from '../stores/repo-tags-rules-store'

export const RepoTagRulesContainer = () => {
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
  const { dispatch, resetRules } = useTagRulesStore()
  const [isSubmitSuccess, setIsSubmitSuccess] = useState<boolean>()
  const {
    scope: { accountId, orgIdentifier, projectIdentifier }
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
      setUserGroups(null)
      setRecentStatusChecks(null)
      resetRules()
    }
  }, [resetRules, setPresetRuleData, setPrincipals, setUserGroups, setRecentStatusChecks])

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

  const { data: { body: userGroups } = {}, error: userGroupsError } = useListUsergroupsQuery({
    space_ref: `${spaceURL}/+`,
    queryParams: {
      page: 1,
      limit: 100,
      query: principalsSearchQuery
    }
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
        navigate(routes.toRepoBranchRules({ spaceId, repoId: repoName }))
      }
    }
  )

  const handleRuleUpdate = (data: RepoTagSettingsFormFields) => {
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
      setPresetRuleData(rulesData)
    }
  }, [rulesData, setPresetRuleData])

  useEffect(() => {
    if (principals) {
      setPrincipals(principals as PrincipalType[])
    }
  }, [principals, setPrincipals])

  useEffect(() => {
    if (userGroups) {
      setUserGroups(userGroups as PrincipalType[])
    }
  }, [userGroups, setUserGroups])

  useEffect(() => {
    if (recentStatusChecks) {
      setRecentStatusChecks(recentStatusChecks)
    }
  }, [recentStatusChecks, setRecentStatusChecks])

  const errors = {
    principals: principalsError?.message || null,
    userGroupsError: userGroupsError?.message || null,
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

  const searchPlaceholder = isMFE
    ? t('views:pullRequests.selectUsersUGAndServiceAccounts', 'Select users, user groups and service accounts')
    : t('views:pullRequests.selectUsers', 'Select users')

  return (
    <RepoTagSettingsRulesPage
      handleRuleUpdate={handleRuleUpdate}
      apiErrors={errors}
      isLoading={addingRule || updatingRule}
      useRepoRulesStore={useRepoRulesStore}
      useTagRulesStore={useTagRulesStore}
      handleCheckboxChange={handleCheckboxChange}
      handleInitialRules={handleInitialRules}
      setPrincipalsSearchQuery={setPrincipalsSearchQuery}
      principalsSearchQuery={principalsSearchQuery}
      isSubmitSuccess={isSubmitSuccess}
      bypassListPlaceholder={searchPlaceholder}
    />
  )
}
