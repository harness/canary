import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'

import {
  DeleteRepositoryErrorResponse,
  FindRepositoryErrorResponse,
  FindSecuritySettingsErrorResponse,
  RepoRuleDeleteErrorResponse,
  RepoRuleListErrorResponse,
  UpdateDefaultBranchErrorResponse,
  UpdatePublicAccessErrorResponse,
  UpdateRepositoryErrorResponse,
  UpdateSecuritySettingsErrorResponse,
  useDeleteRepositoryMutation,
  useFindRepositoryQuery,
  useFindSecuritySettingsQuery,
  useRepoRuleDeleteMutation,
  useRepoRuleListQuery,
  useUpdateDefaultBranchMutation,
  useUpdatePublicAccessMutation,
  useUpdateRepositoryMutation,
  useUpdateSecuritySettingsMutation
} from '@harnessio/code-service-client'
import { DeleteAlertDialog } from '@harnessio/ui/components'
import { wrapConditionalObjectElement } from '@harnessio/ui/utils'
import { AccessLevel, ErrorTypes, RepoSettingsGeneralPage, RepoUpdateData, SecurityScanning } from '@harnessio/ui/views'

import { BranchSelectorContainer } from '../../components-v2/branch-selector-container'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoId } from '../../framework/hooks/useGetRepoId'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { PathParams } from '../../RouteDefinitions'
import { useRepoRulesStore } from './stores/repo-settings-store'

export const RepoSettingsGeneralPageContainer = () => {
  const routes = useRoutes()
  const repoRef = useGetRepoRef()
  const repoName = useGetRepoId()
  const navigate = useNavigate()
  const { spaceId } = useParams<PathParams>()
  const queryClient = useQueryClient()
  const { setRepoData, setRules, setSecurityScanning } = useRepoRulesStore()
  const [rulesSearchQuery, setRulesSearchQuery] = useState('')
  const [apiError, setApiError] = useState<{ type: ErrorTypes; message: string } | null>(null)
  const [isRuleAlertDeleteDialogOpen, setRuleIsAlertDeleteDialogOpen] = useState(false)
  const [isRepoAlertDeleteDialogOpen, setRepoIsAlertDeleteDialogOpen] = useState(false)
  const [alertDeleteParams, setAlertDeleteParams] = useState('')

  const closeAlertDeleteDialog = () => {
    isRuleAlertDeleteDialogOpen && setRuleIsAlertDeleteDialogOpen(false)
    isRepoAlertDeleteDialogOpen && setRepoIsAlertDeleteDialogOpen(false)
  }
  const openRulesAlertDeleteDialog = (identifier: string) => {
    setAlertDeleteParams(identifier)
    setRuleIsAlertDeleteDialogOpen(true)
  }

  const openRepoAlertDeleteDialog = () => setRepoIsAlertDeleteDialogOpen(true)

  const { data: { body: repoData } = {}, isLoading: isLoadingRepoData } = useFindRepositoryQuery(
    { repo_ref: repoRef },
    {
      onError: (error: FindRepositoryErrorResponse) => {
        const message = error.message || 'Error fetching repo'
        setApiError({ type: ErrorTypes.FETCH_REPO, message })
      }
    }
  )

  const {
    data: { body: rulesData } = {},
    refetch: refetchRulesList,
    isLoading: isRulesLoading
  } = useRepoRuleListQuery(
    { repo_ref: repoRef, queryParams: { query: rulesSearchQuery } },
    {
      onError: (error: RepoRuleListErrorResponse) => {
        const message = error.message || 'Error fetching rules'
        setApiError({ type: ErrorTypes.FETCH_RULES, message })
      }
    }
  )

  const {
    mutateAsync: updateDescription,
    isLoading: updatingDescription,
    isSuccess: updateDescriptionSuccess
  } = useUpdateRepositoryMutation(
    { repo_ref: repoRef },
    {
      onSuccess: newData => {
        setApiError(null)
        setRepoData(newData.body)
      },
      onError: (error: UpdateRepositoryErrorResponse) => {
        queryClient.invalidateQueries({ queryKey: ['findRepository', repoRef] })

        const message = error.message || 'Error updating repository description'
        setApiError({ type: ErrorTypes.DESCRIPTION_UPDATE, message })
      }
    }
  )

  const { mutate: deleteRule, isLoading: isDeletingRule } = useRepoRuleDeleteMutation(
    { repo_ref: repoRef },
    {
      onSuccess: () => {
        refetchRulesList()
        setRepoIsAlertDeleteDialogOpen(false)
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

  const {
    mutateAsync: updateBranch,
    isLoading: updatingBranch,
    isSuccess: updateBranchSuccess
  } = useUpdateDefaultBranchMutation(
    { repo_ref: repoRef },
    {
      onSuccess: ({ body: newData }) => {
        setRepoData(newData)
        setApiError(null)
      },
      onError: (error: UpdateDefaultBranchErrorResponse) => {
        // Invalidate the query to refetch the data from the server
        queryClient.invalidateQueries({ queryKey: ['listBranches', repoRef] })

        const message = error.message || 'Error updating default branch'
        setApiError({ type: ErrorTypes.BRANCH_UPDATE, message })
      }
    }
  )

  const {
    mutateAsync: updatePublicAccess,
    isLoading: updatingPublicAccess,
    isSuccess: updatePublicAccessSuccess
  } = useUpdatePublicAccessMutation(
    { repo_ref: repoRef },
    {
      onSuccess: ({ body: newData }) => {
        setApiError(null)
        setRepoData(newData)
      },
      onError: (error: UpdatePublicAccessErrorResponse) => {
        // Invalidate the query to refetch the data from the server
        queryClient.invalidateQueries({ queryKey: ['findRepository', repoRef] })

        const message = error.message || 'Error updating public access'
        setApiError({ type: ErrorTypes.UPDATE_ACCESS, message })
      }
    }
  )

  const { isLoading: isLoadingSecuritySettings } = useFindSecuritySettingsQuery(
    { repo_ref: repoRef },
    {
      onSuccess: ({ body: data }) => {
        setSecurityScanning(data.secret_scanning_enabled || false)
        setApiError(null)
      },
      onError: (error: FindSecuritySettingsErrorResponse) => {
        const message = error.message || 'Error fetching security settings'
        setApiError({ type: ErrorTypes.FETCH_SECURITY, message })
      }
    }
  )

  const { mutate: updateSecuritySettings, isLoading: isUpdatingSecuritySettings } = useUpdateSecuritySettingsMutation(
    { repo_ref: repoRef },
    {
      onSuccess: ({ body: data }) => {
        setSecurityScanning(data.secret_scanning_enabled || false)
        setApiError(null)
      },
      onError: (error: UpdateSecuritySettingsErrorResponse) => {
        const message = error.message || 'Error updating security settings'
        setApiError({ type: ErrorTypes.UPDATE_SECURITY, message })
      }
    }
  )

  const { mutate: deleteRepository, isLoading: isDeletingRepo } = useDeleteRepositoryMutation(
    { repo_ref: repoRef },
    {
      onSuccess: ({ body: _data }) => {
        navigate(routes.toRepositories({ spaceId }))
        setApiError(null)
      },
      onError: (error: DeleteRepositoryErrorResponse) => {
        const message = error.message || 'Error deleting repository'
        setApiError({ type: ErrorTypes.DELETE_REPO, message })
      }
    }
  )

  const handleDeleteRepository = (identifier: string) => {
    deleteRepository({ repo_ref: identifier })
  }

  const handleRepoUpdate = async (data: RepoUpdateData) => {
    await Promise.all([
      updateDescription({ body: { description: data.description } }),
      updateBranch({ body: { name: data.branch } }),
      updatePublicAccess({ body: { is_public: data.access === AccessLevel.PUBLIC } })
    ])
    queryClient.invalidateQueries({ queryKey: ['listBranches', repoRef] })
    queryClient.invalidateQueries({ queryKey: ['findRepository', repoRef] })
  }

  useEffect(() => {
    if (!repoData) return

    setRepoData(repoData)
    setApiError(null)
  }, [repoData?.default_branch, repoData, setRepoData])

  useEffect(() => {
    if (rulesData) {
      setRules(rulesData)
      setApiError(null)
    }
  }, [rulesData, setRules])

  const handleUpdateSecuritySettings = (data: SecurityScanning) => {
    updateSecuritySettings({ body: { secret_scanning_enabled: data.secretScanning } })
  }

  const handleRuleClick = (identifier: string) => {
    navigate(routes.toRepoBranchRule({ spaceId, repoId: repoName, identifier }))
  }

  const handleDeleteRule = (identifier: string) => {
    deleteRule({ rule_identifier: identifier })
    navigate(routes.toRepoBranchRules({ spaceId, repoId: repoName, identifier }))
  }

  const loadingStates = {
    isLoadingRepoData: isLoadingRepoData || isLoadingSecuritySettings,
    isUpdatingRepoData: updatingPublicAccess || updatingDescription || updatingBranch,
    isLoadingSecuritySettings,
    isUpdatingSecuritySettings,
    isRulesLoading
  }

  return (
    <>
      <RepoSettingsGeneralPage
        handleRepoUpdate={handleRepoUpdate}
        handleUpdateSecuritySettings={handleUpdateSecuritySettings}
        apiError={apiError}
        loadingStates={loadingStates}
        isRepoUpdateSuccess={updatePublicAccessSuccess || updateDescriptionSuccess || updateBranchSuccess}
        useRepoRulesStore={useRepoRulesStore}
        handleRuleClick={handleRuleClick}
        openRulesAlertDeleteDialog={openRulesAlertDeleteDialog}
        openRepoAlertDeleteDialog={openRepoAlertDeleteDialog}
        rulesSearchQuery={rulesSearchQuery}
        setRulesSearchQuery={setRulesSearchQuery}
        branchSelectorRenderer={BranchSelectorContainer}
      />

      <DeleteAlertDialog
        open={isRuleAlertDeleteDialogOpen || isRepoAlertDeleteDialogOpen}
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
        {...wrapConditionalObjectElement(
          {
            identifier: repoRef,
            deleteFn: handleDeleteRepository,
            isLoading: isDeletingRepo,
            error: apiError?.type === ErrorTypes.DELETE_REPO ? apiError : null,
            type: 'repository'
          },
          isRepoAlertDeleteDialogOpen
        )}
      />
    </>
  )
}
