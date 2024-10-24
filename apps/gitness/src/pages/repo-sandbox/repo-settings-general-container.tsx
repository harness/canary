import {
  RepoSettingsGeneralPage,
  RepoUpdateData,
  SecurityScanning,
  AccessLevel,
  ErrorTypes,
  RepoData,
  RuleDataType
} from '@harnessio/playground'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'

import {
  useFindRepositoryQuery,
  FindRepositoryOkResponse,
  FindRepositoryErrorResponse,
  useListBranchesQuery,
  ListBranchesOkResponse,
  ListBranchesErrorResponse,
  useUpdateRepositoryMutation,
  UpdateRepositoryErrorResponse,
  useUpdateDefaultBranchMutation,
  UpdateDefaultBranchErrorResponse,
  useUpdatePublicAccessMutation,
  UpdatePublicAccessErrorResponse,
  useFindSecuritySettingsQuery,
  FindSecuritySettingsOkResponse,
  FindSecuritySettingsErrorResponse,
  useUpdateSecuritySettingsMutation,
  UpdateSecuritySettingsOkResponse,
  UpdateSecuritySettingsErrorResponse,
  useDeleteRepositoryMutation,
  DeleteRepositoryOkResponse,
  DeleteRepositoryErrorResponse,
  useRuleListQuery,
  RuleListOkResponse,
  RuleListErrorResponse
} from '@harnessio/code-service-client'
import { useQueryClient } from '@tanstack/react-query'

import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export const RepoSettingsGeneralPageContainer = () => {
  const repoRef = useGetRepoRef()
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

  const { isLoading: isLoadingRepoData } = useFindRepositoryQuery(
    { repo_ref: repoRef },
    {
      onSuccess: (data: FindRepositoryOkResponse) => {
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
      onSuccess: (data: ListBranchesOkResponse) => {
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
      onSuccess: (data: RuleListOkResponse) => {
        const rulesData = data.map(rule => {
          return {
            targetPatternsCount: (rule.pattern?.include?.length ?? 0) + (rule.pattern?.exclude?.length ?? 0),
            rulesAppliedCount: Object.keys(rule.definition ?? {}).length,
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
      onMutate: async newData => {
        await queryClient.cancelQueries({ queryKey: ['findRepository', repoRef] })

        const previousRepoData = repoData

        // Optimistically update the description, mapping it to match repoData format
        setRepoData(prevState => ({
          ...prevState,
          description: newData.body.description || ''
        }))

        // Return the previous state for rollback if needed
        return { previousRepoData }
      },
      onError: (error: UpdateRepositoryErrorResponse, _data, context) => {
        setRepoData(context.previousRepoData)

        // Invalidate the query to refetch the data from the server
        queryClient.invalidateQueries({ queryKey: ['findRepository', repoRef] })

        const message = error.message || 'Error updating repository description'
        setApiError({ type: ErrorTypes.DESCRIPTION_UPDATE, message })
      },
      onSuccess: () => {
        setApiError(null)
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
      onMutate: async newData => {
        await queryClient.cancelQueries({ queryKey: ['listBranches', repoRef] })

        const previousRepoData = repoData

        // Optimistically update the default branch
        setRepoData(prevState => ({
          ...prevState,
          defaultBranch: newData.body.name || prevState.defaultBranch
        }))

        // Return the previous state for rollback if needed
        return { previousRepoData }
      },
      onError: (error: UpdateDefaultBranchErrorResponse, _data, context) => {
        setRepoData(context.previousRepoData)

        // Invalidate the query to refetch the data from the server
        queryClient.invalidateQueries({ queryKey: ['listBranches', repoRef] })

        const message = error.message || 'Error updating default branch'
        setApiError({ type: ErrorTypes.BRANCH_UPDATE, message })
      },
      onSuccess: () => {
        setApiError(null)
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
      onMutate: async newData => {
        await queryClient.cancelQueries({ queryKey: ['findRepository', repoRef] })

        const previousRepoData = repoData

        // Optimistically update the public access
        setRepoData(prevState => ({
          ...prevState,
          isPublic: newData.body.is_public !== undefined ? newData.body.is_public : prevState.isPublic
        }))

        // Return the previous state for rollback if needed
        return { previousRepoData }
      },
      onError: (error: UpdatePublicAccessErrorResponse, _data, context) => {
        setRepoData(context.previousRepoData)

        // Invalidate the query to refetch the data from the server
        queryClient.invalidateQueries({ queryKey: ['findRepository', repoRef] })

        const message = error.message || 'Error updating public access'
        setApiError({ type: ErrorTypes.UPDATE_ACCESS, message })
      },
      onSuccess: () => {
        setApiError(null)
      }
    }
  )

  const { isLoading: isLoadingSecuritySettings } = useFindSecuritySettingsQuery(
    { repo_ref: repoRef },
    {
      onSuccess: (data: FindSecuritySettingsOkResponse) => {
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
      onSuccess: (data: UpdateSecuritySettingsOkResponse) => {
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
      onSuccess: (_data: DeleteRepositoryOkResponse) => {
        navigate(`/sandbox/spaces/${spaceId}/repos`)
        setApiError(null)
      },
      onError: (error: DeleteRepositoryErrorResponse) => {
        const message = error.message || 'Error deleting repository'
        setApiError({ type: ErrorTypes.DELETE_REPO, message })
      }
    }
  )

  const handleDeleteRepository = () => {
    if (window.confirm('Are you sure you want to delete this repository?')) {
      deleteRepository({})
    }
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
    const repoName = repoRef.split('/')[1]

    const url = `/sandbox/spaces/${spaceId}/repos/${repoName}/settings/rules/${identifier}`

    navigate(url)
  }
  const loadingStates = {
    isLoadingRepoData: isLoadingBranches || isLoadingRepoData || isLoadingSecuritySettings,
    isUpdatingRepoData: updatingPublicAccess || updatingDescription || updatingBranch,
    isLoadingSecuritySettings,
    isDeletingRepo: isDeletingRepo,
    isUpdatingSecuritySettings: UpdatingSecuritySettings
  }
  return (
    <RepoSettingsGeneralPage
      repoData={repoData}
      handleRepoUpdate={handleRepoUpdate}
      securityScanning={securityScanning}
      handleUpdateSecuritySettings={handleUpdateSecuritySettings}
      handleDeleteRepository={handleDeleteRepository}
      apiError={apiError}
      loadingStates={loadingStates}
      isRepoUpdateSuccess={updatePublicAccessSuccess || updateDescriptionSuccess || updateBranchSuccess}
      rules={rules}
      handleRuleClick={handleRuleClick}
    />
  )
}
