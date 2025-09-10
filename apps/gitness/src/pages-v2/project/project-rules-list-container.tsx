import { useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { OpenapiRuleType, useSpaceRuleDeleteMutation, useSpaceRuleListQuery } from '@harnessio/code-service-client'
import { DeleteAlertDialog } from '@harnessio/ui/components'
import { wrapConditionalObjectElement } from '@harnessio/ui/utils'
import { ErrorTypes, ProjectRulesPage } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { useQueryState } from '../../framework/hooks/useQueryState'
import usePaginationQueryStateWithStore from '../../hooks/use-pagination-query-state-with-store'
import { getTotalRulesApplied } from '../../utils/repo-branch-rules-utils'
import { getScopedRuleUrl } from '../../utils/rule-url-utils'
import { getSpaceRefByScope } from '../../utils/scope-url-utils'
import { useProjectRulesStore } from './stores/project-rules-store'

export const ProjectRulesListContainer = () => {
  const routes = useRoutes()
  const space_ref = useGetSpaceURLParam()

  const [query, setQuery] = useQueryState('query')
  const [page, setPage] = useState(1)
  const [showParentRules, setShowParentRules] = useState(false)
  const { queryPage } = usePaginationQueryStateWithStore({ page, setPage })
  const queryClient = useQueryClient()
  const { setRules } = useProjectRulesStore()
  const {
    routes: { toAccountSettings, toOrgSettings, toProjectSettings },
    routeUtils,
    scope: { accountId, orgIdentifier, projectIdentifier }
  } = useMFEContext()

  const [isRuleAlertDeleteDialogOpen, setRuleIsAlertDeleteDialogOpen] = useState(false)
  const [alertDeleteParams, setAlertDeleteParams] = useState<{ identifier: string; scope: number } | null>(null)
  const [ruleTypeFilter, setRuleTypeFilter] = useState<OpenapiRuleType | null>(null)
  const [apiError, setApiError] = useState<{ type: ErrorTypes; message: string } | null>(null)

  const closeAlertDeleteDialog = () => {
    isRuleAlertDeleteDialogOpen && setRuleIsAlertDeleteDialogOpen(false)
  }
  const openRulesAlertDeleteDialog = (identifier: string, scope: number) => {
    setAlertDeleteParams({ identifier, scope })
    setRuleIsAlertDeleteDialogOpen(true)
  }

  const {
    data: { body: rulesData, headers } = {},
    isLoading,
    refetch: refetchRulesList
  } = useSpaceRuleListQuery({
    space_ref: `${space_ref}/+`,
    queryParams: {
      page: queryPage,
      query: query ?? '',
      inherited: showParentRules,
      // @ts-expect-error BE expects an array but the API only works with a string
      type: ruleTypeFilter ? ruleTypeFilter : undefined
    }
  })

  const { mutate: deleteRule, isLoading: isDeletingRule } = useSpaceRuleDeleteMutation(
    { space_ref: `${space_ref}/+` },
    {
      onSuccess: () => {
        refetchRulesList()
        setRuleIsAlertDeleteDialogOpen(false)
        setApiError(null)
      },
      onError: error => {
        queryClient.invalidateQueries(['ruleList', `${space_ref}/+`])

        const message = error.message || 'Error deleting rule'
        setApiError({ type: ErrorTypes.DELETE_RULE, message })
      }
    }
  )

  useEffect(() => {
    if (rulesData) {
      const formattedRules = rulesData.map(rule => ({
        targetPatternsCount: (rule.pattern?.include?.length ?? 0) + (rule.pattern?.exclude?.length ?? 0),
        rulesAppliedCount: getTotalRulesApplied(rule),
        bypassAllowed:
          (rule.definition?.bypass?.user_ids?.length ?? 0) > 0 ||
          (rule.definition?.bypass?.user_group_ids?.length ?? 0) > 0 ||
          rule.definition?.bypass?.repo_owners === true,
        identifier: rule.identifier,
        state: rule.state ? String(rule.state) : undefined,
        type: rule.type as 'branch' | 'tag',
        scope: rule.scope
      }))
      setRules(formattedRules, headers)
      setApiError(null)
    }
  }, [rulesData, setRules, headers])

  const handleDeleteRule = (identifier: string) => {
    deleteRule({
      space_ref: `${getSpaceRefByScope(space_ref ?? '', alertDeleteParams?.scope ?? 0)}/+`,
      rule_identifier: identifier
    })
    queryClient.invalidateQueries(['ruleList', `${space_ref}/+`])
  }

  const handleRuleEditClick = (identifier: string, scope: number) => {
    getScopedRuleUrl({
      scope,
      identifier,
      toCODEManageRepositories: routeUtils?.toCODEManageRepositories,
      toCODERule: routeUtils?.toCODERule,
      toAccountSettings,
      toOrgSettings,
      toProjectSettings,
      accountId,
      orgIdentifier,
      projectIdentifier
    })
  }

  return (
    <>
      <ProjectRulesPage
        useProjectRulesStore={useProjectRulesStore}
        isLoading={isLoading}
        searchQuery={query}
        setSearchQuery={setQuery}
        openRulesAlertDeleteDialog={openRulesAlertDeleteDialog}
        page={page}
        setPage={setPage}
        apiError={apiError}
        handleRuleClick={handleRuleEditClick}
        toProjectBranchRuleCreate={() => routes.toProjectBranchRuleCreate({ spaceId: space_ref })}
        toProjectTagRuleCreate={() => routes.toProjectTagRuleCreate({ spaceId: space_ref })}
        toProjectRuleDetails={(identifier, scope) => {
          getScopedRuleUrl({
            scope,
            identifier,
            toCODEManageRepositories: routeUtils?.toCODEManageRepositories,
            toCODERule: routeUtils?.toCODERule,
            toAccountSettings,
            toOrgSettings,
            toProjectSettings,
            accountId,
            orgIdentifier,
            projectIdentifier
          })
        }}
        showParentScopeLabelsCheckbox={space_ref?.includes('/')}
        parentScopeLabelsChecked={showParentRules}
        onParentScopeLabelsChange={setShowParentRules}
        ruleTypeFilter={ruleTypeFilter}
        setRuleTypeFilter={setRuleTypeFilter}
      />
      <DeleteAlertDialog
        open={isRuleAlertDeleteDialogOpen}
        onClose={closeAlertDeleteDialog}
        {...wrapConditionalObjectElement(
          {
            identifier: alertDeleteParams?.identifier,
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
