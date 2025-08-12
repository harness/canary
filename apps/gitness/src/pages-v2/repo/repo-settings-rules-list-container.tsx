import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'

import {
  OpenapiRuleType,
  RepoRuleDeleteErrorResponse,
  RepoRuleListErrorResponse,
  useRepoRuleDeleteMutation,
  useRepoRuleListQuery
} from '@harnessio/code-service-client'
import { DeleteAlertDialog } from '@harnessio/ui/components'
import { wrapConditionalObjectElement } from '@harnessio/ui/utils'
import { ErrorTypes, RepoSettingsRulesPage } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoId } from '../../framework/hooks/useGetRepoId'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { PathParams } from '../../RouteDefinitions'
import { getScopedRuleUrl } from '../../utils/rule-url-utils'
import { useRepoRulesStore } from './stores/repo-settings-store'

export const RepoSettingsRulesListContainer = () => {
  const routes = useRoutes()
  const repoRef = useGetRepoRef()
  const repoName = useGetRepoId()
  const navigate = useNavigate()
  const { spaceId } = useParams<PathParams>()
  const queryClient = useQueryClient()
  const { setRules } = useRepoRulesStore()
  const [rulesSearchQuery, setRulesSearchQuery] = useState('')
  const [apiError, setApiError] = useState<{ type: ErrorTypes; message: string } | null>(null)
  const [isRuleAlertDeleteDialogOpen, setRuleIsAlertDeleteDialogOpen] = useState(false)
  const [alertDeleteParams, setAlertDeleteParams] = useState('')
  const [parentScopeLabelsChecked, setParentScopeLabelsChecked] = useState(false)
  const [ruleTypeFilter, setRuleTypeFilter] = useState<OpenapiRuleType | null>(null)

  const closeAlertDeleteDialog = () => {
    isRuleAlertDeleteDialogOpen && setRuleIsAlertDeleteDialogOpen(false)
  }
  const openRulesAlertDeleteDialog = (identifier: string) => {
    setAlertDeleteParams(identifier)
    setRuleIsAlertDeleteDialogOpen(true)
  }

  const {
    routes: { toAccountSettings, toOrgSettings, toProjectSettings },
    routeUtils,
    scope: { accountId, orgIdentifier, projectIdentifier }
  } = useMFEContext()

  const {
    data: { body: rulesData } = {},
    refetch: refetchRulesList,
    isLoading: isRulesLoading
  } = useRepoRuleListQuery(
    {
      repo_ref: repoRef,
      queryParams: {
        query: rulesSearchQuery,
        inherited: parentScopeLabelsChecked,
        // @ts-expect-error BE expects an array but the API only works with a string
        type: ruleTypeFilter ? ruleTypeFilter : undefined
      }
    },
    {
      onError: (error: RepoRuleListErrorResponse) => {
        const message = error.message || 'Error fetching rules'
        setApiError({ type: ErrorTypes.FETCH_RULES, message })
      }
    }
  )

  const { mutate: deleteRule, isLoading: isDeletingRule } = useRepoRuleDeleteMutation(
    { repo_ref: repoRef },
    {
      onSuccess: () => {
        refetchRulesList()
        setRuleIsAlertDeleteDialogOpen(false)
        setApiError(null)
      },
      onError: (error: RepoRuleDeleteErrorResponse) => {
        // Invalidate queries to refetch data from server
        queryClient.invalidateQueries(['ruleList', repoRef])

        const message = error.message || 'Error deleting rule'
        setApiError({ type: ErrorTypes.DELETE_RULE, message })
      }
    }
  )

  useEffect(() => {
    if (rulesData) {
      setRules(rulesData)
      setApiError(null)
    }
  }, [rulesData, setRules])

  const handleRuleClick = (identifier: string) => {
    navigate(routes.toRepoBranchRule({ spaceId, repoId: repoName, identifier }))
  }

  const handleDeleteRule = (identifier: string) => {
    deleteRule({ rule_identifier: identifier })
    navigate(routes.toRepoBranchRules({ spaceId, repoId: repoName, identifier }))
  }

  return (
    <>
      <RepoSettingsRulesPage
        handleRuleClick={handleRuleClick}
        openRulesAlertDeleteDialog={openRulesAlertDeleteDialog}
        useRepoRulesStore={useRepoRulesStore}
        rulesSearchQuery={rulesSearchQuery}
        setRulesSearchQuery={setRulesSearchQuery}
        isRulesLoading={isRulesLoading}
        apiError={apiError}
        toRepoBranchRuleCreate={() => routes.toRepoBranchRuleCreate({ spaceId, repoId: repoName })}
        toRepoTagRuleCreate={() => routes.toRepoTagRuleCreate({ spaceId, repoId: repoName })}
        parentScopeLabelsChecked={parentScopeLabelsChecked}
        onParentScopeLabelsChange={setParentScopeLabelsChecked}
        showParentScopeLabelsCheckbox
        ruleTypeFilter={ruleTypeFilter}
        setRuleTypeFilter={setRuleTypeFilter}
        toProjectRuleDetails={(identifier, scope) => {
          return getScopedRuleUrl({
            scope,
            identifier,
            toCODEManageRepositories: routeUtils.toCODEManageRepositories,
            toCODERule: routeUtils.toCODERule,
            toAccountSettings,
            toOrgSettings,
            toProjectSettings,
            toRepoBranchRule: routes.toRepoBranchRule,
            spaceId,
            repoId: repoName,
            accountId,
            orgIdentifier,
            projectIdentifier
          })
        }}
      />

      <DeleteAlertDialog
        open={isRuleAlertDeleteDialogOpen}
        onClose={closeAlertDeleteDialog}
        {...wrapConditionalObjectElement(
          {
            identifier: alertDeleteParams,
            deleteFn: handleDeleteRule,
            isLoading: isDeletingRule,
            error: apiError?.type === ErrorTypes.DELETE_RULE ? apiError : null,
            type: 'rule'
          },
          isRuleAlertDeleteDialogOpen
        )}
      />
    </>
  )
}
