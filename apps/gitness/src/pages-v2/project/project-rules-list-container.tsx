import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'

import { useSpaceRuleDeleteMutation, useSpaceRuleListQuery } from '@harnessio/code-service-client'
import { DeleteAlertDialog } from '@harnessio/ui/components'
import { wrapConditionalObjectElement } from '@harnessio/ui/utils'
import { ErrorTypes, ProjectRulesPage } from '@harnessio/ui/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useQueryState } from '../../framework/hooks/useQueryState'
import usePaginationQueryStateWithStore from '../../hooks/use-pagination-query-state-with-store'
import { getTotalRulesApplied } from '../../utils/repo-branch-rules-utils'
import { useProjectRulesStore } from './stores/project-rules-store'

export const ProjectRulesListContainer = () => {
  const space_ref = useGetSpaceURLParam()
  const [query, setQuery] = useQueryState('query')
  const [page, setPage] = useState(1)
  const { queryPage } = usePaginationQueryStateWithStore({ page, setPage })
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { setRules } = useProjectRulesStore()

  const [isRuleAlertDeleteDialogOpen, setRuleIsAlertDeleteDialogOpen] = useState(false)
  const [alertDeleteParams, setAlertDeleteParams] = useState('')
  const [apiError, setApiError] = useState<{ type: ErrorTypes; message: string } | null>(null)

  const closeAlertDeleteDialog = () => {
    isRuleAlertDeleteDialogOpen && setRuleIsAlertDeleteDialogOpen(false)
  }
  const openRulesAlertDeleteDialog = (identifier: string) => {
    setAlertDeleteParams(identifier)
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
      query: query ?? ''
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
        bypassAllowed: rule.definition?.bypass?.repo_owners === true,
        identifier: rule.identifier,
        state: rule.state ? String(rule.state) : undefined
      }))
      setRules(formattedRules, headers)
      setApiError(null)
    }
  }, [rulesData, setRules, headers])

  const handleDeleteRule = (identifier: string) => {
    deleteRule({ rule_identifier: identifier })
    queryClient.invalidateQueries(['ruleList', `${space_ref}/+`])
  }

  const handleRuleEditClick = (identifier: string) => {
    navigate(`${identifier}`)
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
