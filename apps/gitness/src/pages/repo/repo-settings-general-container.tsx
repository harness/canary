import {
  RepoSettingsGeneralPage,
  RepoUpdateData,
  SecurityScanning,
  AccessLevel,
  ErrorTypes,
  RepoData,
  RuleDataType,
  DeleteTokenAlertDialog,
  AlertDeleteDialog
} from '@harnessio/views'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import {
  useFindRepositoryQuery,
  // FindRepositoryOkResponse,
  FindRepositoryErrorResponse,
  useListBranchesQuery,
  // ListBranchesOkResponse,
  ListBranchesErrorResponse,
  useUpdateRepositoryMutation,
  UpdateRepositoryErrorResponse,
  useUpdateDefaultBranchMutation,
  UpdateDefaultBranchErrorResponse,
  useUpdatePublicAccessMutation,
  UpdatePublicAccessErrorResponse,
  useFindSecuritySettingsQuery,
  FindSecuritySettingsErrorResponse,
  useUpdateSecuritySettingsMutation,
  UpdateSecuritySettingsErrorResponse,
  useDeleteRepositoryMutation,
  DeleteRepositoryErrorResponse,
  useRuleListQuery,
  RuleListErrorResponse,
  useRuleDeleteMutation,
  RuleDeleteErrorResponse
} from '@harnessio/code-service-client'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useGetRepoId } from '../../framework/hooks/useGetRepoId'
import { getTotalRulesApplied } from '../../utils/repo-branch-rules-utils'

export const RepoSettingsGeneralPageContainer = () => {
  const repoRef = useGetRepoRef()
  const repoName = useGetRepoId()
  const navigate = useNavigate()
  const spaceId = useGetSpaceURLParam()
  const queryClient = useQueryClient()

  const [repoData, setRepoData] = useState<RepoData>({
    name: '',
    description: '',
    defaultBranch: '',
    isPublic: false,
    branches: []
  })
  const [rules, setRules] = useState<RuleDataType[] | null>(null)

  const [securityScanning, setSecurityScanning] = useState<boolean>(false)
  const [apiError, setApiError] = useState<{ type: ErrorTypes; message: string } | null>(null)
  const [isRulesAlertDeleteDialogOpen, setIsRulesAlertDeleteDialogOpen] = useState<boolean>(false)
  const [isRepoAlertDeleteDialogOpen, setRepoAlertDeleteDialogOpen] = useState<boolean>(false)
  const [alertDeleteParams, setAlertDeleteParams] = useState<string>('')

  const closeRulesAlertDeleteDialog = () => setIsRulesAlertDeleteDialogOpen(false)
  const openRulesAlertDeleteDialog = (identifier: string) => {
    setAlertDeleteParams(identifier)
    setIsRulesAlertDeleteDialogOpen(true)
  }

  const closeRepoAlertDeleteDialog = () => setRepoAlertDeleteDialogOpen(false)
  const openRepoAlertDeleteDialog = () => setRepoAlertDeleteDialogOpen(true)

  const { isLoading: isLoadingRepoData } = useFindRepositoryQuery(
    { repo_ref: repoRef },
    {
      onSuccess: ({ body: data }) => {
        setRepoData({
          name: data.identifier || '',
          description: data.description || '',
          defaultBranch: data.default_branch || '',
          isPublic: data.is_public ?? false,
          branches: []
        })
        setApiError(null)
      },
      onError: (error: FindRepositoryErrorResponse) => {
        const message = error.message || 'Error fetching repo'
        setApiError({ type: ErrorTypes.FETCH_REPO, message })
      }
    }
  )

  const { isLoading: isLoadingBranches } = useListBranchesQuery(
    {
      repo_ref: repoRef,
      queryParams: {
        order: 'asc',
        page: 1,
        limit: 100
      }
    },
    {
      onSuccess: ({ body: data }) => {
        setRepoData(prevState => ({
          ...prevState,
          branches: data
        }))
        setApiError(null)
      },
      onError: (error: ListBranchesErrorResponse) => {
        const message = error.message || 'Error fetching branches'
        setApiError({ type: ErrorTypes.FETCH_BRANCH, message })
      }
    }
  )

  useRuleListQuery(
    {
      repo_ref: repoRef,
      queryParams: {}
    },
    {
      onSuccess: ({ body: data }) => {
        const rulesData = data.map(rule => {
          return {
            targetPatternsCount: (rule.pattern?.include?.length ?? 0) + (rule.pattern?.exclude?.length ?? 0),
            rulesAppliedCount: getTotalRulesApplied(rule),
            bypassAllowed: rule.definition?.bypass?.repo_owners === true,
            identifier: rule.identifier,
            state: rule.state ? String(rule.state) : undefined
          }
        })
        setRules(rulesData)
        setApiError(null)
      },
      onError: (error: RuleListErrorResponse) => {
        const message = error.message || 'Error fetching rules'
        setApiError({ type: ErrorTypes.FETCH_RULES, message })
      }
    }
  )

  const {
    mutate: updateDescription,
    isLoading: updatingDescription,
    isSuccess: updateDescriptionSuccess
  } = useUpdateRepositoryMutation(
    { repo_ref: repoRef },
    {
      onSuccess: newData => {
        setApiError(null)
        setRepoData(prevState => ({
          ...prevState,
          description: newData.body.description || ''
        }))
      },
      onError: (error: UpdateRepositoryErrorResponse) => {
        queryClient.invalidateQueries({ queryKey: ['findRepository', repoRef] })

        const message = error.message || 'Error updating repository description'
        setApiError({ type: ErrorTypes.DESCRIPTION_UPDATE, message })
      }
    }
  )

  const { mutate: deleteRule, isLoading: isDeletingRule } = useRuleDeleteMutation(
    { repo_ref: repoRef }, // Assuming repoRef is available in your component
    {
      onSuccess: (_data, variables) => {
        setRules(currentRules =>
          currentRules ? currentRules.filter(rule => rule.identifier !== variables.rule_identifier) : null
        )
        setIsRulesAlertDeleteDialogOpen(false)
        setApiError(null)
      },
      onError: (error: RuleDeleteErrorResponse) => {
        // Invalidate queries to refetch data from server
        queryClient.invalidateQueries(['ruleList', repoRef])

        const message = error.message || 'Error deleting rule'
        setApiError({ type: ErrorTypes.DELETE_RULE, message })
      }
    }
  )

  const {
    mutate: updateBranch,
    isLoading: updatingBranch,
    isSuccess: updateBranchSuccess
  } = useUpdateDefaultBranchMutation(
    { repo_ref: repoRef },
    {
      onSuccess: ({ body: newData }) => {
        setRepoData(prevState => ({
          ...prevState,
          defaultBranch: newData.identifier || prevState.defaultBranch
        }))
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
    mutate: updatePublicAccess,
    isLoading: updatingPublicAccess,
    isSuccess: updatePublicAccessSuccess
  } = useUpdatePublicAccessMutation(
    { repo_ref: repoRef },
    {
      onSuccess: ({ body: newData }) => {
        setApiError(null)
        setRepoData(prevState => ({
          ...prevState,
          isPublic: newData.is_public !== undefined ? newData.is_public : prevState.isPublic
        }))
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

  const { mutate: updateSecuritySettings, isLoading: UpdatingSecuritySettings } = useUpdateSecuritySettingsMutation(
    { repo_ref: repoRef },
    {
      onSuccess: ({ body: data }) => {
        setRepoData(prevState => ({
          ...prevState,
          securitySettings: data
        }))
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
        navigate(`/spaces/${spaceId}/repos`)
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

  const handleRepoUpdate = (data: RepoUpdateData) => {
    updateDescription({
      body: {
        description: data.description
      }
    })
    updateBranch({
      body: {
        name: data.branch
      }
    })
    updatePublicAccess({
      body: {
        is_public: data.access === AccessLevel.PUBLIC
      }
    })
  }

  const handleUpdateSecuritySettings = (data: SecurityScanning) => {
    updateSecuritySettings({
      body: {
        secret_scanning_enabled: data.secretScanning
      }
    })
  }

  const handleRuleClick = (identifier: string) => {
    const url = `/spaces/${spaceId}/repos/${repoName}/settings/rules/create/${identifier}`

    navigate(url)
  }

  const handleDeleteRule = (ruleIdentifier: string) => {
    deleteRule({ rule_identifier: ruleIdentifier })
  }

  const loadingStates = {
    isLoadingRepoData: isLoadingBranches || isLoadingRepoData || isLoadingSecuritySettings,
    isUpdatingRepoData: updatingPublicAccess || updatingDescription || updatingBranch,
    isLoadingSecuritySettings,
    isUpdatingSecuritySettings: UpdatingSecuritySettings
  }
  return (
    <>
      <RepoSettingsGeneralPage
        repoData={repoData}
        handleRepoUpdate={handleRepoUpdate}
        securityScanning={securityScanning}
        handleUpdateSecuritySettings={handleUpdateSecuritySettings}
        apiError={apiError}
        loadingStates={loadingStates}
        isRepoUpdateSuccess={updatePublicAccessSuccess || updateDescriptionSuccess || updateBranchSuccess}
        rules={rules}
        handleRuleClick={handleRuleClick}
        openRulesAlertDeleteDialog={openRulesAlertDeleteDialog}
        openRepoAlertDeleteDialog={openRepoAlertDeleteDialog}
      />
      <DeleteTokenAlertDialog
        open={isRulesAlertDeleteDialogOpen}
        onClose={closeRulesAlertDeleteDialog}
        deleteFn={handleDeleteRule}
        error={apiError}
        type="rule"
        identifier={alertDeleteParams}
        isLoading={isDeletingRule}
      />
      <AlertDeleteDialog
        open={isRepoAlertDeleteDialogOpen}
        onOpenChange={closeRepoAlertDeleteDialog}
        handleDeleteRepository={handleDeleteRepository}
        identifier={repoRef}
        isDeletingRepo={isDeletingRepo}
        error={apiError?.type === ErrorTypes.DELETE_REPO ? apiError.message : null}
        type="repository"
      />
    </>
  )
}
